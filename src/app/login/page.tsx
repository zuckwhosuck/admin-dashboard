"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useFeedback } from "../../context/FeedbackContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { feedback, setFeedback, clearFeedback } = useFeedback();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearFeedback();
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      setFeedback({ message: "Login successful!", type: "success" });
      router.push("/dashboard");
    } else {
      setFeedback({ message: "Invalid credentials", type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Login</h1>
          
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-gray-700 dark:text-gray-200 font-semibold">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition"
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-semibold">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg px-4 py-2 font-semibold transition disabled:opacity-50 mt-2 shadow"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
} 