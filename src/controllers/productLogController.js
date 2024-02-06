const pool = require("../configs/dbConfig");

const getAllLogs = async (req, res) => {
  const searchTerm = req.query.q;
  const client = await pool.connect();
  let result;
  try {
    if (!searchTerm) {
      result = await client.query("select * from productLog");
    } else {
      result = await client.query(
        "select * from productLog where lower(logType) like lower($1) or productId::text like $2 or quantity::text like $3",
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
      );
    }
    if (result.rows.length === 0) {
      res.status(404).send({
        message: searchTerm ? "Product's Log Not Found" : "Log is NULL",
        data: null,
      });
      return;
    }
    res.status(200).send({
      message: "OK",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      data: error.message,
    });
  } finally {
    client.release();
  }
};

const getLogByProductId = async (req, res) => {
  productId = req.params.id;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "select * from productLog where productId=$1",
      [productId]
    );
    if (result.rows.length === 0) {
      res.status(404).send({
        message: "Log with Specified Product ID Not Found",
        data: null,
      });
      return;
    }
    res.status(200).send({
      message: "OK",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      data: error.message,
    });
  } finally {
    client.release();
  }
};

const getLogById = async (req, res) => {
  id = req.params.id;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "select * from productLog where productLogId=$1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).send({
        message: "Log with Specified ID Not Found",
        data: null,
      });
      return;
    }
    res.status(200).send({
      message: "OK",
      data: result.rows,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      data: error.message,
    });
  } finally {
    client.release();
  }
};

const updateLog = async (req, res) => {
  id = req.params.id;
  const client = await pool.connect();
  const { productId, logType, quantity } = req.body;
  try {
    const oldLog = await client.query(
      "select * from productLog where productLogId=$1",
      [id]
    );
    if (oldLog.rows.length === 0) {
      res.status(404).send({
        message: "Log with Specified ID Not Found",
        data: null,
      });
      return;
    }
    const updated = await client.query(
      "update productLog set productId=$1, logType=$2, quantity=$3 where productLogId=$4 returning *",
      [productId, logType, quantity, id]
    );
    if (updated.rows.length === 0) {
      res.status(200).send({
        message: "OK",
        data: updated.rows[0],
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      data: error.message,
    });
  } finally {
    client.release();
  }
};

const deleteLog = async (req, res) => {
  id = req.params.id;
  const client = await pool.connect();
  try {
    const log = await client.query(
      "select * from productLog where productLogId=$1",
      [id]
    );
    if (log.rows.length === 0) {
      res.status(404).send({
        message: "Log with Specified ID Not Found",
        data: null,
      });
      return;
    }
    const result = await client.query(
      "delete from productLog where productLogId=$1 returning *",
      [id]
    );
    res.status(200).send({
      message: "OK",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      data: error.message,
    });
  } finally {
    client.release();
  }
};

const newLog = async (req, res) => {
  const { productId, logType, quantity } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "insert into productLog (productId, logType, quantity) values ($1, $2, $3) returning *",
      [productId, logType, quantity]
    );
    if (result.rows.length === 0) {
      res.status(500).send({
        message: "Not Inserted",
        data: null,
      });
      return;
    }
    res.status(200).send({
      message: "OK",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      data: error.message,
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllLogs,
  getLogById,
  getLogByProductId,
  updateLog,
  deleteLog,
  newLog
};
