"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { useApp } from "@/lib/context";
import { setSessionToken } from "@/lib/api";
import { Stethoscope, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

interface LoginProps {
  onLoginSuccess: () => void;
  onBack?: () => void;
}

export default function Login({ onLoginSuccess, onBack }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      setCurrentUser(result.user);
      setSessionToken(result.user.session_token);
      onLoginSuccess();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {onBack && (
          <button
            onClick={onBack}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              background: "transparent",
              border: "none",
              color: "#666",
              cursor: "pointer",
              padding: "4px 8px",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
        )}
        <h1 style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
          <Stethoscope size={32} color="#2b6cb0" /> HIPAA Admin
        </h1>
        <h2>Smart Chat System</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading} style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Logging in...
              </>
            ) : "Login"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            color: "#7a82a8",
            fontSize: "var(--text-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          <ShieldCheck size={20} /> HIPAA Compliant | All data encrypted
        </p>
      </div>
    </div>
  );
}
