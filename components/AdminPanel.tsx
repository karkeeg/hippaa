"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";
import { 
  Library, 
  Users, 
  Link as LinkIcon, 
  CheckCircle, 
  XCircle, 
  User, 
  Upload, 
  Trash2,
  FileBox
} from "lucide-react";

interface Therapist {
  email: string;
  name: string;
  active: boolean;
  assigned_clients?: string[];
  role?: string;
}

interface Client {
  client_id: string;
  display_name: string;
}

interface KnowledgeDoc {
  doc_id: string;
  title: string;
  category: string;
  chunk_count: number;
  uploaded_by: string;
  description?: string;
}

export default function AdminPanel() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState("therapy_techniques");
  const [docDescription, setDocDescription] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("therapist");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("knowledge"); // knowledge, users, assignments

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    await Promise.all([loadTherapists(), loadClients(), loadKnowledgeDocs()]);
  };

  const loadTherapists = async () => {
    try {
      const response = await apiCall("/admin/therapists");
      const data = await response.json();
      setTherapists(data.therapists);
      if (data.therapists.length > 0) {
        setSelectedTherapist(data.therapists[0].email);
      }
    } catch (error) {
      // console.error("Error loading therapists:", error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await apiCall("/clients");
      const data = await response.json();
      setClients(data.clients);
      if (data.clients.length > 0) {
        setSelectedClient(data.clients[0].client_id);
      }
    } catch (error) {
      // console.error("Error loading clients:", error);
    }
  };

  const loadKnowledgeDocs = async () => {
    try {
      const response = await apiCall("/admin/knowledge-documents");
      const data = await response.json();
      setKnowledgeDocs(data.documents);
    } catch (error) {
      // console.error("Error loading knowledge docs:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadKnowledge = async () => {
    if (!file) {
      setUploadError("Please select a file");
      return;
    }
    if (!docTitle) {
      setUploadError("Please enter a document title");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", docTitle);
    formData.append("description", docDescription);
    formData.append("category", docCategory);

    setLoading(true);
    try {
      const response = await apiCall("/admin/upload-knowledge", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === "ok") {
        setUploadSuccess(data.message || "Document uploaded successfully!");
        setFile(null);
        setDocTitle("");
        setDocDescription("");
        await loadKnowledgeDocs();
      } else {
        setUploadError(data.detail || "Upload failed");
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKnowledge = async (docId: string) => {
    if (!confirm("Delete this knowledge document?")) return;

    try {
      const response = await apiCall(`/admin/knowledge-documents/${docId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Document deleted successfully");
        await loadKnowledgeDocs();
      } else {
        alert("Failed to delete document");
      }
    } catch (error) {
      alert(
        "Error: " + (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  const handleAssignClient = async () => {
    try {
      const response = await apiCall("/admin/assign-client", {
        method: "POST",
        body: JSON.stringify({
          therapist_email: selectedTherapist,
          client_id: selectedClient,
        }),
      });

      if (response.ok) {
        alert("Client assigned successfully!");
        await loadAdminData();
      } else {
        alert("Failed to assign client");
      }
    } catch (error) {
      alert(
        "Error: " + (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  const handleUnassignClient = async () => {
    try {
      const response = await apiCall("/admin/unassign-client", {
        method: "POST",
        body: JSON.stringify({
          therapist_email: selectedTherapist,
          client_id: selectedClient,
        }),
      });

      if (response.ok) {
        alert("Client unassigned successfully!");
        await loadAdminData();
      } else {
        alert("Failed to unassign client");
      }
    } catch (error) {
      alert(
        "Error: " + (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserName || !newUserPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await apiCall("/admin/create-user", {
        method: "POST",
        body: JSON.stringify({
          email: newUserEmail,
          name: newUserName,
          password: newUserPassword,
          role: newUserRole,
        }),
      });

      if (response.ok) {
        alert("User created successfully!");
        setNewUserEmail("");
        setNewUserName("");
        setNewUserPassword("");
        await loadAdminData();
      } else {
        alert("Failed to create user");
      }
    } catch (error) {
      alert(
        "Error: " + (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  return (
    <div className="tab-content active h-full flex flex-col">
      <div className="admin-panel flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="admin-sub-tabs">
          <button 
            className={`sub-tab ${activeSubTab === "knowledge" ? "active" : ""}`}
            onClick={() => setActiveSubTab("knowledge")}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Library size={16} /> Knowledge Base
          </button>
          <button 
            className={`sub-tab ${activeSubTab === "users" ? "active" : ""}`}
            onClick={() => setActiveSubTab("users")}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Users size={16} /> User Management
          </button>
          <button 
            className={`sub-tab ${activeSubTab === "assignments" ? "active" : ""}`}
            onClick={() => setActiveSubTab("assignments")}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <LinkIcon size={16} /> Client Assignments
          </button>
        </div>

        <div className="admin-content-inner">
          {activeSubTab === "knowledge" && (
            <>
              {/* Upload Knowledge Base */}
              <div className="admin-section">
                <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Library size={20} /> Upload Knowledge Base Document
                </h2>
                {uploadSuccess && (
                  <div className="success-message">{uploadSuccess}</div>
                )}
                {uploadError && <div className="error-message">{uploadError}</div>}

                <div className="form-group">
                  <label>Document File (PDF, DOCX, TXT)</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      className="file-input"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileSelect}
                    />
                    <label className="file-label">
                      {file
                        ? `Selected: ${file.name}`
                        : "Click to select file or drag here"}
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Document Title</label>
                    <input
                      type="text"
                      placeholder="e.g., CBT Techniques Guide"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="select-input"
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value)}
                    >
                      <option value="therapy_techniques">Therapy Techniques</option>
                      <option value="evidence_based">Evidence-Based Practices</option>
                      <option value="regulations">Regulations & Compliance</option>
                      <option value="training">Training Materials</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description (Optional)</label>
                  <textarea
                    placeholder="Brief description of the document..."
                    value={docDescription}
                    onChange={(e) => setDocDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <button
                  className="btn"
                  onClick={handleUploadKnowledge}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Knowledge Document"}
                </button>
              </div>

              {/* Knowledge Base Documents List */}
              <div className="admin-section">
                <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Library size={20} /> Knowledge Base Documents
                </h2>
                <div className="scrollable-area">
                  {knowledgeDocs.length === 0 ? (
                    <p
                      style={{ color: "#7a82a8", textAlign: "center", padding: "20px" }}
                    >
                      No knowledge documents uploaded yet
                    </p>
                  ) : (
                    knowledgeDocs.map((doc) => (
                      <div key={doc.doc_id} className="knowledge-doc-card">
                        <div>
                          <h3>{doc.title}</h3>
                          <p>Category: {doc.category}</p>
                          <p>
                            Chunks: {doc.chunk_count} | Uploaded by: {doc.uploaded_by}
                          </p>
                          {doc.description && (
                            <p style={{ fontStyle: "italic" }}>{doc.description}</p>
                          )}
                        </div>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteKnowledge(doc.doc_id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {activeSubTab === "users" && (
            <>
              {/* Create User */}
              <div className="admin-section">
                <h2>Create New User</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      className="select-input"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                    >
                      <option value="therapist">Therapist</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <button className="btn" onClick={handleCreateUser}>
                  Create User
                </button>
              </div>

              {/* Therapists List */}
              <div className="admin-section flex-1 flex flex-col min-h-0 overflow-y-auto">
                <h2>All Users / Therapists</h2>
                <div className="scrollable-area">
                  {therapists.map((t) => (
                    <div key={t.email} className="therapist-card">
                      <h3>{t.name}</h3>
                      <p>Email: {t.email}</p>
                      <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        Status: {t.active ? <><CheckCircle size={14} color="#16a34a" /> Active</> : <><XCircle size={14} color="#dc2626" /> Inactive</>}
                      </p>
                      <p>Role: {t.role || (t.email.includes("admin") ? "admin" : "therapist")}</p>
                      <p>Assigned Clients: {t.assigned_clients?.length || 0}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeSubTab === "assignments" && (
            <>
              {/* Assign Clients */}
              <div className="admin-section">
                <h2>Assign Clients to Therapists</h2>
                <p style={{ marginBottom: "20px", color: "#6b7280", fontSize: "var(--text-base)" }}>
                  Link clients to their respective therapists to enable personalized smart chat assistance.
                </p>
                <div className="form-row">
                  <div className="form-group">
                    <label>Select Therapist</label>
                    <select
                      className="select-input"
                      value={selectedTherapist}
                      onChange={(e) => setSelectedTherapist(e.target.value)}
                    >
                      {therapists.map((t) => (
                        <option key={t.email} value={t.email}>
                          {t.name} ({t.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Select Client</label>
                    <select
                      className="select-input"
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                    >
                      {clients.map((c) => (
                        <option key={c.client_id} value={c.client_id}>
                          {c.display_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="btn-group">
                  <button className="btn" onClick={handleAssignClient} style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                    <CheckCircle size={18} /> Assign Client
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleUnassignClient}
                    style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
                  >
                    <XCircle size={18} /> Unassign Client
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
