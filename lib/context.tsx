"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { setSessionToken, setUnauthenticatedHandler } from "./api";

export interface User {
  email: string;
  name: string;
  role: string;
  session_token: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  metadata?: Record<string, any>;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [isHydrated, setIsHydrated] = useState(false);

  // Load user and state from localStorage on mount
  useEffect(() => {
    setUnauthenticatedHandler(() => {
      setCurrentUser(null);
    });

    try {
      const savedUser = localStorage.getItem("hipaa_user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        if (user.session_token) {
          setSessionToken(user.session_token);
        }
      }

      const savedTab = localStorage.getItem("hipaa_active_tab");
      if (savedTab) {
        setActiveTab(savedTab);
      }

      const savedClientId = localStorage.getItem("hipaa_selected_client");
      if (savedClientId) {
        setSelectedClientId(savedClientId);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("hipaa_active_tab", activeTab);
    }
  }, [activeTab, isHydrated]);

  useEffect(() => {
    if (isHydrated && selectedClientId) {
      localStorage.setItem("hipaa_selected_client", selectedClientId);
    }
  }, [selectedClientId, isHydrated]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      if (currentUser) {
        localStorage.setItem("hipaa_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("hipaa_user");
      }
    }
  }, [currentUser, isHydrated]);

  const addMessage = (message: ChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        selectedClientId,
        setSelectedClientId,
        chatHistory,
        setChatHistory,
        addMessage,
        clearChat,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
