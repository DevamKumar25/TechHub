import asyncHandler from "../utils/asyncHandler.js";
import Employee from "../models/employee.js";
import { generateEmployeeId } from "../utils/generateId.js";

// Recomputes the "X% Completed" figure shown in the list, based on which
// optional profile fields are actually filled in.
const REQUIRED_ALWAYS_FILLED = [
  "employeeId",
  "name",
  "email",
  "designation",
  "department",
  "branch",
  "joiningDate",
];
const OPTIONAL_TRACKED_FIELDS = [
  "profilePhoto",
  "phoneNumber",
  "address",
  "aadhaarNo",
  "panNumber",
];

const calculateProfileCompletion = (data) => {
  const totalFields = REQUIRED_ALWAYS_FILLED.length + OPTIONAL_TRACKED_FIELDS.length;
  const filled =
    REQUIRED_ALWAYS_FILLED.filter((field) => Boolean(data[field])).length +
    OPTIONAL_TRACKED_FIELDS.filter((field) => Boolean(data[field])).length;

  return Math.round((filled / totalFields) * 100);
};

// @desc    List employees - search by ID/name/email/designation, department + status filters
// @route   GET /api/employees?search=&department=&status=&page=&limit=
export const getEmployees = asyncHandler(async (req, res) => {
  const { search, department, status, page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
      { employeeId: { $regex: search, $options: "i" } },
    ];
  }

  if (department && department !== "All Departments") query.department = department;
  if (status && status !== "All Statuses") query.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [employees, total] = await Promise.all([
    Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Employee.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: employees.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: employees,
  });
});

// @desc    Lightweight list for the "+ Add Team Member" picker on Add Project
// @route   GET /api/employees/dropdown
export const getEmployeesForDropdown = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { employeeId: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const employees = await Employee.find({ ...query, status: "Active" })
    .select("name employeeId designation profilePhoto department")
    .sort({ name: 1 })
    .limit(50);

  res.json({ success: true, data: employees });
});

// @desc    Export the (filtered) employee list as CSV — powers the "Export" button
// @route   GET /api/employees/export?search=&department=&status=
export const exportEmployees = asyncHandler(async (req, res) => {
  const { search, department, status } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
      { employeeId: { $regex: search, $options: "i" } },
    ];
  }

  if (department && department !== "All Departments") query.department = department;
  if (status && status !== "All Statuses") query.status = status;

  const employees = await Employee.find(query).sort({ createdAt: -1 });

  const header = [
    "Employee ID",
    "Name",
    "Email",
    "Designation",
    "Department",
    "Branch",
    "Joining Date",
    "Status",
    "Profile Completion",
  ];
  const rows = employees.map((employee) => [
    employee.employeeId,
    employee.name,
    employee.email,
    employee.designation,
    employee.department,
    employee.branch,
    employee.joiningDate ? employee.joiningDate.toISOString().split("T")[0] : "",
    employee.status,
    `${employee.profileCompletion}%`,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="employees.csv"');
  res.send(csv);
});

// @desc    Get single employee
// @route   GET /api/employees/:id
export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  res.json({ success: true, data: employee });
});

// @desc    Create employee (Add Employee form)
// @route   POST /api/employees
export const createEmployee = asyncHandler(async (req, res) => {
  const employeeId = await generateEmployeeId();
  const payload = { ...req.body, employeeId };

  payload.profileCompletion = calculateProfileCompletion(payload);

  const employee = await Employee.create(payload);
  res.status(201).json({ success: true, data: employee });
});

// @desc    Update employee
// @route   PUT /api/employees/:id
export const updateEmployee = asyncHandler(async (req, res) => {
  const existing = await Employee.findById(req.params.id);

  if (!existing) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const merged = { ...existing.toObject(), ...req.body };
  const payload = { ...req.body, profileCompletion: calculateProfileCompletion(merged) };

  const employee = await Employee.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: employee });
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  res.json({ success: true, data: {} });
});