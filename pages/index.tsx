import { useEffect, useState } from "react";
import liff from "@line/liff";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [profile, setProfile] = useState<{ name: string; picture: string } | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: "2008132085-Ex4bOk3P" });
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
      <h1 className="text-3xl font-bold text-blue-700 mb-4">AppChang Pro</h1>

      {profile && (
        <div className="text-center mb-6">
          <Image 
            src={profile.picture} 
            alt="profile" 
            width={80} 
            height={80} 
            className="rounded-full mx-auto mb-2" 
          />
          <p className="text-lg font-semibold">สวัสดี, {profile.name}</p>
        </div>
      )}

      <div className="space-y-4 w-full max-w-sm">
        <Link href="/worker">
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
  );
}