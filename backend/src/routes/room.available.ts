import { Router } from "express";
import Room from "../models/room";
import Booking from "../models/booking";
import moment from "moment";

const router = Router();

router.get("/availability", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ msg: "Please provide date ?date=YYYY-MM-DD" });
    }

    // ساعات العمل
    const WORK_START = "08:00";
    const WORK_END = "17:00";

    const selectedDate = moment(date as string, "YYYY-MM-DD");

    const dayStart = selectedDate.clone().hour(8).minute(0);
    const dayEnd = selectedDate.clone().hour(17).minute(0);

    const rooms = await Room.find();

    const results: any[] = [];

    for (const room of rooms) {
      // bookings of this room on selected date
      const bookings = await Booking.find({
  roomId: room._id as any,
        status: "active",
        startTime: {
          $gte: dayStart.toDate(),
          $lte: dayEnd.toDate()
        }
      }).sort({ startTime: 1 });

      let availableSlots: any[] = [];

      let lastEnd = dayStart.clone();

      for (const booking of bookings) {
        const start = moment(booking.startTime);
        const end = moment(booking.endTime);

        // في فراغ بين آخر نهاية وبين بداية هذا الحجز؟
        if (start.isAfter(lastEnd)) {
          availableSlots.push({
            start: lastEnd.format("HH:mm"),
            end: start.format("HH:mm")
          });
        }

        lastEnd = end;
      }

      // بعد آخر حجز من  آخر نهاية حتى 17:00
      if (lastEnd.isBefore(dayEnd)) {
        availableSlots.push({
          start: lastEnd.format("HH:mm"),
          end: dayEnd.format("HH:mm")
        });
      }

      results.push({
        roomId: room._id,
        roomName: room.name,
        availableSlots
      });
    }

    res.json(results);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
