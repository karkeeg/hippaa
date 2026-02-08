"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";
import { logout, apiCall } from "@/lib/api";

export default function Header() {
  const {
    currentUser,
    setCurrentUser,
    selectedClientId,
    setSelectedClientId,
    clearChat,
  } = useApp();

  const [clients, setClients] = useState<
    { client_id: string; display_name: string }[]
  >([]);

  useEffect(() => {
    loadClients();
  }, [currentUser]);

  const loadClients = async () => {
    try {
      const response = await apiCall("/clients");
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
    setSelectedClientId(clientId);
    clearChat();
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <header className="header-new">
      <div className="header-left">
        <div className="client-selector-mini">
          <select
            id="clientSelectDropdown"
            className="select-input-sm"
            value={selectedClientId || ""}
            onChange={handleClientChange}
          >
            <option value="">-- Select Client or KB --</option>
            <option value="GENERAL_KNOWLEDGE">📚 General Training</option>
            {clients.map((c) => (
              <option key={c.client_id} value={c.client_id}>
                👤 {c.display_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn-new" onClick={clearChat}>
          🗑️ Clear Chat
        </button>
        <button className="header-btn-new logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
