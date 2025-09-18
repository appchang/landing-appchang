import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function WorkerForm() {
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();
  const profile = router.query;

  interface Worker {
    name: string;
    skill: string;
    location: string;
    status?: string;
    userId: string;
  }

  const [workers, setWorkers] = useState<Worker[]>([]);

  // โหลดรายชื่อจาก DB
  useEffect(() => {
    fetch("/api/workers")
      .then((res) => res.json())
      .then((data) => setWorkers(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newWorker = {
      name,
      skill,
      location,
      userId: profile.userId,
      picture: profile.picture,
    };

    await fetch("/api/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWorker),
    });

    setName("");
    setSkill("");
    setLocation("");

    // refresh list
    const updated = await fetch("/api/workers").then((res) => res.json());
    setWorkers(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">สมัครแรงงานz.1</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <input
          type="text"
          placeholder="ชื่อ-นามสกุล"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">เลือกทักษะ</option>
          <option value="ช่างปูน">ช่างปูน</option>
          <option value="ช่างไฟฟ้า">ช่างไฟฟ้า</option>
          <option value="ช่างเหล็ก">ช่างเหล็ก</option>
        </select>
        <input
          type="text"
          placeholder="จังหวัด/พื้นที่ทำงาน"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          บันทึกข้อมูล
        </button>
      </form>

      {/* <h2 className="text-xl font-semibold mb-3">รายชื่อแรงงาน</h2>
      <div className="space-y-2">
        {workers.map((w, i) => (
          <div
            key={i}
            className="flex justify-between bg-white p-3 rounded shadow"
          >
            <div>
              <p className="font-semibold">{w.name}</p>
              <p className="text-gray-600 text-sm">
                {w.skill} • {w.location}
              </p>
            </div>
            <span className="text-green-600 font-semibold">{w.status}</span>
          </div>
        ))}
      </div> */}
    </div>
  );
}
