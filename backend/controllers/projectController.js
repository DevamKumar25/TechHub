import asyncHandler from "../utils/asyncHandler.js";
import Project from "../models/project.js";
import Client from "../models/client.js";
import Employee from "../models/employee.js";
import { generateProjectId } from "../utils/generateId.js";

const syncEmployeeProjectReferences = async (project, previousEmployeeIds = []) => {
  const currentEmployeeIds = (project.team || [])
    .map((member) => member.employee?.toString())
    .filter(Boolean);

  const previousSet = new Set(previousEmployeeIds.map((id) => id.toString()));
  const currentSet = new Set(currentEmployeeIds);

  const toAdd = currentEmployeeIds.filter((id) => !previousSet.has(id));
  const toRemove = previousEmployeeIds.filter((id) => !currentSet.has(id.toString()));

  await Promise.all([
    toAdd.length
      ? Employee.updateMany({ _id: { $in: toAdd } }, { $addToSet: { projects: project._id } })
      : Promise.resolve(),
    toRemove.length
      ? Employee.updateMany({ _id: { $in: toRemove } }, { $pull: { projects: project._id } })
      : Promise.resolve(),
  ]);
};

// @desc    List projects - search by name/client/type/employee, status + type filters, sort
// @route   GET /api/projects?search=&status=&type=&sort=&page=&limit=
export const getProjects = asyncHandler(async (req, res) => {
  const { search, status, type, sort = "newest", page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { projectName: { $regex: search, $options: "i" } },
      { clientName: { $regex: search, $options: "i" } },
      { projectType: { $regex: search, $options: "i" } },
      { projectId: { $regex: search, $options: "i" } },
    ];
  }

  if (status && status !== "All Status") query.status = status;
  if (type && type !== "All Types") query.projectType = type;

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    cost_high: { totalCost: -1 },
    cost_low: { totalCost: 1 },
  };

  const skip = (Number(page) - 1) * Number(limit);

  // Searching by employee name (per the placeholder "...or employee") requires
  // matching against the populated team, so we run that as a secondary pass
  // when a plain field search finds nothing and a search term was given.
  let baseQuery = query;

  if (search) {
    const matchingEmployeeIds = await Employee.find({ name: { $regex: search, $options: "i" } }).select("_id");

    if (matchingEmployeeIds.length) {
      baseQuery = {
        $or: [...(query.$or || []), { "team.employee": { $in: matchingEmployeeIds.map((employee) => employee._id) } }],
      };
    }
  }

  const [projects, total] = await Promise.all([
    Project.find(baseQuery)
      .populate("client", "clientName clientId")
      .populate("team.employee", "name profilePhoto designation")
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(Number(limit)),
    Project.countDocuments(baseQuery),
  ]);

  res.json({
    success: true,
    count: projects.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: projects,
  });
});

// @desc    Stat cards: Total / Active Projects, Collecting Money, Pending Amount
// @route   GET /api/projects/stats
export const getProjectStats = asyncHandler(async (req, res) => {
  const [total, active, moneyAgg] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: "Active" }),
    Project.aggregate([
      {
        $group: {
          _id: null,
          collecting: { $sum: { $subtract: ["$totalCost", "$pendingAmount"] } },
          pending: { $sum: "$pendingAmount" },
        },
      },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalProjects: total,
      activeProjects: active,
      collectingMoney: moneyAgg[0]?.collecting || 0,
      pendingAmount: moneyAgg[0]?.pending || 0,
    },
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("client", "clientName clientId phoneNumber email")
    .populate("team.employee", "name profilePhoto designation employeeId");

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json({ success: true, data: project });
});

// @desc    Create project (Add Project form)
// @route   POST /api/projects
export const createProject = asyncHandler(async (req, res) => {
  const { client } = req.body;

  const clientDoc = await Client.findById(client);
  if (!clientDoc) {
    res.status(400);
    throw new Error("Selected client does not exist");
  }

  const projectId = await generateProjectId();
  const project = await Project.create({
    ...req.body,
    projectId,
    clientName: clientDoc.clientName,
  });

  await syncEmployeeProjectReferences(project);

  // Keep the client's "Total Services" count in sync with its project count
  clientDoc.totalServices += 1;
  await clientDoc.save();

  res.status(201).json({ success: true, data: project });
});

// @desc    Update project
// @route   PUT /api/projects/:id
export const updateProject = asyncHandler(async (req, res) => {
  const existingProject = await Project.findById(req.params.id);
  if (!existingProject) {
    res.status(404);
    throw new Error("Project not found");
  }

  const payload = { ...req.body };

  // If the client is being changed, refresh the denormalized clientName too
  if (payload.client) {
    const clientDoc = await Client.findById(payload.client);
    if (!clientDoc) {
      res.status(400);
      throw new Error("Selected client does not exist");
    }
    payload.clientName = clientDoc.clientName;
  }

  const project = await Project.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (Object.prototype.hasOwnProperty.call(req.body, "team")) {
    await syncEmployeeProjectReferences(project, existingProject.team.map((member) => member.employee));
  }

  res.json({ success: true, data: project });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Keep the client's "Total Services" count accurate
  await Client.findByIdAndUpdate(project.client, { $inc: { totalServices: -1 } });
  await Employee.updateMany({ projects: project._id }, { $pull: { projects: project._id } });

  res.json({ success: true, data: {} });
});

// @desc    Add a team member - powers "+ Add Team Member" on Add Project
// @route   POST /api/projects/:id/team
export const addTeamMember = asyncHandler(async (req, res) => {
  const { employee, roleInProject } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const alreadyAssigned = project.team.some((teamMember) => teamMember.employee.toString() === employee);
  if (alreadyAssigned) {
    res.status(400);
    throw new Error("Employee is already assigned to this project");
  }

  const previousEmployeeIds = project.team.map((member) => member.employee);
  project.team.push({ employee, roleInProject });
  await project.save();
  await syncEmployeeProjectReferences(project, previousEmployeeIds);

  const populated = await project.populate("team.employee", "name profilePhoto designation");
  res.status(201).json({ success: true, data: populated });
});

// @desc    Remove a team member
// @route   DELETE /api/projects/:id/team/:employeeId
export const removeTeamMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  project.team = project.team.filter((teamMember) => teamMember.employee.toString() !== req.params.employeeId);
  await project.save();

  res.json({ success: true, data: project });
});