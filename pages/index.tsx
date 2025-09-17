import { useEffect, useState } from "react";
import liff from "@line/liff";

export default function Home() {
  const [profile, setProfile] = useState<{ name: string; picture: string } | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        // 👉 ใส่ LIFF ID ที่คุณได้จาก LINE Developers
        await liff.init({ liffId: "2008132085-dVnGqvbp" });

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">LINE OA Web App</h1>

      {profile ? (
        <div className="text-center">
          <img
            src={profile.picture}
            alt="profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <p className="text-lg font-semibold">สวัสดี, {profile.name} 👋</p>
        </div>
      ) : (
        <p>กำลังโหลด...</p>
      )}
    </div>
  );
}