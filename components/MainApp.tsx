import { useState } from "react";
import { useApp } from "@/lib/context";
import AdminPanel from "./AdminPanel";
import DocumentsPanel from "./DocumentsPanel";
import Sidebar from "./Layout/Sidebar";
import Header from "./Layout/Header";
import ChatInterface from "./ChatInterface";
import TagsPanel from "./TagsPanel";

export default function MainApp() {
  const {
    currentUser,
    activeTab,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dashboard-layout">
      <div 
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} 
        onClick={closeSidebar}
      />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="main-container">
        <Header onMenuClick={toggleSidebar} />
        <main className="content-area">
          {activeTab === "chat" && <ChatInterface />}
          {activeTab === "admin" && currentUser?.role === "admin" && (
            <AdminPanel />
          )}
          {activeTab === "documents" && currentUser?.role === "admin" && (
            <DocumentsPanel />
          )}
          {activeTab === "tags" && (
            <TagsPanel />
          )}
        </main>
      </div>
    </div>
  );
}
