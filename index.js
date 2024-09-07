require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 4000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://jewelhfahim:${process.env.DB_PASS}@cluster0.d0tal.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("FurniFlex");
    const productCollection = db.collection("products");
    const orderCollection = db.collection("orders");

    // =====================>> PRODUCT  COLLECTION <<====================
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();
      res.send({ status: true, data: product });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;

      try {
        const result = await productCollection.insertOne(product);
        if (result.insertedCount === 1) {
          res.status(201).json({
            message: "Product inserted successfully.",
            insertedId: result.insertedId,
          });
        } else {
          res.status(500).json({ message: "Product insertion failed." });
        }
      } catch (error) {
        console.error("Error inserting product:", error);
        res
          .status(500)
          .json({ message: "An error occurred while inserting the product." });
      }
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({
        _id: new ObjectId(id),
      });
      console.log(result);
      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const productId = req.params.id;
      const updatedProduct = req.body;

      try {
        const result = await productCollection.updateOne(
          { _id: new ObjectId(productId) },
          { $set: updatedProduct }
        );

        if (result.modifiedCount === 1) {
          res.status(200).json({ message: "Product updated successfully." });
        } else {
          res.status(500).json({ message: "Product update failed." });
        }
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "An error occurred " });
      }
    });

    // =======================>> ORDER  COLLECTION <<======================
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const order = await cursor.toArray();
      res.send({ status: true, message: "all orders", data: order });
    });

    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const result = await orderCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.post("/order", async (req, res) => {
      const order = req.body;
      order.createdAt = new Date();
      try {
        const result = await orderCollection.insertOne(order);
        if (result) {
          // const formattedDate = order.createdAt.toLocaleDateString('en-GB', {
          //   day: '2-digit',
          //   month: '2-digit',
          //   year: '4-digit',
          // });

          res.status(200).json({
            status: true,
            message: "order placed successfully.",
            insertedId: result.insertedId,
            // orderDate: formattedDate,
            orderDate: order.createdAt,
          });
        } else {
          res
            .status(500)
            .json({ status: false, message: "order placed failed" });
        }
      } catch (error) {
        console.error("Error inserting order:", error);
        res
          .status(500)
          .json({ message: "An error occurred while place order." });
      }
    });

    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const result = await orderCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send({ message: "deleted successfully", result });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("FurniFlex Server");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
