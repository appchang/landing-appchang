import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const TOKEN = process.env.NEXT_PUBLIC_LINE_ACCESS_TOKEN; // ไม่ต้องใช้ NEXT_PUBLIC

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    projectName,
    workLocationAssign,
    startDate,
    endDate,
    budget,
    userId,
  } = req.body;
  const message = `คุณได้รับมอบหมายงานใหม่:\n- ชื่องาน: ${projectName}\n- สถานที่ทำงาน: ${workLocationAssign}\n- วันที่เริ่มต้น: ${startDate}\n- วันที่สิ้นสุด: ${endDate}\n- งบประมาณ: ${budget} บาท`;

  try {
    console.log("Sending message to:", userId, message);
    console.log("LINE_ACCESS_TOKEN:", TOKEN);
    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: userId,
        messages: [{ type: "text", text: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (err: Error | any) {
    res.status(500).json({ error: err.message });
  }
}
