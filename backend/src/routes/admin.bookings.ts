import { Router } from "express";
import Booking from "../models/booking";
import Room from "../models/room";
import { verifyAdmin } from "../middlewares/auth";

const router = Router();

// GET /admin/bookings — admin only
router.get("/bookings", verifyAdmin, async (req, res) => {
  try {
    // 1. احصل على جميع الغرف
    const rooms = await Room.find();

    const results: any[] = [];

    for (const room of rooms) {
      // 2. احصل على حجوزات كل غرفة
const bookings = await Booking.find({ roomId: room._id as any })
        .populate("userId", "name email") // اختيارياً لعرض بيانات المستخدم
        .sort({ startTime: 1 });

      // 3. جهّز الشكل المطلوب
      results.push({
        roomId: room._id,
        roomName: room.name,
        bookings
      });
    }

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
