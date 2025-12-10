import { Router } from "express";
import Room from "../models/room";
import { verifyAdmin } from "../middlewares/auth";

const router = Router();

// Create room (admin only)
router.post("/", verifyAdmin, async (req, res) => {
  const { name, capacity } = req.body;

  if (!name || !capacity)
    return res.status(400).json({ msg: "Please provide name and capacity" });

  try {
    const newRoom = await Room.create({ name, capacity });
    res.status(201).json({ msg: "Room created", room: newRoom });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
});

export default router;
