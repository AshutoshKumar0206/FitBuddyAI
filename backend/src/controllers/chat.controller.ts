import {Request, Response} from "express";
import axios from "axios";
import { Chat } from "../models/Chat.model";

export const chat = async (req: Request, res: Response) => {
    const { message } = req.body;
    console.log("mess", message);

    try {
        // Call Python ML API
        const response = await axios.post(
        `${process.env.ML_MODEL_URL}/predict`,
        { message }
        );
        
        if(!response.data) {
            return res.status(400).json({ 
                success: false,
                reply: "Error processing request by ML Model",
            });
        }
        const reply = response.data.reply;
        console.log('reply', reply)

        await Chat.create({ message, reply });

        return res.status(200).json({ 
            success: true,
            message: "Message processed successfully", 
            reply, 
        });
    } catch (err) {
        res.status(500).json({ success: false, reply: "Error processing request" });
    }
};

export const getHistory = async (_req: Request, res: Response) => {
  const chats = await Chat.find().sort({ createdAt: -1 }).limit(20);
  res.json(chats);
};