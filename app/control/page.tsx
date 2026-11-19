
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Status = "OPEN" | "CLOSED" | "UNKNOWN";

export default function Control() {
  const router = useRouter();

  const [status, setStatus] = useState<Status>("UNKNOWN");
  const [updated, setUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function initialise() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("crossing_status")
        .select("status, updated_at")
        .eq("id", 1)
        .single();

      if (error) {
        setMessage(error.message);
      } else if (data) {
        setStatus(data.status as Status);
        setUpdated(
          data.updated_at
            ? new Date(data.updated_at).toLocaleString("en-IN")
            : "No update yet"
        );
      }

      setLoading(false);
    }

    initialise();
  }, [router]);

  async function updateStatus(newStatus: "OPEN" | "CLOSED") {
    setSaving(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("crossing_status")
      .update({
        status: newStatus,
        updated_at: now,
        updated_by: user.id,
      })
      .eq("id", 1)
      .select("status, updated_at")
      .single();

    if (error) {
      setMessage("Update failed: " + error.message);
    } else if (data) {
      setStatus(data.status as Status);
      setUpdated(new Date(data.updated_at).toLocaleString("en-IN"));
      setMessage("Database updated successfully!");
    }

    setSaving(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const statusColor =
    status === "OPEN" ? "#4ade80" :
    status === "CLOSED" ? "#f87171" : "#fbbf24";

  if (loading) {
    return (
      <main style={{ background: "#101820", color: "white", minHeight: "100vh", padding: "40px", textAlign: "center" }}>
        Checking administrator access...
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#101820",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "30px 20px"
    }}>
      <div style={{ maxWidth: "550px", margin: "auto" }}>

        <header style={{ textAlign: "center", marginBottom: "35px" }}>
          <p style={{ color: "#94a3b8", letterSpacing: "3px" }}>
            BARAHKHAMBA LIVE
          </p>
          <h1 style={{ fontSize: "32px" }}>CONTROL ROOM</h1>
          <p style={{ color: "#94a3b8" }}>
            Administrator Dashboard
          </p>
        </header>

        <section style={{
          background: "#1c2935",
          border: "1px solid #344454",
          borderRadius: "18px",
          padding: "25px",
          textAlign: "center"
        }}>
          <p style={{ color: "#94a3b8", fontSize: "13px" }}>
            DATABASE CROSSING STATUS
          </p>

          <h2 style={{ fontSize: "30px", color: statusColor }}>
            {status}
          </h2>

          <p style={{ color: "#94a3b8", fontSize: "13px" }}>
            Last updated: {updated || "Not yet available"}
          </p>
        </section>

        <h3 style={{ marginTop: "35px", textAlign: "center" }}>
          UPDATE CROSSING STATUS
        </h3>

        <button
          disabled={saving}
          onClick={() => updateStatus("OPEN")}
          style={{
            width: "100%",
            padding: "22px",
            marginTop: "15px",
            border: "none",
            borderRadius: "12px",
            background: "#15803d",
            color: "white",
            fontSize: "22px",
            fontWeight: "bold",
            cursor: "pointer",
            opacity: saving ? 0.6 : 1
          }}
        >
          ✓ GATE OPEN
        </button>

        <button
          disabled={saving}
          onClick={() => updateStatus("CLOSED")}
          style={{
            width: "100%",
            padding: "22px",
            marginTop: "15px",
            border: "none",
            borderRadius: "12px",
            background: "#b91c1c",
            color: "white",
            fontSize: "22px",
            fontWeight: "bold",
            cursor: "pointer",
            opacity: saving ? 0.6 : 1
          }}
        >
          ✕ GATE CLOSED
        </button>

        {saving && (
          <p style={{ textAlign: "center", color: "#94a3b8" }}>
            Saving update...
          </p>
        )}

        {message && (
          <p style={{ textAlign: "center", color: message.startsWith("Update failed") ? "#f87171" : "#4ade80" }}>
            {message}
          </p>
        )}

        <button
          onClick={logout}
          style={{
            display: "block",
            margin: "30px auto 0",
            padding: "12px 25px",
            background: "#344454",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          LOG OUT
        </button>

      </div>
    </main>
  );
}
