
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CrossingStatus = {
  status: "OPEN" | "CLOSED" | "UNKNOWN";
  updated_at: string | null;
};

export default function Home() {
  const [status, setStatus] = useState<CrossingStatus>({
    status: "UNKNOWN",
    updated_at: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStatus() {
      const { data, error } = await supabase
        .from("crossing_status")
        .select("status, updated_at")
        .eq("id", 1)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setStatus(data as CrossingStatus);
        setError("");
      }

      setLoading(false);
    }

    fetchStatus();

    // Check for updates every 5 seconds
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  
const hasUpdate = Boolean(status.updated_at);

const isStale =
  !hasUpdate ||
  Date.now() - new Date(status.updated_at!).getTime() > 15 * 60 * 1000;

const isOpen = !isStale && status.status === "OPEN";
const isClosed = !isStale && status.status === "CLOSED";


  const signalColor = isOpen
    ? "#16a34a"
    : isClosed
    ? "#dc2626"
    : "#d97706";

  return (
    <main style={{
      minHeight: "100vh",
      background: "#101820",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "25px 18px"
    }}>
      <div style={{ maxWidth: "650px", margin: "auto" }}>

        <header style={{ textAlign: "center", marginBottom: "35px" }}>
          <div style={{ fontSize: "13px", letterSpacing: "3px", color: "#94a3b8" }}>
            AGRA • UTTAR PRADESH
          </div>
          <h1 style={{ fontSize: "34px", margin: "12px 0 6px" }}>
            BARAHKHAMBA LIVE
          </h1>
          <p style={{ color: "#94a3b8" }}>
            Railway Crossing Traffic Updates
          </p>
        </header>

        <section style={{
          background: "#1c2935",
          borderRadius: "22px",
          padding: "28px 20px",
          textAlign: "center",
          border: "1px solid #344454"
        }}>
          <p style={{
            color: "#aab7c4",
            fontSize: "13px",
            letterSpacing: "2px",
            fontWeight: "bold"
          }}>
            CURRENT CROSSING STATUS
          </p>

          <div style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            margin: "25px auto 20px",
            background: signalColor,
            border: "8px solid #344454",
            boxShadow: `0 0 35px ${signalColor}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "42px"
          }}>
            {isOpen ? "✓" : isClosed ? "✕" : "?"}
          </div>

          <h2 style={{
            fontSize: "34px",
            margin: "10px 0",
            color: isOpen ? "#4ade80" : isClosed ? "#f87171" : "#fbbf24"
          }}>
            
<h2 style={{
  fontSize: "34px",
  margin: "10px 0",
  color: isStale ? "#fb923c" :
    isOpen ? "#4ade80" :
    isClosed ? "#f87171" : "#fbbf24"
}}>
  {isStale
    ? "STATUS OUTDATED"
    : isOpen
    ? "GATE OPEN"
    : isClosed
    ? "GATE CLOSED"
    : "STATUS UNKNOWN"}
</h2>

          </h2>

          
<p style={{ color: "#aab7c4", fontSize: "14px" }}>
  {loading
    ? "Checking crossing status..."
    : isStale
    ? "Last update is over 15 minutes old. Please verify before travelling."
    : isOpen
    ? "Traffic can cross the railway line"
    : isClosed
    ? "Train movement • Please expect delays"
    : "Waiting for a status update"}
</p>


          {error && (
            <p style={{ color: "#fca5a5", fontSize: "12px" }}>
              Could not fetch status: {error}
            </p>
          )}
        </section>

        <section style={{
          marginTop: "20px",
          background: "#1c2935",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid #344454"
        }}>
          <h3 style={{ marginTop: 0 }}>📍 Crossing Location</h3>
          <p style={{ color: "#cbd5e1", marginBottom: 0 }}>
            
<a
  href="https://www.google.com/maps/search/?api=1&query=Barahkhamba+Railway+Crossing+Agra"
  target="_blank"
  rel="noopener noreferrer"
  style={{ color: "#cbd5e1", textDecoration: "underline" }}
>
  Barahkhamba Railway Crossing, Agra
</a>

          </p>
        </section>

        <section style={{
          marginTop: "15px",
          background: "#1c2935",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid #344454"
        }}>
          <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
            LAST UPDATED
          </p>
          <p style={{ fontSize: "17px", marginBottom: 0 }}>
            {status.updated_at
              ? new Date(status.updated_at).toLocaleString("en-IN")
              : "Not yet available"}
          </p>
        </section>

        <footer style={{
          textAlign: "center",
          color: "#718096",
          fontSize: "12px",
          marginTop: "35px",
          lineHeight: 1.7
        }}>
          Helping Agra travel smarter.
          <br />
          Independent public information project
          <br />
Made with ❤️ by <strong>Dr. Atirek Mittal</strong>
        </footer>

      </div>
    </main>
  );
}
