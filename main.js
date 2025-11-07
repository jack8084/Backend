import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import connectdb from "./configs/db.js";
import saveUserToDB from "./functions/saveuser.js";

const app = express();

// Connect to MongoDB
await connectdb();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Health check route
app.get("/", (req, res) => res.send("✅ API is working properly"));

// Message route
app.post("/message", async (req, res) => {
  const data = req.body; // data from frontend
  const result = await saveUserToDB(data);

  if (result.success) {
    res
      .status(201)
      .json({ message: "User saved successfully!", user: result.user });
  } else {
    res
      .status(500)
      .json({ message: "Failed to save user", error: result.error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
