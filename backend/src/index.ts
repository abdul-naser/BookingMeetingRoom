import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/dbConnection';
import bodyParser from 'body-parser';
import authRouter from "./routes/auth.routes";
import roomsRouter from "./routes/room.routes";
import roomsAvailable from "./routes/room.available";
import bookingRouter from "./routes/booking.routes";
import rescheduleRouter from "./routes/reschedule.routes";
import listBookingRouter from "./routes/booking.list.routes";
import adminBookings from "./routes/admin.bookings";
import bookingStream from "./routes/booking.stream";
import roomsListRouter from "./routes/list.room";
import bookingCancel from "./routes/cancel.routes";







import cors from "cors";






async function start() {

      dotenv.config({
    path: "./.env",
  });

  await connectToDatabase();
  

    const app = express();

        app.use(cors({
  origin: "http://localhost:5173"  // Frontend URL
}));


    app.use(bodyParser.json());






app.use("/auth", authRouter);
app.use("/rooms", roomsRouter);
app.use("/rooms", roomsAvailable);
app.use("/booking", bookingRouter);
app.use("/booking", rescheduleRouter);
app.use("/booking", listBookingRouter);
app.use("/admin", adminBookings);
app.use("/booking", bookingStream);
app.use("/listroom", roomsListRouter);
app.use("/booking", bookingCancel);










   

      app.listen(process.env.HTTP_PORT, () => {
    console.log('Server is running on port ' + process.env.HTTP_PORT);
  });
}

console.log("PORT:", process.env.HTTP_PORT);
console.log("URI:", process.env.MONGODB_URI);


start();