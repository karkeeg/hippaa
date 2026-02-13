"use client";

import { useApp } from "@/lib/context";
import {
  MessageSquare,
  Settings,
  FileText,
  Stethoscope,
  User,
  X,
  Tag
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const navItems = [
    { id: "chat", label: "Chat", icon: <MessageSquare size={18} /> },
    { id: "admin", label: "Admin Panel", icon: <Settings size={18} />, role: "admin" },
    { id: "documents", label: "Documents", icon: <FileText size={18} />, role: "admin" },
    { id: "tags", label: "Tags", icon: <Tag size={18} /> },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Stethoscope size={24} color="#101a22ff" />
            HIPAA Admin
          </div>
          <button className="mobile-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            if (item.role && currentUser?.role !== item.role) return null;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar" style={{ background: "var(--color-bg-main)" }}>
              <User size={20} color="var(--color-primary)" />
            </div>
            <div className="user-details">
              <div className="user-name">{currentUser?.name || "Therapist"}</div>
              <div className="user-role">{currentUser?.role || "Staff"}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
