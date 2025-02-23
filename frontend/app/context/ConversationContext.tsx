"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  role: string;
  message: string;
}

interface ConversationContextProps {
  conversationHistory: Message[];
  setConversationHistory: (history: Message[]) => void;
  evaluationResults: any;
  setEvaluationResults: (evalResults: any) => void;
  scores: any;
  setScores: (scores: any) => void;
  speechSwitch: number[];
  setSpeechSwitch: (switchTimes: number[]) => void;
  bestResult: any;
  setBestResult: (result: any) => void;
}

const ConversationContext = createContext<ConversationContextProps | undefined>(undefined);

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [evaluationResults, setEvaluationResults] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [speechSwitch, setSpeechSwitch] = useState<number[]>([]);
  const [bestResult, setBestResult] = useState<any>(null);

  return (
    <ConversationContext.Provider
      value={{
        conversationHistory,
        setConversationHistory,
        evaluationResults,
        setEvaluationResults,
        scores,
        setScores,
        speechSwitch,
        setSpeechSwitch,
        bestResult,
        setBestResult,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within a ConversationProvider");
  }
  return context;
};
