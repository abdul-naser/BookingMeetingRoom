import { Router } from "express";
import Booking from "../models/booking";
import { verifyUser } from "../middlewares/auth";

const router = Router();

router.patch("/cancel/:id", verifyUser, async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "canceled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking canceled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error canceling booking", error });
  }
});

export default router;
