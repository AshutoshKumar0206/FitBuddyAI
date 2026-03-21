import mongoose from "mongoose";

interface IChat extends Document {
    message: string;
    reply: string;
}
const ChatSchema = new mongoose.Schema({
  message: {type: String, required: true},
  reply: {type: String, required: true},
},
{ timestamps: true } 
);
export const Chat = mongoose.model("Chat", ChatSchema);