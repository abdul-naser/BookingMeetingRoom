import { Router } from "express";
import Booking from "../models/booking";
import { verifyUser } from "../middlewares/auth";


const router = Router();

router.post("/", verifyUser, async (req: any, res) => {
  const { roomId, startTime, endTime } = req.body;

  if (!roomId || !startTime || !endTime)
    return res.status(400).json({ msg: "roomId, startTime, endTime are required" });

  const start = new Date(startTime);
  const end = new Date(endTime);

  // قاعدة: start >= end
  if (start >= end)
    return res.status(400).json({ msg: "startTime must be before endTime" });

  // قاعدة: Booking in the past
  if (start < new Date())
    return res.status(400).json({ msg: "Cannot book in the past" });

  // قاعدة: Overlapping
  const conflictingBookings = await Booking.find({
    roomId,
    status: "active",
    $or: [
      { startTime: { $lt: end }, endTime: { $gt: start } }
    ]
  });

  if (conflictingBookings.length > 0) {
    return res.status(400).json({
      conflict: true,
      message: "Room is already booked during this time",
      conflictingBookings
    });
  }

  // إنشاء الحجز
  const booking = await Booking.create({
    roomId,
    userId: req.user.id,
    startTime: start,
    endTime: end,
    status: "active"
  });

  res.status(201).json({ msg: "Booking created", booking });
});

export default router;
