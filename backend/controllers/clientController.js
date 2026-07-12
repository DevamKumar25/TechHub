import asyncHandler from "../utils/asyncHandler.js";
import Client from "../models/client.js";
import { generateClientId } from "../utils/generateId.js";

// @desc    List clients with search / status / payment filter / sort / pagination
// @route   GET /api/clients?search=&status=&payment=&sort=&page=&limit=
export const getClients = asyncHandler(async (req, res) => {
  const { search, status, payment, sort = "newest", page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { clientName: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } },
      { clientId: { $regex: search, $options: "i" } },
    ];
  }

  if (status && status !== "All") query.status = status;

  if (payment === "Pending") query.pendingAmount = { $gt: 0 };
  if (payment === "Cleared") query.pendingAmount = { $lte: 0 };

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name_asc: { clientName: 1 },
    name_desc: { clientName: -1 },
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [clients, total] = await Promise.all([
    Client.find(query)
      .populate("projects", "projectName projectLogo")
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(Number(limit)),
    Client.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: clients.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: clients,
  });
});

// @desc    Stat cards: Total / Active / Inactive Clients, Pending Amount
// @route   GET /api/clients/stats
export const getClientStats = asyncHandler(async (req, res) => {
  const [total, active, inactive, pendingAgg] = await Promise.all([
    Client.countDocuments(),
    Client.countDocuments({ status: "Active" }),
    Client.countDocuments({ status: "Inactive" }),
    Client.aggregate([{ $group: { _id: null, total: { $sum: "$pendingAmount" } } }]),
  ]);

  res.json({
    success: true,
    data: {
      totalClients: total,
      activeClients: active,
      inactiveClients: inactive,
      pendingAmount: pendingAgg[0]?.total || 0,
    },
  });
});

// @desc    Lightweight list for the "Search Client" dropdown on Add Project
// @route   GET /api/clients/dropdown
export const getClientsForDropdown = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = search
    ? { clientName: { $regex: search, $options: "i" } }
    : {};

  const clients = await Client.find(query)
    .select("clientName clientId phoneNumber")
    .sort({ clientName: 1 })
    .limit(50);

  res.json({ success: true, data: clients });
});

// @desc    Get single client
// @route   GET /api/clients/:id
export const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id).populate(
    "projects",
    "projectName projectId projectType status totalCost pendingAmount"
  );

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  res.json({ success: true, data: client });
});

// @desc    Create client (Add Client form)
// @route   POST /api/clients
export const createClient = asyncHandler(async (req, res) => {
  const clientId = await generateClientId();
  const payload = { ...req.body, clientId };

  // If "POC is same as Client" is checked, mirror the client's own contact info
  if (payload.pocSameAsClient) {
    payload.poc = {
      name: payload.clientName,
      mobileNumber: payload.phoneNumber,
    };
  }

  const client = await Client.create(payload);
  res.status(201).json({ success: true, data: client });
});

// @desc    Update client
// @route   PUT /api/clients/:id
export const updateClient = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (payload.pocSameAsClient) {
    payload.poc = {
      name: payload.clientName,
      mobileNumber: payload.phoneNumber,
    };
  }

  const client = await Client.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  res.json({ success: true, data: client });
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
export const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id);

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  res.json({ success: true, data: {} });
});