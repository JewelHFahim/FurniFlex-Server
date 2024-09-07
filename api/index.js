import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

run().catch(console.dir);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
