"use client";

import { useApp } from "@/lib/context";
import ChatInterface from "./ChatInterface";
import AdminPanel from "./AdminPanel";
import DocumentsPanel from "./DocumentsPanel";
import Sidebar from "./Layout/Sidebar";
import Header from "./Layout/Header";

export default function MainApp() {
  const {
    currentUser,
    activeTab,
  } = useApp();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-container">
        <Header />
        <main className="content-area">
          {activeTab === "chat" && <ChatInterface />}
          {activeTab === "admin" && currentUser?.role === "admin" && (
            <AdminPanel />
          )}
          {activeTab === "documents" && currentUser?.role === "admin" && (
            <DocumentsPanel />
          )}
        </main>
      </div>
    </div>
  );
}
