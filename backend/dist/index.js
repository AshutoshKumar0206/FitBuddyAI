"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/index.js
const express_1 = __importDefault(require("express"));
// import mongoose from "mongoose";
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_1 = require("./config/database");
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const app = (0, express_1.default)();
const PORT = 7000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
(0, database_1.connectDB)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Server working");
});
app.use("/chats", chat_routes_1.default);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
