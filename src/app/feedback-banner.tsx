"use client";
import { useFeedback } from "../context/FeedbackContext";

export default function FeedbackBanner() {
  const { feedback, clearFeedback } = useFeedback();
  if (!feedback.message) return null;
  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4 transition-all duration-300 animate-slide-down shadow-lg rounded-lg flex items-center justify-between gap-2
        ${feedback.type === "error"
          ? "bg-red-500 text-white"
          : "bg-green-500 text-white"}
      `}
      style={{ minHeight: 48 }}
    >
      <span className="py-3 flex-1 text-center font-medium">{feedback.message}</span>
      <button
        className="ml-2 p-2 rounded-full hover:bg-white/20 focus:outline-none"
        onClick={clearFeedback}
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <style jsx global>{`
        @keyframes slide-down {
          0% { transform: translateY(-40px) scale(0.98); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
} 