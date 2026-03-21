import express from "express";
import { chat, getHistory } from "../controllers/chat.controller";

const router = express.Router();

router.post("/chat", chat);
router.get("/history", getHistory);

export default router;