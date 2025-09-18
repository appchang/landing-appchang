import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "../../lib/mongodb";
import Worker from "../../models/Workers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { name, skill, location } = req.body;
      const worker = new Worker({ name, skill, location });
      await worker.save();
      return res.status(201).json(worker);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (req.method === "GET") {
    try {
      const workers = await Worker.find({});
      return res.status(200).json(workers);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}