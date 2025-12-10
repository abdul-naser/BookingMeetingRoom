import { Router } from "express";
import Booking from "../models/booking";
import { verifyUser } from "../middlewares/auth";

const router = Router();

// GET /bookings/me
router.get("/me", verifyUser, async (req: any, res) => {
  try {
    // جلب جميع الحجوزات الخاصة بالمستخدم الحالي
    const bookings = await Booking.find({ userId: req.user.id }).sort({ startTime: 1 });

    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
