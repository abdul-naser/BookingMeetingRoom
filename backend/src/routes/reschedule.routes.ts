import { Router } from "express";
import Booking from "../models/booking";
import { verifyUser } from "../middlewares/auth";

const router = Router();

router.patch("/:id/reschedule", verifyUser, async (req: any, res) => {
  const { id } = req.params;
  const { startTime, endTime } = req.body;

  if (!startTime || !endTime)
    return res.status(400).json({ msg: "startTime and endTime are required" });

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end)
    return res.status(400).json({ msg: "startTime must be before endTime" });

  if (start < new Date())
    return res.status(400).json({ msg: "Cannot reschedule to past" });

  // جلب الحجز الحالي
  const booking = await Booking.findById(id);
  if (!booking)
    return res.status(404).json({ msg: "Booking not found" });

  // تحقق أن المستخدم الحالي هو صاحب الحجز أو admin
  if (booking.userId.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ msg: "You are not allowed to reschedule this booking" });
  }

  // تحقق التعارض مع حجوزات أخرى
  const conflictingBookings = await Booking.find({
    roomId: booking.roomId,
    status: "active",
    _id: { $ne: booking._id }, // استبعد الحجز الحالي
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

  // تحديث الحجز
  booking.startTime = start;
  booking.endTime = end;
  await booking.save();

  res.json({ msg: "Booking rescheduled", booking });
});

export default router;
