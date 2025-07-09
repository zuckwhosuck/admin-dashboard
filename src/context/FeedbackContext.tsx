"use client";

import React, { createContext, useContext, useState } from "react";

type FeedbackType = {
  message: string;
  type: "success" | "error" | null;
};

type FeedbackContextType = {
  feedback: FeedbackType;
  setFeedback: (msg: FeedbackType) => void;
  clearFeedback: () => void;
};

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider = ({ children }: { children: React.ReactNode }) => {
  const [feedback, setFeedbackState] = useState<FeedbackType>({ message: "", type: null });

  const setFeedback = (msg: FeedbackType) => setFeedbackState(msg);
  const clearFeedback = () => setFeedbackState({ message: "", type: null });

  return (
    <FeedbackContext.Provider value={{ feedback, setFeedback, clearFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}; 