const express = require("express");
const router = express.Router();

const productRoute = require("./productRoute");
const productLogRoute = require("./productLogRoute");
const salesLogRoute = require("./salesLogRoute");

router.get("/", (req, res) => {
  res.send("API untuk Koperasi");
});

router.use("/product", productRoute);
router.use("/log", productLogRoute);
router.use("/sales", salesLogRoute);

module.exports = router;
