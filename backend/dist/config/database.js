"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    if (!process.env.MONGODB_URI) {
        console.log("❌ MONGODB_URI not set in environment variables");
        process.exit(1);
    }
    const uri = process.env.MONGODB_URI;
    try {
        await mongoose_1.default.connect(uri);
        console.log("MongoDB connected");
    }
    catch (err) {
        console.error("❌ DB Connection Failed:", err);
        process.exit(1);
    }
}
