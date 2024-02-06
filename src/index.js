require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/mainRoute");
const pool = require("./configs/dbConfig");
const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  let client = pool.connect();
  console.log(`Running on port ${port}`);
  if (client !== null) {
    console.log("DB Connected");
  }
});

app.use("/", mainRouter);
