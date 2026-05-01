const AppError = require("../utils/AppError");

/**
 * Generic request-body validator.
 * Takes a map of field names → validation rules and returns express middleware.
 *
 * Usage:
 *   validate({
 *     email: { required: true, match: /^\S+@\S+\.\S+$/, label: "Email" },
 *     password: { required: true, minLength: 6, label: "Password" },
 *   })
 */
const validate = (schema) => (req, _res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];
    const label = rules.label || field;

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${label} is required`);
      continue;
    }

    if (value === undefined || value === null) continue;

    if (rules.minLength && typeof value === "string" && value.length < rules.minLength) {
      errors.push(`${label} must be at least ${rules.minLength} characters`);
    }

    if (rules.match && !rules.match.test(value)) {
      errors.push(`${label} is invalid`);
    }

    if (rules.isDate && isNaN(Date.parse(value))) {
      errors.push(`${label} must be a valid date`);
    }

    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${label} must be one of: ${rules.enum.join(", ")}`);
    }
  }

  if (errors.length) {
    return next(new AppError(errors.join(". "), 400));
  }

  next();
};

module.exports = validate;
