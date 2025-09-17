import { useEffect, useState } from "react";
import liff from "@line/liff";

interface Worker {
  name: string;
  skill: string;
  location: string;
}

export default function Home() {
  const [profile, setProfile] = useState<{ name: string; picture: string } | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([
    { name: "สมชาย ใจดี", skill: "ช่างปูน", location: "กรุงเทพฯ" },
    { name: "วิชัย ก่อสร้าง", skill: "ช่างไฟฟ้า", location: "นนทบุรี" },
    { name: "สมศรี ทำเหล็ก", skill: "ช่างเหล็ก", location: "ปทุมธานี" },
  ]);

  const [form, setForm] = useState<Worker>({
    name: "",
    skill: "",
    location: "",
  });

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: "YOUR_LIFF_ID" });
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile({
            name: userProfile.displayName,
            picture: userProfile.pictureUrl || "",
          });
        } else {
          liff.login();
        }
      } catch (err) {
        console.error("LIFF init error:", err);
      }
    };
    initLiff();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.skill || !form.location) return;
    setWorkers([...workers, form]); // เพิ่มแรงงานใหม่เข้า mock data
    setForm({ name: "", skill: "", location: "" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-blue-700 mb-4">AppChang Pro</h1>

      {/* Profile */}
      {profile && (
        <div className="text-center mb-8">
          <img
            src={profile.picture}
            alt="profile"
            className="w-20 h-20 rounded-full mx-auto mb-2"
          />
          <p className="text-lg font-semibold">สวัสดี, {profile.name} 👋</p>
        </div>
      )}

      {/* Worker Registration Form */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">สมัครแรงงาน</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="ชื่อ-นามสกุล"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg p-3"
          />
          <select
            value={form.skill}
            onChange={(e) => setForm({ ...form, skill: e.target.value })}
            className="w-full border rounded-lg p-3"
          >
            <option value="">เลือกทักษะ</option>
            <option value="ช่างปูน">ช่างปูน</option>
            <option value="ช่างไฟฟ้า">ช่างไฟฟ้า</option>
            <option value="ช่างเหล็ก">ช่างเหล็ก</option>
            <option value="ช่างไม้">ช่างไม้</option>
          </select>
          <input
            type="text"
            placeholder="จังหวัด/พื้นที่ทำงาน"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border rounded-lg p-3"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            บันทึกข้อมูล
          </button>
        </form>
      </div>

      {/* Worker Dashboard */}
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">รายชื่อแรงงาน</h2>
        <div className="space-y-3">
          {workers.map((worker, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{worker.name}</p>
                <p className="text-sm text-gray-500">
                  {worker.skill} • {worker.location}
                </p>
              </div>
              <span className="text-green-600 font-medium">Available</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}