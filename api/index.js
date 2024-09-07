import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import express from "express";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
app.use(express.json());

// MongoDB connection string
const uri = `mongodb+srv://jewelhfahim:${process.env.DB_PASS}@cluster0.d0tal.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Initialize MongoClient
const client = new MongoClient(uri);

// Function to run the server
const run = async () => {
  try {
    const db = client.db("FurniFlex");
    const productCollection = db.collection("products");

    // Route: Get all products
    app.get("/api/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.status(200).json({ success: true, data: products });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Start the server
run().catch(console.dir);

// Listen for requests
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`FurniFlex Server is running on port ${port}`);
});
