const mockWorkers = [
  { name: "สมชาย ใจดี", skill: "ช่างปูน", location: "กรุงเทพฯ", status: "Available" },
  { name: "วิชัย ก่อสร้าง", skill: "ช่างไฟฟ้า", location: "นนทบุรี", status: "Busy" },
  { name: "สมศรี ทำเหล็ก", skill: "ช่างเหล็ก", location: "ปทุมธานี", status: "Available" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Dashboard ผู้ว่าจ้าง</h2>

      <div className="space-y-3 max-w-md mx-auto">
        {mockWorkers.map((w, i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{w.name}</p>
              <p className="text-sm text-gray-500">{w.skill} • {w.location}</p>
            </div>
            <button className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
              เชิญทำงาน
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}