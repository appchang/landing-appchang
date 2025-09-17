export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background geometric */}
      <div className="absolute inset-0 grid grid-cols-12 opacity-10">
        {[...Array(120)].map((_, i) => (
          <div key={i} className="border border-gray-200"></div>
        ))}
      </div>

      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rotate-45"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-100"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 transform rotate-12"></div>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Recruitment & Workforce Management
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          สร้างระบบแรงงานก่อสร้างที่มั่นคง โปร่งใส และจัดการได้จริง
        </p>
        <div className="flex gap-4">
          <a href="#" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            เริ่มใช้งาน
          </a>
          <a href="#" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            ดูรายละเอียด
          </a>
        </div>
      </main>

      {/* Value Props */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold text-blue-600">Verified Workforce</h3>
            <p className="text-gray-600 mt-2">KYC + โปรไฟล์ตรวจสอบแล้ว</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-600">Workforce Management</h3>
            <p className="text-gray-600 mt-2">Clock-in/out, Progress Tracker</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-600">Seamless Payment</h3>
            <p className="text-gray-600 mt-2">Payroll, Insurance, Banking Integration</p>
          </div>
        </div>
      </section>
    </div>
  )
}