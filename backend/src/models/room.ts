import mongoose, {Document, ObjectId, Schema} from "mongoose";

export interface IRoom extends Document {
  name: string;
  capacity: number;
}

const roomSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    capacity: { type: Number, required: true }
  },
  { timestamps: true }
);


export default mongoose.model<IRoom>("Room", roomSchema);

