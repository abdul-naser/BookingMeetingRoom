import { broadcast } from "../lib/broadcaster";
import Booking from "../models/booking";

export const createBooking = async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body);

    // هنا مكان broadcast الصحيح
    broadcast("booking-created", {
      bookingId: newBooking._id,
      roomId: newBooking.roomId,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      userId: newBooking.userId
    });

    res.status(201).json({
      success: true,
      data: newBooking
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
