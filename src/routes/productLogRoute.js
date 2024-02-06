const express = require("express");
const router = express.Router();
const productLogController = require("../controllers/productLogController")

router.get("/", productLogController.getAllLogs);
router.post("/", productLogController.newLog);
router.get("/:id", productLogController.getLogById);
router.get("/product/:id", productLogController.getLogByProductId)
router.put("/:id", productLogController.updateLog);
router.delete("/:id", productLogController.deleteLog);

module.exports = router;
