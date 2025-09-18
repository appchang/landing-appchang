import mongoose, { Schema, model, models } from "mongoose";

const WorkerSchema = new Schema(
  {
    name: { type: String, required: true },
    skill: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, default: "Available" },
  },
  { timestamps: true }
);

// ✅ บังคับใช้ collection ชื่อ workers
const Worker = models.Worker || model("Worker", WorkerSchema, "workers");
export default Worker;