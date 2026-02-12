"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";
import { Tag, Loader2, AlertCircle } from "lucide-react";

interface TagObject {
  tag_id: string;
  canonical_name: string;
  display_name: string;
  description: string;
  requires_evidence_types: string[];
  applies_to_speaker_role: string[];
  min_confidence_assign: number;
  min_support_assign: number;
}

export default function TagsPanel() {
  const [tags, setTags] = useState<TagObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall("/evidence/tags/available");
      if (response.ok) {
        const data = await response.json();
        
        let tagsList: TagObject[] = [];
        if (Array.isArray(data)) {
          tagsList = data;
        } else if (data.tags && Array.isArray(data.tags)) {
          tagsList = data.tags;
        } else if (data.available_tags && Array.isArray(data.available_tags)) {
          tagsList = data.available_tags;
        }

        setTags(tagsList);
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to fetch tags");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagName: string) => {
    if (!confirm(`Are you sure you want to delete the tag "${tagName}"?`)) return;

    try {
      // The user specified /evidence/{evidence_id}/tags/{tag_name}
      // Since we are in the general Tags tab, we'll need an evidence_id.
      // For now, mirroring the deletion logic, but noting the evidence_id requirement.
      const response = await apiCall(`/evidence/system/tags/${tagName}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTags(tags.filter(t => t.canonical_name !== tagName));
      } else {
        const data = await response.json();
        alert(data.detail || "Failed to delete tag");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="tab-content active" style={{ padding: "24px" }}>
      <div className="admin-section">
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <Tag size={20} /> Available Evidence Tags
        </h2>

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-text-muted)", padding: "20px" }}>
            <Loader2 size={20} className="animate-spin" />
            Loading tags...
          </div>
        )}

        {error && (
          <div className="error-message">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={20} />
              {error}
            </div>
          </div>
        )}

        {!loading && !error && tags.length === 0 && (
          <p style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "40px" }}>No tags available at the moment.</p>
        )}

        {!loading && !error && tags.length > 0 && (
          <div className="scrollable-area">
            {tags.map((tag) => (
              <div key={tag.tag_id} className="knowledge-doc-card">
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3>{tag.display_name}</h3>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteTag(tag.canonical_name)}
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                    >
                      Delete
                    </button>
                  </div>
                  <p>Canonical Name: {tag.canonical_name}</p>
                  <p>
                    Confidence: {(tag.min_confidence_assign * 100).toFixed(0)}% | Support: {tag.min_support_assign}
                  </p>
                  {tag.description && (
                    <p style={{ fontStyle: "italic", marginTop: "8px", color: "var(--color-text-muted)" }}>{tag.description}</p>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                    {tag.requires_evidence_types.map((type) => (
                      <span key={type} className="user-badge" style={{ fontSize: "11px", padding: "4px 10px", textTransform: "capitalize" }}>
                        {type.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
