const Service = require("../models/Service");
const AppError = require("../utils/AppError");

exports.getAll = async () => {
  return Service.find().sort({ createdAt: -1 });
};

exports.getById = async (id) => {
  const service = await Service.findById(id);
  if (!service) {
    throw new AppError("Service not found", 404);
  }
  return service;
};
