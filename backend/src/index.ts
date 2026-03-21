// server/index.js
import express from "express";
// import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/database";
import chatRoutes from "./routes/chat.routes";

const app = express();
const PORT = 7000;
app.use(cors({
  origin: "http://localhost:5173",
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