const express = require("express");
const router = express.Router();
const salesLogController = require("../controllers/salesLogController");

router.get("/", salesLogController.getAllSales);
router.post("/", salesLogController.newSales);
router.get("/:id", salesLogController.getOneSale);
router.put("/:id", salesLogController.updateSales);
router.delete("/:id", salesLogController.deleteSales);

module.exports = router;
