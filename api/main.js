import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

// --- CRITICAL CORS CONFIGURATION ---
// REPLACE 'https://your-frontend-domain.vercel.app' with your actual production frontend URL.
// The wildcard pattern allows all preview deployments (e.g., branch-name.your-frontend-domain.vercel.app)
const ALLOWED_ORIGINS = [
    'https://portfolio-website-omega-puce-54.vercel.app/', 
    /^https:\/\/.*\.vercel\.app$/, // Allows all Vercel preview deployments (e.g. branch-name.vercel.app)
    'http://localhost:5173', // Include your local development domain(s)
    'http://localhost:3000',
];

// Custom CORS middleware configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const isAllowed = ALLOWED_ORIGINS.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            } else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            // Log for debugging (optional)
            console.warn(`CORS block: Request from unauthorized origin ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'], // Explicitly allowed methods
    credentials: true
}));

app.use(bodyParser.json());

// Database Connection
mongoose
    .connect(MONGOURL)
    .then(() => {
        console.log("Database is connected successfully");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });

// Schema and Model Definition (unchanged)
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

// Routes
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
        console.error('Error saving message', error);

        // Check for validation errors from Mongoose
        if (error.name === 'ValidationError') {
             // Extract specific validation messages
             const errors = Object.values(error.errors).map(err => err.message);
             return res.status(400).json({
                 success: false,
                 message: 'Validation failed.',
                 details: errors,
             });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to send message please try again later'
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
