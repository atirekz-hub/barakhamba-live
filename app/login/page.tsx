
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/control");
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#101820",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <form onSubmit={handleLogin} style={{
        width: "100%",
        maxWidth: "400px",
        background: "#1c2935",
        padding: "30px",
        borderRadius: "18px",
        border: "1px solid #344454"
      }}>
        <h1 style={{ textAlign: "center", fontSize: "27px" }}>
          CONTROL ROOM
        </h1>

        <p style={{
          textAlign: "center",
          color: "#94a3b8",
          marginBottom: "30px"
        }}>
          Barahkhamba Live Administrator Login
        </p>

        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && (
          <p style={{ color: "#f87171", fontSize: "13px" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} style={{
          width: "100%",
          padding: "15px",
          marginTop: "20px",
          background: "#15803d",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "17px",
          fontWeight: "bold",
          cursor: "pointer"
        }}>
          {loading ? "Signing in..." : "LOGIN"}
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginTop: "8px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #475569",
  background: "#101820",
  color: "white",
  fontSize: "16px"
};
