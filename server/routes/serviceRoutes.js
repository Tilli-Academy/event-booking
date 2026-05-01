const router = require("express").Router();
const { getAll, getById } = require("../controllers/serviceController");

router.get("/", getAll);
router.get("/:id", getById);

module.exports = router;
