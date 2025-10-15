import express from "express";
const port = 3000;
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const MONGOURL = process.env.MONGO_URL;

const messageschema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },

  Email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },

  Message: {
    type: String,
    required: true,
  },

  sentAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageschema);

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Database is connected successfully");
  })
  .catch((error) => {
    console.error(error);
  });

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hey this this is my backend working properly");
});

app.post("/message", async (req, res) => {
  console.log("Received data", req.body);
  
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Your message is received and we will reply you soon'
    });

  } catch (error) {
    console.error('Error saving message', error)

    res.status(500).json({
      success: false,
      message: 'Failed to send message please try again later'
    })
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
