const pool = require("../configs/dbConfig");

const getAllProducts = async (req, res) => {
  const searchTerm = req.query.q;
  const client = await pool.connect();
  let result;
  try {
    if (!searchTerm) {
      result = await client.query("select * from products");
    } else {
      result = await client.query(
        "SELECT * FROM products WHERE LOWER(productName) LIKE LOWER($1) OR productPrice::text LIKE $2 OR productStock::text LIKE $3",
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
      );
    }
    if (result.rows.length === 0) {
      res.status(404).send({
        message: searchTerm ? "Product(s) Not Found" : "Products is NULL",
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

const getOneProduct = async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "select * from products where productId=$1",
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).send({
        message: "Product with Specified ID Not Found",
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

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();
  const { productName, productPrice, productStock } = req.body;
  try {
    const oldProduct = await client.query(
      "select * from products where productId=$1",
      [id]
    );
    if (oldProduct.rows.length === 0) {
      res.status(404).send({
        message: "Product with Specified ID Not Found",
        data: null,
      });
      return;
    }
    const updated = await client.query(
      "update products set productName=$1, productPrice=$2, productStock=$3 where productId=$4 returning *",
      [productName, productPrice, productStock, id]
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

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();
  try {
    const product = await client.query(
      "select * from products where productId=$1",
      [id]
    );
    if (product.rows.length === 0) {
      res.status(404).send({
        message: "Product with Specified ID Not Found",
        data: null,
      });
      return;
    }
    const result = await client.query(
      "delete from products where productId=$1 returning *",
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

const newProduct = async (req, res) => {
  const client = await pool.connect();
  const { productName, productPrice, productStock } = req.body;
  try {
    const result = await client.query(
      "insert into products (productName, productPrice, productStock) values ($1, $2, $3) returning *",
      [productName, productPrice, productStock]
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
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  newProduct
};
