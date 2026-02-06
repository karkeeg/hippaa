"use client";

import { useEffect, useState } from "react";
import { logout } from "@/lib/api";
import { useApp } from "@/lib/context";
import ChatInterface from "./ChatInterface";
import AdminPanel from "./AdminPanel";
import DocumentsPanel from "./DocumentsPanel";

export default function MainApp() {
  // Initialize activeTab with localStorage
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hipaa_active_tab") || "chat";
    }
    return "chat";
  });

  const [clients, setClients] = useState<
    { client_id: string; display_name: string }[]
  >([]);

  const {
    currentUser,
    setCurrentUser,
    selectedClientId,
    setSelectedClientId: setAppClientId,
    clearChat,
  } = useApp();

  // Restore selectedClientId from localStorage on mount (only once)
  useEffect(() => {
    try {
      const savedClientId = localStorage.getItem("hipaa_selected_client");
      if (savedClientId && !selectedClientId) {
        setAppClientId(savedClientId);
      }
    } catch (error) {
      console.error("Failed to load client from localStorage:", error);
    }
  }, []); // Run only once on mount

  // Save activeTab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("hipaa_active_tab", activeTab);
  }, [activeTab]);

  // Save selectedClientId to localStorage when it changes (no circular dependency)
  useEffect(() => {
    if (selectedClientId) {
      localStorage.setItem("hipaa_selected_client", selectedClientId);
    }
  }, [selectedClientId]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const API_URL = "https://lo.return2intimacy.com/api";

      const response = await fetch(`${API_URL}/clients`, {
        headers: currentUser?.session_token
          ? { Authorization: `Bearer ${currentUser.session_token}` }
          : {},
      });

      if (response.ok) {
        const data = await response.json();
        setClients(data.clients);
      }
    } catch (error) {
      // console.error("Error loading clients:", error);
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    setAppClientId(clientId);
    clearChat();
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <div className="main-app active">
      {/* Header */}
      <div className="header">
        <h1>🩺 HIPAA Admin Smart Chat</h1>
        <div className="user-info">
          <div className="user-badge">
            👤 {currentUser?.name} (
            {currentUser && currentUser.role
              ? currentUser.role.charAt(0).toUpperCase() +
                currentUser.role.slice(1)
              : ""}
            )
          </div>
          <button
            className="header-btn"
            onClick={() => {
              clearChat();
            }}
          >
            🗑️ Clear Chat
          </button>
          <button className="header-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          💬 Chat
        </button>
        {currentUser?.role === "admin" && (
          <button
            className={`tab ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            ⚙️ Admin Panel
          </button>
        )}
        {currentUser?.role === "admin" && (
          <button
            className={`tab ${activeTab === "documents" ? "active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            📄 Documents
          </button>
        )}
      </div>

      {/* Client Selector */}
      {currentUser?.role === "therapist" && (
        <div className="client-selector active">
          <label htmlFor="clientSelect">Select Client or Knowledge Base:</label>
          <select
            id="clientSelectDropdown"
            className="select-input"
            value={selectedClientId || ""}
            onChange={handleClientChange}
          >
            <option value="">-- Select Client or Topic --</option>
            <option value="GENERAL_KNOWLEDGE">
              📚 General Questions / Training
            </option>
            {clients.map((c) => (
              <option key={c.client_id} value={c.client_id}>
                👤 {c.display_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {currentUser?.role === "admin" && (
        <div className="client-selector active">
          <label htmlFor="clientSelect">Select Client or Knowledge Base:</label>
          <select
            id="clientSelectDropdown"
            className="select-input"
            value={selectedClientId || ""}
            onChange={handleClientChange}
          >
            <option value="">-- Optional: Select Client --</option>
            <option value="GENERAL_KNOWLEDGE">
              📚 General Questions / Training
            </option>
            {clients.map((c) => (
              <option key={c.client_id} value={c.client_id}>
                👤 {c.display_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeTab === "chat" && <ChatInterface />}
        {activeTab === "admin" && currentUser?.role === "admin" && (
          <AdminPanel />
        )}
        {activeTab === "documents" && currentUser?.role === "admin" && (
          <DocumentsPanel />
        )}
      </div>
    </div>
  );
}
