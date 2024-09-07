import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://jewelhfahim:${process.env.DB_PASS}@cluster0.d0tal.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

const run = async () => {
  try {
    const db = client.db("FurniFlex");
    const productCollection = db.collection("products");

    app.get("/api/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.status(200).json({ success: true, data: products });
    });

    app.get("/api/product/:id", async (req, res) => {
      const { id } = req.params;
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      res.status(200).json({ success: true, data: product });
    });

    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

run().catch(console.dir);
