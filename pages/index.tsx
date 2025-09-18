import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import liff from "@line/liff";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

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
  // const [profile, setProfile] = useState<{
  //   name: string;
  //   picture: string;
  //   userId: string;
  // } | null>(null);

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
                        <span className="text-xs text-gray-500 ml-1">(2)</span>
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
                        color: w.status === "Available" ? "#166534" : "#b91c1c",
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

        <div className="space-y-4 w-full max-w-sm">
          <Link
            href={{
              pathname: "/worker",
              query: profile,
            }}
          >
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              สมัครแรงงาน
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Dashboard ผู้ว่าจ้าง
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
