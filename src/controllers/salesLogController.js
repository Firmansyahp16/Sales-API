const pool = require("../configs/dbConfig");

const getAllSales = async (req, res) => {
  const searchTerm = req.query.q;
  const client = await pool.connect();
  let result;
  try {
    if (!searchTerm) {
      result = await client.query("select * from salesLog");
    } else {
      result = await client.query(
        "select * from salesLog where salesDate::text like $1 or productId::text like $2 or quantity::text like $3 or totalPrice::text like $4",
        [
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
        ]
      );
    }
    if (result.rows.length === 0) {
      res.status(404).send({
        message: searchTerm ? "Sales Not Found" : "Sales is NULL",
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

const getOneSale = async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "select * from salesLog where salesLogId=$1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).send({
        message: "Sales with Specified ID Not Found",
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

const updateSales = async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();
  const { salesDate, productId, quantity, totalPrice } = req.body;
  try {
    const oldSales = await client.query(
      "select * from salesLog where salesLogId=$1",
      [id]
    );
    if (oldSales.rows.length === 0) {
      res.status(404).send({
        message: "Product with Specified ID Not Found",
        data: null,
      });
      return;
    }
    const updated = await client.query(
      "update salesLog set salesDate=$1, productId=$2, quantity=$3, totalPrice=$4 where salesLogId=$5 returning *",
      [salesDate, productId, quantity, totalPrice, id]
    );
    if (updated.rows.length > 0) {
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

const deleteSales = async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();
  try {
    const sales = await client.query(
      "select * from salesLog where salesLogId=$1",
      [id]
    );
    if (sales.rows.length === 0) {
      res.status(404).send({
        message: "Sales with Specified ID Not Found",
        data: null,
      });
      return;
    }
    const result = await client.query(
      "delete from salesLog where salesLogId=$1 returning *",
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

const newSales = async (req, res) => {
  const client = await pool.connect();
  const { salesDate, productId, quantity, totalPrice } = req.body;
  try {
    const result = await client.query(
      "insert into salesLog (salesDate, productId, quantity, totalPrice) values ($1, $2, $3, $4) returning *",
      [salesDate, productId, quantity, totalPrice]
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
  getAllSales,
  getOneSale,
  updateSales,
  deleteSales,
  newSales
}