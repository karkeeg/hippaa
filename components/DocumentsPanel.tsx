"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";
import { 
  FileText, 
  Loader2, 
  Inbox, 
  Calendar, 
  Search, 
  Folder,
  Eye
} from "lucide-react";

interface Client {
  client_id: string;
  display_name: string;
}

interface Document {
  doc_id: string;
  file_name: string;
  source_uri: string;
  doc_type: string;
  date: string;
  date_iso: string;
  client_name: string;
  client_id: string;
  chunk_count: number;
  drive_link?: string;
  soap_note?: Record<string, string>;
  tags?: Record<string, any>;
}

export default function DocumentsPanel() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [docTypes, setDocTypes] = useState(0);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await apiCall("/clients");
      const data = await response.json();
      setClients(data.clients);
    } catch (error) {
      // console.error("Error loading clients:", error);
    }
  };

  const loadClientDocuments = async (clientId: string) => {
    if (!clientId) {
      setDocuments([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiCall(`/admin/client-documents/${clientId}`);
      const data = await response.json();

      if (data.documents) {
        setDocuments(data.documents);
        setTotalDocs(data.documents.length);
        setTotalChunks(data.total_chunks || 0);

        const uniqueTypes = new Set(
          data.documents.map((d: Document) => d.doc_type).filter(Boolean),
        );
        setDocTypes(uniqueTypes.size);
      }
    } catch (error) {
      // console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    setSelectedClient(clientId);
    if (clientId) {
      loadClientDocuments(clientId);
    } else {
      setDocuments([]);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatSessionDate = (dateString: string) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const viewDocumentDetails = async (doc: Document) => {
    try {
      const response = await apiCall(`/admin/document-details/${doc.doc_id}`);
      const data = await response.json();

      if (!response.ok || data.status !== "ok") {
        alert(
          "Failed to load document details: " +
            (data.detail || "Unknown error"),
        );
        return;
      }

      // Display modal with full details
      alert(`
Document Details:
Title: ${doc.file_name}
Type: ${doc.doc_type}
Date: ${formatSessionDate(doc.date)}
Client: ${doc.client_name}
Chunks: ${doc.chunk_count}

SOAP Note:
${data.soap_note ? JSON.stringify(data.soap_note, null, 2) : "No SOAP note available"}

Tags:
${data.tags ? JSON.stringify(data.tags, null, 2) : "No tags available"}
      `);
    } catch (error) {
      alert(
        "Error loading document details: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  return (
    <div className="tab-content active h-full flex flex-col" style={{ padding: "24px" }}>
      <div className="admin-panel flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="admin-section">
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FileText size={20} /> Client Document Management
          </h2>

          <div className="form-group">
            <label>Select Client</label>
            <select
              className="select-input"
              value={selectedClient}
              onChange={handleClientChange}
            >
              <option value="">-- Select a client to view documents --</option>
              {clients.map((c) => (
                <option key={c.client_id} value={c.client_id}>
                  {c.display_name}
                </option>
              ))}
            </select>
          </div>

          {selectedClient && (
            <>
              {!loading && documents.length > 0 && (
                <div className="document-stats">
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-number">{totalDocs}</div>
                      <div className="stat-label">Total Documents</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{totalChunks}</div>
                      <div className="stat-label">Total Chunks</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{docTypes}</div>
                      <div className="stat-label">Document Types</div>
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="loading-spinner" style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", padding: "20px" }}>
                  <Loader2 size={24} className="animate-spin" /> Loading documents...
                </div>
              )}

              {!loading && documents.length === 0 && (
                <div className="no-documents">
                  <div className="no-documents-icon">
                    <Inbox size={48} color="#cbd5e0" />
                  </div>
                  <p>No documents found for this client</p>
                </div>
              )}

              {!loading && documents.length > 0 && (
                <div className="document-list">
                  {documents.map((doc) => (
                    <div key={doc.doc_id} className="document-card">
                      <div className="document-header">
                        <div>
                          <div className="document-title">
                            {doc.file_name ||
                              doc.source_uri ||
                              "Unknown Document"}
                          </div>
                          <div className="document-date" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Calendar size={14} /> {formatDate(doc.date || doc.date_iso)}
                          </div>
                        </div>
                        <div className="document-type-badge">
                          {doc.doc_type || "unknown"}
                        </div>
                      </div>

                      <div className="document-meta">
                        <div className="meta-item">
                          <div className="meta-label">Document ID</div>
                          <div className="meta-value">
                            {doc.doc_id || "N/A"}
                          </div>
                        </div>
                        <div className="meta-item">
                          <div className="meta-label">Client</div>
                          <div className="meta-value">
                            {doc.client_name || doc.client_id}
                          </div>
                        </div>
                        <div className="meta-item">
                          <div className="meta-label">Total Chunks</div>
                          <div className="meta-value">
                            {doc.chunk_count || 0}
                          </div>
                        </div>
                        <div className="meta-item">
                          <div className="meta-label">Session Date</div>
                          <div className="meta-value">
                            {formatSessionDate(doc.date || doc.date_iso)}
                          </div>
                        </div>
                      </div>

                      <div className="document-actions">
                        {doc.drive_link && (
                          <button
                            className="doc-btn primary"
                            onClick={() =>
                              window.open(doc.drive_link, "_blank")
                            }
                          >
                            <FileText size={16} /> View in Drive
                          </button>
                        )}
                        <button
                          className="doc-btn"
                          onClick={() => viewDocumentDetails(doc)}
                          style={{ display: "flex", alignItems: "center", gap: "6px" }}
                        >
                          <Search size={16} /> View Full SOAP Note
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!selectedClient && (
            <div className="no-documents">
              <div className="no-documents-icon">
                <Folder size={48} color="#cbd5e0" />
              </div>
              <p>Select a client to view their documents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
