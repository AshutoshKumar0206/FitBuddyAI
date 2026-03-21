"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.chat = void 0;
const axios_1 = __importDefault(require("axios"));
const Chat_model_1 = require("../models/Chat.model");
const chat = async (req, res) => {
    const { message } = req.body;
    console.log("mess", message);
    try {
        // Call Python ML API
        const model = await axios_1.default.post("http://127.0.0.1:8000/train");
        const response = await axios_1.default.post("http://127.0.0.1:8000/predict", { message });
        const reply = response.data.reply;
        console.log('reply', reply);
        await Chat_model_1.Chat.create({ message, reply });
        return res.status(200).json({
            success: true,
            message: "Message processed successfully",
            reply,
        });
    }
    catch (err) {
        res.json({ reply: "Error processing request" });
    }
};
exports.chat = chat;
const getHistory = async (_req, res) => {
    const chats = await Chat_model_1.Chat.find().sort({ createdAt: -1 }).limit(20);
    res.json(chats);
};
exports.getHistory = getHistory;
