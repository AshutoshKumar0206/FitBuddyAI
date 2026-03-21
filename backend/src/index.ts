import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/database";
import chatRoutes from "./routes/chat.routes";

const app = express();
const PORT = process.env.PORT || 7000;

const allowedOrigins = ["fit-buddy-ai-taupe.vercel.app", "http://localhost:5173", "https://fitbuddyai-1.onrender.com"];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

connectDB();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server working");
});
app.use("/chats", chatRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));