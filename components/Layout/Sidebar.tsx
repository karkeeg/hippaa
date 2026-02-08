"use client";

import { useApp } from "@/lib/context";

export default function Sidebar() {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const navItems = [
    { id: "chat", label: "💬 Chat", icon: "💬" },
    { id: "admin", label: "⚙️ Admin Panel", icon: "⚙️", role: "admin" },
    { id: "documents", label: "📄 Documents", icon: "📄", role: "admin" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">🩺 HIPAA Admin</div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          if (item.role && currentUser?.role !== item.role) return null;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label.replace(item.icon, "").trim()}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <p className="user-name">{currentUser?.name}</p>
            <p className="user-role">{currentUser?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
