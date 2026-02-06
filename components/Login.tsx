"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { useApp } from "@/lib/context";
import { setSessionToken } from "@/lib/api";

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
              fontSize: 18,
              padding: "4px 8px",
            }}
          >
            ← Back
          </button>
        )}
        <h1>🩺 HIPAA Admin</h1>
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
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            color: "#7a82a8",
            fontSize: "14px",
          }}
        >
          🔒 HIPAA Compliant | All data encrypted
        </p>
      </div>
    </div>
  );
}
