import axios from "axios";

const TOKEN = process.env.NEXT_PUBLIC_LINE_ACCESS_TOKEN;

export async function sendMessageToWorker(userId: string, message: string) {
  await fetch("/api/send-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, message }),
  });
}
