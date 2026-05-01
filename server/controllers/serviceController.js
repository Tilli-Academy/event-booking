const serviceService = require("../services/serviceService");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/services
exports.getAll = asyncHandler(async (_req, res) => {
  const services = await serviceService.getAll();

  res.json({ success: true, count: services.length, data: services });
});

// GET /api/services/:id
exports.getById = asyncHandler(async (req, res) => {
  const service = await serviceService.getById(req.params.id);

  res.json({ success: true, data: service });
});
