import React, { useState, useMemo } from "react";

// Simple UI components
const Button = ({ children, onClick, disabled, color }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: "6px 12px",
      margin: "2px",
      cursor: disabled ? "not-allowed" : "pointer",
      border: "1px solid #333",
      borderRadius: "6px",
      backgroundColor: color || "#111827",
      color: "#fff",
      fontWeight: "bold",
      flexShrink: 0,
    }}
  >
    {children}
  </button>
);

const Badge = ({ children, color }) => (
  <span
    style={{
      padding: "2px 6px",
      marginLeft: "4px",
      backgroundColor: color || "#555",
      borderRadius: "4px",
      fontSize: "12px",
      color: "#fff",
    }}
  >
    {children}
  </span>
);

const Card = ({ children, style }) => (
  <div
    style={{
      borderRadius: "10px",
      padding: "12px",
      margin: "8px 0",
      backgroundColor: "#1f2937",
      color: "#fff",
      width: "100%",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

export default function AltGeneratorDashboard() {
  const [cooldown, setCooldown] = useState(0);
  const [status, setStatus] = useState("Working");
  const statusColors = { Working: "#10b981", "Not Working": "#10b981", "Not Checked": "#10b981" };
  const [combo, setCombo] = useState("");

  // Cooldown timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const prettyTime = useMemo(() => {
    const m = Math.floor(cooldown / 60);
    const s = cooldown % 60;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  }, [cooldown]);

  // Generate Alt using Vercel API
  const generateAlt = async () => {
    try {
      const res = await fetch("/api/generate");
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setCombo(data.alt);
      setCooldown(300);
    } catch (err) {
      console.error(err);
      alert("Error fetching alt");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        backgroundColor: "#111827",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h1 style={{ color: "#f43f5e", textAlign: "center" }}>Alt Generator Dashboard</h1>

        {/* Navigation */}
        <Card style={{ backgroundColor: "#111827", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          <div>
            <strong style={{ color: "#f87171" }}>Navigation</strong>
          </div>
          {["Generate", "Accounts", "Cookie Checker", "Scrape", "Updates"].map((item) => (
            <Button
              key={item}
              color="#f43f5e"
              onClick={() => {
                if (item === "Accounts") alert("You don't have access to this");
                if (item === "Updates") window.open("https://discord.gg/nQM3MqQEWP", "_blank");
              }}
            >
              {item}
            </Button>
          ))}
        </Card>

        {/* Cooldown and Alt Generator */}
        <Card>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <strong>Cooldown:</strong> {prettyTime}
            <Button onClick={generateAlt} disabled={cooldown > 0} color="#f87171">
              Generate Alt
            </Button>
            <Badge color="#f43f5e">Alt</Badge>
          </div>
        </Card>

        {/* Account Info */}
        <Card>
          <h3 style={{ color: "#f43f5e" }}>Account Info</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div>
              Username:{" "}
              <input
                value={combo.split(":")[0] || ""}
                readOnly
                style={{
                  fontFamily: "monospace",
                  color: "#fff",
                  backgroundColor: "#374151",
                  border: "none",
                  borderRadius: "4px",
                  width: "100%",
                }}
              />
            </div>
            <div>
              Password:{" "}
              <input
                value={combo.split(":")[1] || ""}
                readOnly
                style={{
                  fontFamily: "monospace",
                  color: "#fff",
                  backgroundColor: "#374151",
                  border: "none",
                  borderRadius: "4px",
                  width: "100%",
                }}
              />
            </div>
            <div>
              Status:{" "}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                {["Working", "Not Working", "Not Checked"].map((s) => (
                  <Button
                    key={s}
                    onClick={() => setStatus(s)}
                    color={status === s ? statusColors[s] : "#6b7280"}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Links */}
        <Card>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <Button color="#f97316" onClick={() => window.open("https://discord.gg/nQM3MqQEWP", "_blank")}>
              Support
            </Button>
            <Button color="#0ea5e9">Earn Money</Button>
            <Button color="#a78bfa" onClick={() => window.open("https://discord.gg/nQM3MqQEWP", "_blank")}>
              Discord
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
