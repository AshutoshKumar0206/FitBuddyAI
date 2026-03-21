import {Request, Response} from "express";
import axios from "axios";
import { Chat } from "../models/Chat.model";

export const chat = async (req: Request, res: Response) => {
    const { message } = req.body;
    console.log("mess", message);

    try {
        // Call Python ML API
        const model = await axios.post("http://127.0.0.1:8000/train");
        const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        { message }
        );

        const reply = response.data.reply;
        console.log('reply', reply)

        await Chat.create({ message, reply });

        return res.status(200).json({ 
            success: true,
            message: "Message processed successfully", 
            reply, 
        });
    } catch (err) {
        res.json({ reply: "Error processing request" });
    }
};

export const getHistory = async (_req: Request, res: Response) => {
  const chats = await Chat.find().sort({ createdAt: -1 }).limit(20);
  res.json(chats);
};