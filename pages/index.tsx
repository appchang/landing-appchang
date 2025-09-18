import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import liff from "@line/liff";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/router";

// Simple StarIcon component using SVG
const StarIcon = ({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.049 9.397c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.97z" />
  </svg>
);

export default function Home() {
  const router = useRouter();
  // const [profile, setProfile] = useState<{
  //   name: string;
  //   picture: string;
  //   userId: string;
  // } | null>(null);

  const [activeTab, setActiveTab] = useState<"dashboard" | "worker">(
    "dashboard"
  );
  const [profile, setProfile] = useState<{
    name: string;
    picture: string;
    userId: string;
  }>({
    name: "Test User",
    picture:
      "https://profile.line-scdn.net/0hIrNdtp34Fl1jHT_T95JoIhNNFTdAbE9PGChROAQdGD9fKgJcGC5YPwFNGzpXelZbHSlfPlQcHDlvDmE7fUvqaWQtS2xfJFEJTHpQvw",
    userId: "test-user-id",
  });

  const [workers, setWorkers] = useState<
    {
      name: string;
      skill: string;
      location: string;
      status?: string;
      picture: string;
    }[]
  >([]);

  // === FORM STATE ===
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");

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
    setActiveTab("dashboard");
  };

  // useEffect(() => {
  //   const initLiff = async () => {
  //     try {
  //       await liff.init({ liffId: "2008132085-Ex4bOk3P" });
  //       if (liff.isLoggedIn()) {
  //         const userProfile = await liff.getProfile();
  //         console.log("userProfile", userProfile);
  //         setProfile({
  //           name: userProfile.displayName,
  //           picture: userProfile.pictureUrl || "",
  //           userId: userProfile.userId || "",
  //         });
  //       } else {
  //         liff.login();
  //       }
  //     } catch (err) {
  //       console.error("LIFF init error:", err);
  //     }
  //   };
  //   initLiff();
  // }, []);

  useEffect(() => {
    if (profile) {
      fetch("/api/workers")
        .then((res) => res.json())
        .then((data) => setWorkers(data));
    }
    console.log("workers", workers);
  }, [profile]);

  return (
    // <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
    //   <h1 className="text-3xl font-bold text-blue-700 mb-4">AppChang Pro</h1>
    <div className={styles["home-container"]}>
      <div className={styles["home-content"]}>
        <h1 className="text-3xl font-bold text-blue-700 mb-4">AppChang Pro1</h1>

        {/* {profile && (
          <div className="text-center mb-6">
            <Image
              src={profile.picture}
              alt="profile"
              width={80}
              height={80}
              className="rounded-full mx-auto mb-2"
              style={{ borderRadius: "50%" }}
            />
            <p className="text-lg font-semibold">สวัสดี, {profile.name}</p>
          </div>
        )} */}

        {activeTab === "dashboard" && (
          <div style={{ width: "60%" }}>
            <h2 style={{ textAlign: "left" }}>
              รายชื่อ
              <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
                ({workers.length})
              </span>
            </h2>
            <div style={{ width: "100%" }}>
              {workers.map((w, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    console.log("คลิกแรงงาน:", w);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      textAlign: "left",
                    }}
                  >
                    <Image
                      src={w.picture}
                      alt="profile"
                      width={80}
                      height={80}
                      className="rounded-full mx-auto mb-2"
                      style={{ borderRadius: "50%" }}
                    />
                    <div>
                      <p className="font-semibold">{w.name}</p>
                      <div className="flex items-center mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star color="#facc15" key={i} />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            (2)
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm">
                        {w.skill} • {w.location}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginRight: "8px" }}>
                    <div
                      style={{
                        padding: "0px 8px",
                        background:
                          w.status === "Available" ? "#d1fae5" : "#fee2e2",
                        borderRadius: "8px",
                      }}
                    >
                      <p
                        style={{
                          color:
                            w.status === "Available" ? "#166534" : "#b91c1c",
                          fontWeight: "bold",
                        }}
                      >
                        {w.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "worker" && (
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              margin: "32px auto",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 2px 12px #e5e7eb",
              padding: "32px 24px",
              textAlign: "left",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "24px",
              }}
            >
              ลงทะเบียนแรงงาน
            </h2>
            <form onSubmit={handleSubmit}>
              {/* ชื่อ */}
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                ชื่อ-นามสกุล
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f9fafb",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  padding: "0 12px",
                  marginBottom: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "#94a3b8",
                    marginRight: "8px",
                  }}
                >
                  👤
                </span>
                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล"
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: "14px 0",
                    width: "100%",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* ทักษะงาน */}
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                ทักษะงาน
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f9fafb",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  padding: "0 12px",
                  marginBottom: "18px",
                }}
              >
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "#94a3b8",
                    marginRight: "8px",
                  }}
                >
                  🧰
                </span>
                <select
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: "14px 0",
                    width: "100%",
                    fontSize: "1rem",
                    outline: "none",
                    color: "#64748b",
                  }}
                  defaultValue=""
                  onChange={(e) => setSkill(e.target.value)}
                >
                  <option value="" disabled>
                    เลือกทักษะงาน
                  </option>
                  <option value="ช่างปูน">ช่างปูน</option>
                  <option value="ช่างไฟฟ้า">ช่างไฟฟ้า</option>
                  <option value="ช่างเหล็ก">ช่างเหล็ก</option>
                  {/* เพิ่มทักษะอื่นๆ */}
                </select>
                <span
                  style={{
                    fontSize: "1.1rem",
                    color: "#94a3b8",
                    marginLeft: "8px",
                  }}
                >
                  ▼
                </span>
              </div>

              {/* พื้นที่ทำงาน */}
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                พื้นที่ทำงาน
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f9fafb",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  padding: "0 12px",
                  marginBottom: "28px",
                }}
              >
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "#94a3b8",
                    marginRight: "8px",
                  }}
                >
                  📍
                </span>
                <input
                  type="text"
                  placeholder="จังหวัด/พื้นที่ที่ทำงาน"
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: "14px 0",
                    width: "100%",
                    fontSize: "1rem",
                    outline: "none",
                    color: "#64748b",
                  }}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* ปุ่มบันทึก */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "linear-gradient(90deg,#2563eb,#1e40af)",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  padding: "14px 0",
                  fontSize: "1.1rem",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                บันทึกข้อมูล
              </button>
            </form>
          </div>
        )}

        <div
          style={{
            width: "100%",
            position: "fixed",
            bottom: "0",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            gap: "10px",
            background: "white",
          }}
        >
          <div style={{ flex: 1 }}>
            <button
              style={{
                width: "100%",
                background: activeTab === "worker" ? "#2563eb" : "#e5e7eb", // สีน้ำเงินถ้า active, เทาถ้าไม่ active
                color: activeTab === "worker" ? "#fff" : "#333",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "10px 0",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("worker")}
            >
              สมัครแรงงาน
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <button
              style={{
                width: "100%",
                background: activeTab === "dashboard" ? "#2563eb" : "#e5e7eb", // สีน้ำเงินถ้า active, เทาถ้าไม่ active
                color: activeTab === "dashboard" ? "#fff" : "#333",
                fontWeight: "bold",
                borderRadius: "8px",
                padding: "10px 0",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard ผู้ว่าจ้าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
