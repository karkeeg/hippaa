"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";
import { logout, apiCall } from "@/lib/api";
import { Trash2, LogOut, Library, User, Menu } from "lucide-react";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const {
    currentUser,
    setCurrentUser,
    selectedClientId,
    setSelectedClientId,
    clearChat,
    activeTab,
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
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        {activeTab === "chat" && (
          <div className="client-selector-mini">
            <select
              id="clientSelectDropdown"
              className="select-input-sm"
              value={selectedClientId || ""}
              onChange={handleClientChange}
            >
              <option value="">-- Select Client or KB --</option>
              <option value="GENERAL_KNOWLEDGE">General Training</option>
              {clients.map((c) => (
                <option key={c.client_id} value={c.client_id}>
                  {c.display_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="header-right">
        <button className="header-btn-new logout" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
