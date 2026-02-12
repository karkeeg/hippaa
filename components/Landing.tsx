"use client";

import React from "react";
import {
  Settings,
  ShieldCheck,
  MessageSquare,
  FileText,
  ArrowRight,
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
        width: "100%",
        minHeight: "100vh",
        background: palette.bg,
        color: palette.text,
      }}
    >
      {/* ================= HEADER ================= */}
     <header
  style={{
    width: "100%",
    height: "72px",
    background: "#ffffff", // Separate header color
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    position: "sticky", // Makes it feel like real header
    top: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 clamp(20px, 6vw, 80px)",
  }}
>

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
            <div style={{ fontSize: "20px", fontWeight: "700" }}>
              HIPAA Admin
            </div>
            <div style={{ fontSize: "14px", color: palette.muted }}>
              Smart Chat System
            </div>
          </div>
        </div>

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
          }}
        >
          Get Started
        </button>
      </header>

      {/* ================= HERO ================= */}
      <section
        style={{
          width: "100%",
          padding: "60px clamp(20px, 6vw, 80px)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "60px",
        }}
      >
        {/* LEFT CONTENT */}
        <div style={{ flex: "1 1 500px" }}>
          <p
            style={{
              color: palette.muted,
              fontWeight: "600",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Healthcare Admin Platform
          </p>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: "1.2",
              marginBottom: "20px",
              fontWeight: "700",
            }}
          >
            Control, secure, and scale your practice
          </h1>

          <p
            style={{
              color: palette.muted,
              fontSize: "clamp(16px, 2vw, 18px)",
              lineHeight: "1.6",
              maxWidth: "600px",
              marginBottom: "32px",
            }}
          >
            A unified healthcare platform for managing access, documents, and
            patient communications. Built for modern clinics with security at
            every layer.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <button
              onClick={onEnter}
              style={{
                background: palette.accent,
                color: palette.light,
                border: "none",
                borderRadius: "8px",
                padding: "14px 28px",
                fontWeight: "600",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Start Building <ArrowRight size={18} />
            </button>

            <button
              style={{
                background: "transparent",
                border: `1px solid ${palette.border}`,
                borderRadius: "8px",
                padding: "14px 28px",
                fontWeight: "500",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              View Docs
            </button>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div
          style={{
            flex: "1 1 400px",
            background: palette.light,
            borderRadius: "12px",
            border: `1px solid ${palette.border}`,
            padding: "60px 40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "260px",
          }}
        >
          <Settings size={60} color={palette.accent} />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        style={{
          width: "100%",
          padding: "80px clamp(20px, 6vw, 80px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              icon: <ShieldCheck size={32} />,
              title: "Secure & Compliant",
              desc: "Role-based access controls, audit logs, and encryption for healthcare compliance.",
            },
            {
              icon: <MessageSquare size={32} />,
              title: "AI-Powered Chat",
              desc: "Knowledge-backed assistant for staff and patients with instant, accurate answers.",
            },
            {
              icon: <FileText size={32} />,
              title: "Document Management",
              desc: "Upload, organize, and search patient documents with intelligent tagging.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                background: palette.light,
                border: `1px solid ${palette.border}`,
                borderRadius: "12px",
                padding: "40px 30px",
                transition: "0.2s ease",
              }}
            >
              <div style={{ color: palette.accent, marginBottom: "16px" }}>
                {feature.icon}
              </div>

              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                {feature.title}
              </h3>

              <p
                style={{
                  color: palette.muted,
                  lineHeight: "1.6",
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
