import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  roomId: string;        // ID of Room
  userId: string;        // ID of User
  startTime: Date;
  endTime: Date;
  status: "active" | "cancelled";
  createdAt: Date;
}

const bookingSchema: Schema = new Schema(
  {
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["active", "cancelled"], default: "active" }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export default mongoose.model<IBooking>("Booking", bookingSchema);
