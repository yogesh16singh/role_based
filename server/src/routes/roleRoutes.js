const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

router.get("/", roleController.getRoles);
router.post("/", roleController.createRole);
router.put("/:id", roleController.updateRole);
router.delete("/:id", roleController.deleteRole);

module.exports = router;
