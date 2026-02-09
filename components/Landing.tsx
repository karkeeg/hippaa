"use client";

import React from "react";
import { 
  Settings, 
  ShieldCheck, 
  MessageSquare, 
  FileText,
  ArrowRight 
} from "lucide-react";

export default function Landing({ onEnter }: { onEnter: () => void }) {
  const palette = {
    bg: "#f8f9fa",
    light: "#ffffff",
    accent: "#6ba8a0",
    text: "#1f2937",
    muted: "#9ca3af",
    border: "rgba(0, 0, 0, 0.06)",
  };

  return (
    <div
      style={{
        // minHeight: "100vh",
        background: palette.bg,
        color: palette.text,
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 20px" }}>
        <header className="landing-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "8px",
                background: palette.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: palette.light,
                fontWeight: "700",
                fontSize: "18px",
              }}
            >
              H
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  lineHeight: "1.2",
                }}
              >
                HIPAA Admin
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: palette.muted,
                  fontWeight: "500",
                }}
              >
                Smart Chat System
              </div>
            </div>
          </div>

          <nav className="landing-nav">
            <button
              onClick={onEnter}
              style={{
                background: palette.accent,
                color: palette.light,
                border: "none",
                borderRadius: "6px",
                padding: "12px 28px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "16px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.opacity = "1";
              }}
            >
              Get Started
            </button>
          </nav>
        </header>

        <section className="landing-hero">
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: "0 0 12px 0",
                color: palette.muted,
                fontWeight: "600",
                fontSize: "16px",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
              }}
            >
              Healthcare Admin Platform
            </p>
            <h1
              style={{
                margin: "0 0 20px 0",
                lineHeight: "1.2",
                color: palette.text,
                fontWeight: "700",
              }}
            >
              Control, secure, and scale your practice
            </h1>
            <p
              style={{
                margin: "0 0 32px 0",
                color: palette.muted,
                maxWidth: "600px",
                lineHeight: "1.6",
                fontWeight: "400",
                fontSize: "18px",
              }}
            >
              A unified healthcare platform for managing access, documents, and
              patient communications. Built for modern clinics with security at
              every layer.
            </p>

            <div className="landing-cta-group">
              <button
                onClick={onEnter}
                className="landing-cta-primary"
                style={{
                  background: palette.accent,
                  color: palette.light,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "18px",
                  boxShadow: "0 2px 8px rgba(107, 168, 160, 0.15)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.boxShadow =
                    "0 4px 16px rgba(107, 168, 160, 0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.boxShadow =
                    "0 2px 8px rgba(107, 168, 160, 0.15)";
                }}
              >
                Start Building <ArrowRight size={18} style={{ marginLeft: "8px", verticalAlign: "middle" }} />
              </button>
              <button
                onClick={(e) => e.preventDefault()}
                className="landing-cta-secondary"
                style={{
                  background: "transparent",
                  border: `1.5px solid ${palette.border}`,
                  color: palette.text,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background =
                    "rgba(0, 0, 0, 0.02)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background =
                    "transparent";
                }}
              >
                View Docs
              </button>
            </div>
          </div>

          <div
            className="landing-hero-visual"
            style={{
              background: palette.light,
              borderRadius: "10px",
              border: `1px solid ${palette.border}`,
              position: "relative",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",

              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",

                background: `linear-gradient(90deg, transparent, ${palette.accent}, transparent)`,
              }}
            />
            <div style={{}}>
              <div
                style={{
                  fontSize: "14px",
                  color: palette.muted,
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Secure Admin Dashboard
              </div>
              <div
                style={{
                  fontSize: "32px",
                  color: palette.accent,
                  fontWeight: "700",
                }}
              >
                <Settings size={40} />
              </div>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div
            className="landing-feature-card"
            style={{
              background: palette.light,
              border: `1px solid ${palette.border}`,
              borderRadius: "8px",
              padding: "32px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 12px rgba(0, 0, 0, 0.08)";
              (e.currentTarget as HTMLElement).style.borderColor =
                palette.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.borderColor =
                palette.border;
            }}
          >
            <div
              className="landing-feature-icon"
              style={{
                color: palette.accent,
                marginBottom: "16px",
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "20px",
                fontWeight: "700",
                color: palette.text,
              }}
            >
              Secure & Compliant
            </h3>
            <p
              style={{
                margin: 0,
                color: palette.muted,
                fontSize: "16px",
                lineHeight: "1.6",
                fontWeight: "400",
              }}
            >
              Role-based access controls, audit logs, and encryption for
              healthcare compliance.
            </p>
          </div>

          <div
            className="landing-feature-card"
            style={{
              background: palette.light,
              border: `1px solid ${palette.border}`,
              borderRadius: "8px",
              padding: "32px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 12px rgba(0, 0, 0, 0.08)";
              (e.currentTarget as HTMLElement).style.borderColor =
                palette.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.borderColor =
                palette.border;
            }}
          >
            <div
              className="landing-feature-icon"
              style={{
                color: palette.accent,
                marginBottom: "16px",
              }}
            >
              <MessageSquare size={32} />
            </div>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "20px",
                fontWeight: "700",
                color: palette.text,
              }}
            >
              AI-Powered Chat
            </h3>
            <p
              style={{
                margin: 0,
                color: palette.muted,
                fontSize: "16px",
                lineHeight: "1.6",
                fontWeight: "400",
              }}
            >
              Knowledge-backed assistant for staff and patients with instant,
              accurate answers.
            </p>
          </div>

          <div
            className="landing-feature-card"
            style={{
              background: palette.light,
              border: `1px solid ${palette.border}`,
              borderRadius: "8px",
              padding: "32px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 12px rgba(0, 0, 0, 0.08)";
              (e.currentTarget as HTMLElement).style.borderColor =
                palette.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.borderColor =
                palette.border;
            }}
          >
            <div
              className="landing-feature-icon"
              style={{
                color: palette.accent,
                marginBottom: "16px",
              }}
            >
              <FileText size={32} />
            </div>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "20px",
                fontWeight: "700",
                color: palette.text,
              }}
            >
              Document Management
            </h3>
            <p
              style={{
                margin: 0,
                color: palette.muted,
                fontSize: "16px",
                lineHeight: "1.6",
                fontWeight: "400",
              }}
            >
              Upload, organize, and search patient documents with intelligent
              tagging.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
