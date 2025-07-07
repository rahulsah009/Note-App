import express from "express";
import { requireAuth } from "../middlewares/auth";
import { createNote, getNotes, deleteNote } from "../controllers/noteController";

const router = express.Router();

router.post("/", requireAuth, createNote);
router.get("/", requireAuth, getNotes);
router.delete("/:id", requireAuth, deleteNote);

export default router;
