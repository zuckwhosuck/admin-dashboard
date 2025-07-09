"use client";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <button
      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400"
      onClick={() => {
        logout();
        router.push("/login");
      }}
      title="Logout"
    >
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
} 