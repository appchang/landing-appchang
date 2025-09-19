import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import liff from "@line/liff";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/router";
import { sendMessageToWorker } from "../services/line";
import LoadingOverlay from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

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
      userId: string;
    }[]
  >([]);
  const [selectedWorker, setSelectedWorker] = useState<{
    name: string;
    skill: string;
    location: string;
    status?: string;
    picture: string;
    userId: string;
  } | null>(null);

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

  async function sendMessageToWorker(userId: string, message: string) {
    setLoading(true);
    await fetch("/api/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message }),
    });
    setLoading(false);
    toast.success("Send Message Success!");
  }

  // === Library ===
  const [loading, setLoading] = useState(false);

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
    if (!profile) return;

    const loadWorkers = async () => {
      try {
        setLoading(true);
        console.log("loadWorkers");
        const res = await fetch("/api/workers");
        const data = await res.json();
        setWorkers(data);
      } catch (err) {
        console.error("Fetch workers error:", err);
      } finally {
        setLoading(false);
        console.log("loadWorkers done");
      }
    };

    loadWorkers();
  }, [profile]);

  return (
    <div className={styles["home-container"]}>
      <LoadingOverlay
        active={loading}
        spinner={<FadeLoader color="#36d7b7" />}
        styles={{
          overlay: (base) => ({
            ...base,
            background: "rgba(0, 0, 0, 0.5)",
            position: "fixed",
            inset: 0,
            zIndex: 9999,
          }),
          content: (base) => ({
            ...base,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }),
        }}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <div className={styles["home-content"]}>
          <h1 className="text-3xl font-bold text-blue-700 mb-4">
            AppChang Pro1
          </h1>
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
          {activeTab === "dashboard" && !selectedWorker && (
            <div style={{ width: "60%" }}>
              <h2 style={{ textAlign: "left" }}>
                รายชื่อ
                <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
                  ({workers.length})
                </span>
              </h2>
              <div style={{ width: "100%" }} className="card">
                {workers.map((w, i) => (
                  <div
                    key={i}
                    style={{
                      background: "white",
                      padding: "10px 30px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedWorker(w)}
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
                        style={{
                          borderRadius: "50%",
                          width: "60px",
                          height: "60px",
                        }}
                      />
                      <div>
                        <p
                          style={{
                            marginTop: "0px",
                            marginBottom: "4px",
                            fontWeight: "bold",
                          }}
                        >
                          {w.name}
                        </p>
                        <div className="flex items-center mb-1">
                          <p
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              margin: "0",
                              fontSize: "0.7rem",
                              color: "#555",
                            }}
                          >
                            {[...Array(4)].map((_, i) => (
                              <svg
                                key={i}
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <mask
                                  id="mask0_354_1820"
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="0"
                                  width="16"
                                  height="16"
                                >
                                  <rect
                                    x="0.418945"
                                    y="0.205322"
                                    width="15"
                                    height="15"
                                    fill="#D9D9D9"
                                  />
                                </mask>
                                <g mask="url(#mask0_354_1820)">
                                  <path
                                    d="M5.18457 4.20532L6.93457 1.9397C7.05957 1.77303 7.20801 1.65063 7.37988 1.57251C7.55176 1.49438 7.73145 1.45532 7.91895 1.45532C8.10645 1.45532 8.28613 1.49438 8.45801 1.57251C8.62988 1.65063 8.77832 1.77303 8.90332 1.9397L10.6533 4.20532L13.3096 5.09595C13.5804 5.17928 13.7939 5.33293 13.9502 5.55688C14.1064 5.78084 14.1846 6.02824 14.1846 6.29907C14.1846 6.42407 14.1663 6.54907 14.1299 6.67407C14.0934 6.79907 14.0335 6.91886 13.9502 7.03345L12.2314 9.47095L12.2939 12.0334C12.3044 12.398 12.1846 12.7053 11.9346 12.9553C11.6846 13.2053 11.3929 13.3303 11.0596 13.3303C11.0387 13.3303 10.9242 13.3147 10.7158 13.2834L7.91895 12.5022L5.12207 13.2834C5.06999 13.3043 5.0127 13.3173 4.9502 13.3225C4.8877 13.3277 4.8304 13.3303 4.77832 13.3303C4.44499 13.3303 4.15332 13.2053 3.90332 12.9553C3.65332 12.7053 3.53353 12.398 3.54395 12.0334L3.60645 9.45532L1.90332 7.03345C1.81999 6.91886 1.76009 6.79907 1.72363 6.67407C1.68717 6.54907 1.66895 6.42407 1.66895 6.29907C1.66895 6.03866 1.74447 5.79647 1.89551 5.57251C2.04655 5.34855 2.25749 5.1897 2.52832 5.09595L5.18457 4.20532Z"
                                    fill="#FACC15"
                                  />
                                </g>
                              </svg>
                            ))}
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_354_1820"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="16"
                                height="16"
                              >
                                <rect
                                  x="0.418945"
                                  y="0.205322"
                                  width="15"
                                  height="15"
                                  fill="#D9D9D9"
                                />
                              </mask>
                              <g mask="url(#mask0_354_1820)">
                                <path
                                  d="M5.18457 4.20532L6.93457 1.9397C7.05957 1.77303 7.20801 1.65063 7.37988 1.57251C7.55176 1.49438 7.73145 1.45532 7.91895 1.45532C8.10645 1.45532 8.28613 1.49438 8.45801 1.57251C8.62988 1.65063 8.77832 1.77303 8.90332 1.9397L10.6533 4.20532L13.3096 5.09595C13.5804 5.17928 13.7939 5.33293 13.9502 5.55688C14.1064 5.78084 14.1846 6.02824 14.1846 6.29907C14.1846 6.42407 14.1663 6.54907 14.1299 6.67407C14.0934 6.79907 14.0335 6.91886 13.9502 7.03345L12.2314 9.47095L12.2939 12.0334C12.3044 12.398 12.1846 12.7053 11.9346 12.9553C11.6846 13.2053 11.3929 13.3303 11.0596 13.3303C11.0387 13.3303 10.9242 13.3147 10.7158 13.2834L7.91895 12.5022L5.12207 13.2834C5.06999 13.3043 5.0127 13.3173 4.9502 13.3225C4.8877 13.3277 4.8304 13.3303 4.77832 13.3303C4.44499 13.3303 4.15332 13.2053 3.90332 12.9553C3.65332 12.7053 3.53353 12.398 3.54395 12.0334L3.60645 9.45532L1.90332 7.03345C1.81999 6.91886 1.76009 6.79907 1.72363 6.67407C1.68717 6.54907 1.66895 6.42407 1.66895 6.29907C1.66895 6.03866 1.74447 5.79647 1.89551 5.57251C2.04655 5.34855 2.25749 5.1897 2.52832 5.09595L5.18457 4.20532Z"
                                  fill="#D9D9D9"
                                />
                              </g>
                            </svg>
                            <span
                              className="text-xs text-gray-500 ml-1"
                              style={{ margin: "0px" }}
                            >
                              (2 รีวิว)
                            </span>
                          </p>
                        </div>

                        <p
                          style={{
                            color: "#5f646f",
                            fontSize: "0.7rem",
                            margin: "0px",
                            display: "flex",
                            gap: "6px",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_356_1838"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="15"
                                height="15"
                              >
                                <rect width="15" height="15" fill="#D9D9D9" />
                              </mask>
                              <g mask="url(#mask0_356_1838)">
                                <path
                                  d="M2.5 13.125C2.15625 13.125 1.86198 13.0026 1.61719 12.7578C1.3724 12.513 1.25 12.2188 1.25 11.875V5C1.25 4.65625 1.3724 4.36198 1.61719 4.11719C1.86198 3.8724 2.15625 3.75 2.5 3.75H5V2.5C5 2.15625 5.1224 1.86198 5.36719 1.61719C5.61198 1.3724 5.90625 1.25 6.25 1.25H8.75C9.09375 1.25 9.38802 1.3724 9.63281 1.61719C9.8776 1.86198 10 2.15625 10 2.5V3.75H12.5C12.8438 3.75 13.138 3.8724 13.3828 4.11719C13.6276 4.36198 13.75 4.65625 13.75 5V11.875C13.75 12.2188 13.6276 12.513 13.3828 12.7578C13.138 13.0026 12.8438 13.125 12.5 13.125H2.5ZM6.25 3.75H8.75V2.5H6.25V3.75ZM3.75 5H2.5V11.875H3.75V5ZM10 11.875V5H5V11.875H10ZM11.25 5V11.875H12.5V5H11.25Z"
                                  fill="#5F646F"
                                />
                              </g>
                            </svg>
                          </span>
                          {w.skill}
                          <span style={{ margin: "0 1px" }}>•</span>
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_356_1844"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="15"
                                height="15"
                              >
                                <rect width="15" height="15" fill="#D9D9D9" />
                              </mask>
                              <g mask="url(#mask0_356_1844)">
                                <path
                                  d="M7.5 13.75C6.39583 13.75 5.49479 13.5755 4.79687 13.2266C4.09896 12.8776 3.75 12.4271 3.75 11.875C3.75 11.625 3.82552 11.3932 3.97656 11.1797C4.1276 10.9661 4.33854 10.7812 4.60938 10.625L5.59375 11.5469C5.5 11.5885 5.39844 11.6354 5.28906 11.6875C5.17969 11.7396 5.09375 11.8021 5.03125 11.875C5.16667 12.0417 5.47917 12.1875 5.96875 12.3125C6.45833 12.4375 6.96875 12.5 7.5 12.5C8.03125 12.5 8.54427 12.4375 9.03906 12.3125C9.53385 12.1875 9.84896 12.0417 9.98438 11.875C9.91146 11.7917 9.81771 11.724 9.70313 11.6719C9.58854 11.6198 9.47917 11.5729 9.375 11.5313L10.3438 10.5937C10.6354 10.7604 10.8594 10.9505 11.0156 11.1641C11.1719 11.3776 11.25 11.6146 11.25 11.875C11.25 12.4271 10.901 12.8776 10.2031 13.2266C9.50521 13.5755 8.60417 13.75 7.5 13.75ZM7.51563 10.3125C8.54688 9.55208 9.32292 8.78906 9.84375 8.02344C10.3646 7.25781 10.625 6.48958 10.625 5.71875C10.625 4.65625 10.2865 3.85417 9.60938 3.3125C8.93229 2.77083 8.22917 2.5 7.5 2.5C6.77083 2.5 6.06771 2.77083 5.39062 3.3125C4.71354 3.85417 4.375 4.65625 4.375 5.71875C4.375 6.41667 4.63021 7.14323 5.14063 7.89844C5.65104 8.65365 6.44271 9.45833 7.51563 10.3125ZM7.5 11.875C6.03125 10.7917 4.9349 9.73958 4.21094 8.71875C3.48698 7.69792 3.125 6.69792 3.125 5.71875C3.125 4.97917 3.25781 4.33073 3.52344 3.77344C3.78906 3.21615 4.13021 2.75 4.54688 2.375C4.96354 2 5.43229 1.71875 5.95313 1.53125C6.47396 1.34375 6.98958 1.25 7.5 1.25C8.01042 1.25 8.52604 1.34375 9.04688 1.53125C9.56771 1.71875 10.0365 2 10.4531 2.375C10.8698 2.75 11.2109 3.21615 11.4766 3.77344C11.7422 4.33073 11.875 4.97917 11.875 5.71875C11.875 6.69792 11.513 7.69792 10.7891 8.71875C10.0651 9.73958 8.96875 10.7917 7.5 11.875ZM7.5 6.875C7.84375 6.875 8.13802 6.7526 8.38281 6.50781C8.6276 6.26302 8.75 5.96875 8.75 5.625C8.75 5.28125 8.6276 4.98698 8.38281 4.74219C8.13802 4.4974 7.84375 4.375 7.5 4.375C7.15625 4.375 6.86198 4.4974 6.61719 4.74219C6.3724 4.98698 6.25 5.28125 6.25 5.625C6.25 5.96875 6.3724 6.26302 6.61719 6.50781C6.86198 6.7526 7.15625 6.875 7.5 6.875Z"
                                  fill="#5F646F"
                                />
                              </g>
                            </svg>
                          </span>
                          {w.location}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginRight: "8px" }}>
                      <div
                        style={{
                          padding: "1px 10px",
                          background:
                            w.status === "Available" ? "#d1fae5" : "#fee2e2",
                          borderRadius: "12px",
                        }}
                      >
                        <p
                          style={{
                            color:
                              w.status === "Available" ? "#166534" : "#b91c1c",
                            fontWeight: 500,
                            fontSize: "0.7rem",
                            margin: "4px 2px",
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

          {activeTab === "dashboard" && selectedWorker && (
            <div style={{ width: "60%", margin: "0 auto", textAlign: "left" }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  marginBottom: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onClick={() => setSelectedWorker(null)}
              >
                <span style={{ fontSize: "1.2rem" }}>←</span> กลับ
              </button>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px #e5e7eb",
                  padding: "32px 24px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "24px" }}
                >
                  <div
                    style={{
                      background: "#f3f4f6",
                      borderRadius: "50%",
                      width: "90px",
                      height: "90px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={selectedWorker.picture}
                      alt="profile"
                      width={60}
                      height={60}
                      style={{ borderRadius: "50%" }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                        marginBottom: "4px",
                      }}
                    >
                      {selectedWorker.name}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                        marginBottom: "4px",
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <mask
                            id="mask0_354_1820"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="16"
                            height="16"
                          >
                            <rect
                              x="0.418945"
                              y="0.205322"
                              width="15"
                              height="15"
                              fill="#D9D9D9"
                            />
                          </mask>
                          <g mask="url(#mask0_354_1820)">
                            <path
                              d="M5.18457 4.20532L6.93457 1.9397C7.05957 1.77303 7.20801 1.65063 7.37988 1.57251C7.55176 1.49438 7.73145 1.45532 7.91895 1.45532C8.10645 1.45532 8.28613 1.49438 8.45801 1.57251C8.62988 1.65063 8.77832 1.77303 8.90332 1.9397L10.6533 4.20532L13.3096 5.09595C13.5804 5.17928 13.7939 5.33293 13.9502 5.55688C14.1064 5.78084 14.1846 6.02824 14.1846 6.29907C14.1846 6.42407 14.1663 6.54907 14.1299 6.67407C14.0934 6.79907 14.0335 6.91886 13.9502 7.03345L12.2314 9.47095L12.2939 12.0334C12.3044 12.398 12.1846 12.7053 11.9346 12.9553C11.6846 13.2053 11.3929 13.3303 11.0596 13.3303C11.0387 13.3303 10.9242 13.3147 10.7158 13.2834L7.91895 12.5022L5.12207 13.2834C5.06999 13.3043 5.0127 13.3173 4.9502 13.3225C4.8877 13.3277 4.8304 13.3303 4.77832 13.3303C4.44499 13.3303 4.15332 13.2053 3.90332 12.9553C3.65332 12.7053 3.53353 12.398 3.54395 12.0334L3.60645 9.45532L1.90332 7.03345C1.81999 6.91886 1.76009 6.79907 1.72363 6.67407C1.68717 6.54907 1.66895 6.42407 1.66895 6.29907C1.66895 6.03866 1.74447 5.79647 1.89551 5.57251C2.04655 5.34855 2.25749 5.1897 2.52832 5.09595L5.18457 4.20532Z"
                              fill="#FACC15"
                            />
                          </g>
                        </svg>
                      ))}
                      <span
                        style={{
                          color: "#64748b",
                          fontSize: "1rem",
                          marginLeft: "6px",
                        }}
                      >
                        (2 รีวิว)
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    >
                      <span>🧰 {selectedWorker.skill}</span>
                      <span>📍 {selectedWorker.location}</span>
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        padding: "4px 16px",
                        background:
                          selectedWorker.status === "Available"
                            ? "#d1fae5"
                            : "#fee2e2",
                        color:
                          selectedWorker.status === "Available"
                            ? "#166534"
                            : "#b91c1c",
                        borderRadius: "999px",
                        fontWeight: "bold",
                        display: "inline-block",
                      }}
                    >
                      {selectedWorker.status}
                    </div>
                  </div>
                </div>
              </div>
              {/* เอกสาร */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px #e5e7eb",
                  padding: "24px",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    marginBottom: "16px",
                  }}
                >
                  เอกสาร
                </p>
                <div style={{ display: "flex", gap: "16px" }}>
                  <div
                    style={{
                      background: "#f3f4f6",
                      borderRadius: "999px",
                      padding: "8px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: "bold",
                      color: "#374151",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem", color: "#2563eb" }}>
                      📄
                    </span>
                    บัตรประชาชน
                  </div>
                  <div
                    style={{
                      background: "#f3f4f6",
                      borderRadius: "999px",
                      padding: "8px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: "bold",
                      color: "#374151",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem", color: "#2563eb" }}>
                      📄
                    </span>
                    ใบรับรองฝีมือ
                  </div>
                </div>
              </div>

              {/* รีวิว */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px #e5e7eb",
                  padding: "24px",
                  marginTop: "24px",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    marginBottom: "16px",
                  }}
                >
                  รีวิวจากลูกค้า
                </p>
                {/* รีวิวแต่ละรายการ */}
                <div style={{ marginBottom: "18px" }}>
                  <p
                    style={{
                      fontWeight: "bold",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                  >
                    คุณมานี
                  </p>
                  {[...Array(4)].map((_, i) => (
                    <svg
                      key={i}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_354_1820"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="16"
                        height="16"
                      >
                        <rect
                          x="0.418945"
                          y="0.205322"
                          width="15"
                          height="15"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_354_1820)">
                        <path
                          d="M5.18457 4.20532L6.93457 1.9397C7.05957 1.77303 7.20801 1.65063 7.37988 1.57251C7.55176 1.49438 7.73145 1.45532 7.91895 1.45532C8.10645 1.45532 8.28613 1.49438 8.45801 1.57251C8.62988 1.65063 8.77832 1.77303 8.90332 1.9397L10.6533 4.20532L13.3096 5.09595C13.5804 5.17928 13.7939 5.33293 13.9502 5.55688C14.1064 5.78084 14.1846 6.02824 14.1846 6.29907C14.1846 6.42407 14.1663 6.54907 14.1299 6.67407C14.0934 6.79907 14.0335 6.91886 13.9502 7.03345L12.2314 9.47095L12.2939 12.0334C12.3044 12.398 12.1846 12.7053 11.9346 12.9553C11.6846 13.2053 11.3929 13.3303 11.0596 13.3303C11.0387 13.3303 10.9242 13.3147 10.7158 13.2834L7.91895 12.5022L5.12207 13.2834C5.06999 13.3043 5.0127 13.3173 4.9502 13.3225C4.8877 13.3277 4.8304 13.3303 4.77832 13.3303C4.44499 13.3303 4.15332 13.2053 3.90332 12.9553C3.65332 12.7053 3.53353 12.398 3.54395 12.0334L3.60645 9.45532L1.90332 7.03345C1.81999 6.91886 1.76009 6.79907 1.72363 6.67407C1.68717 6.54907 1.66895 6.42407 1.66895 6.29907C1.66895 6.03866 1.74447 5.79647 1.89551 5.57251C2.04655 5.34855 2.25749 5.1897 2.52832 5.09595L5.18457 4.20532Z"
                          fill="#FACC15"
                        />
                      </g>
                    </svg>
                  ))}
                  <span style={{ color: "#64748b", marginLeft: "8px" }}>
                    ทำงานดี ตรงเวลา
                  </span>
                </div>
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid #f3f4f6",
                    margin: "12px 0",
                  }}
                />
                <div>
                  <p
                    style={{
                      fontWeight: "bold",
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                  >
                    คุณสมศักดิ์
                  </p>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_354_1820"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="16"
                        height="16"
                      >
                        <rect
                          x="0.418945"
                          y="0.205322"
                          width="15"
                          height="15"
                          fill="#D9D9D9"
                        />
                      </mask>
                      <g mask="url(#mask0_354_1820)">
                        <path
                          d="M5.18457 4.20532L6.93457 1.9397C7.05957 1.77303 7.20801 1.65063 7.37988 1.57251C7.55176 1.49438 7.73145 1.45532 7.91895 1.45532C8.10645 1.45532 8.28613 1.49438 8.45801 1.57251C8.62988 1.65063 8.77832 1.77303 8.90332 1.9397L10.6533 4.20532L13.3096 5.09595C13.5804 5.17928 13.7939 5.33293 13.9502 5.55688C14.1064 5.78084 14.1846 6.02824 14.1846 6.29907C14.1846 6.42407 14.1663 6.54907 14.1299 6.67407C14.0934 6.79907 14.0335 6.91886 13.9502 7.03345L12.2314 9.47095L12.2939 12.0334C12.3044 12.398 12.1846 12.7053 11.9346 12.9553C11.6846 13.2053 11.3929 13.3303 11.0596 13.3303C11.0387 13.3303 10.9242 13.3147 10.7158 13.2834L7.91895 12.5022L5.12207 13.2834C5.06999 13.3043 5.0127 13.3173 4.9502 13.3225C4.8877 13.3277 4.8304 13.3303 4.77832 13.3303C4.44499 13.3303 4.15332 13.2053 3.90332 12.9553C3.65332 12.7053 3.53353 12.398 3.54395 12.0334L3.60645 9.45532L1.90332 7.03345C1.81999 6.91886 1.76009 6.79907 1.72363 6.67407C1.68717 6.54907 1.66895 6.42407 1.66895 6.29907C1.66895 6.03866 1.74447 5.79647 1.89551 5.57251C2.04655 5.34855 2.25749 5.1897 2.52832 5.09595L5.18457 4.20532Z"
                          fill="#FACC15"
                        />
                      </g>
                    </svg>
                  ))}
                  <span style={{ color: "#64748b", marginLeft: "8px" }}>
                    ฝีมือดีมาก แนะนำ
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginTop: "32px",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    background: "linear-gradient(90deg,#2563eb,#1e40af)",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    padding: "18px 0",
                    fontSize: "1.1rem",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "0",
                  }}
                  onClick={() => {
                    // TODO: ใส่ logic assign งาน
                    alert("Assign งานให้ช่างนี้");
                  }}
                >
                  Assign งานให้ช่างนี้
                </button>
                <button
                  style={{
                    width: "100%",
                    background: "#22c55e",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    padding: "18px 0",
                    fontSize: "1.1rem",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  onClick={() => {
                    sendMessageToWorker(
                      selectedWorker.userId,
                      "แอดมินต้องการคุยกับคุณเรื่องงาน โปรดตอบกลับข้อความนี้"
                    );
                  }}
                >
                  <span style={{ fontSize: "1.3rem" }}>📞</span> ติดต่อทาง LINE
                </button>
              </div>
            </div>
          )}

          <div style={{ height: "60px" }}>
            <h3></h3>
          </div>

          {/* แถบล่าง */}
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
      </LoadingOverlay>
    </div>
  );
}
