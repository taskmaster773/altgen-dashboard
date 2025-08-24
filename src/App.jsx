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
      border: "1px solid #ff0000",
      borderRadius: "6px",
      backgroundColor: color || "#b91c1c",
      color: "#fff",
      fontWeight: "bold",
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
      backgroundColor: color || "#991b1b",
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
      backgroundColor: "#1a1a1a",
      color: "#fff",
      ...style,
    }}
  >
    {children}
  </div>
);

const Stat = ({ label, value, color }) => (
  <div
    style={{
      display: "inline-block",
      margin: "4px",
      padding: "4px 8px",
      borderRadius: "6px",
      backgroundColor: color || "#7f1d1d",
    }}
  >
    <strong>{value}</strong> {label}
  </div>
);

export default function AltGeneratorDashboard() {
  // Cooldown state
  const [cooldown, setCooldown] = useState(0);

  // Status buttons
  const [status, setStatus] = useState("Working");
  const statusColors = { Working: "#ef4444", "Not Working": "#ef4444", "Not Checked": "#ef4444" };

  // Account tracking
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

  // Generate Alt now fetches from backend
  const generateAlt = async () => {
    try {
      const response = await fetch('http://localhost:3001/getAlt');
      if (!response.ok) {
        alert(await response.text());
        return;
      }
      const alt = await response.text();
      setCombo(alt); // show new alt in Account Info
      setCooldown(300); // reset cooldown
    } catch (err) {
      console.error(err);
      alert('Error fetching alt!');
    }
  };

  // Navigation click handler
  const handleNavClick = (item) => {
    if (item === "Accounts") {
      alert("You don't have access to this!");
      return;
    }
    if (item === "Updates") {
      window.open("https://discord.gg/nQM3MqQEWP", "_blank");
      return;
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", backgroundColor: "#111111", minHeight: "100vh" }}>
      <h1 style={{ color: "#f87171" }}>Alt Generator Dashboard</h1>

      {/* Navigation / Sidebar simulation */}
      <Card style={{ backgroundColor: "#111111" }}>
        <div>
          <strong style={{ color: "#f87171" }}>Navigation</strong>
        </div>
        {["Generate", "Accounts", "Cookie Checker", "Scrape", "Updates"].map((item) => (
          <Button
            key={item}
            color="#b91c1c"
            onClick={() => handleNavClick(item)}
          >
            {item}
          </Button>
        ))}
      </Card>

      {/* Cooldown and Alt Generator */}
      <Card>
        <div>
          <Stat label="Cooldown" value={prettyTime} color="#dc2626" />
          <Button onClick={generateAlt} disabled={cooldown > 0} color="#b91c1c">Generate Alt</Button>
          <Badge color="#991b1b">Alt</Badge>
        </div>
      </Card>

      {/* Account Info */}
      <Card>
        <h3 style={{ color: "#f87171" }}>Account Info</h3>
        <div>
          Username:{" "}
          <input
            value={combo.split(":")[0] || ""}
            readOnly
            style={{ fontFamily: "monospace", color: "#fff", backgroundColor: "#2a2a2a", border: "none", borderRadius: "4px" }}
          />
        </div>
        <div>
          Password:{" "}
          <input
            value={combo.split(":")[1] || ""}
            readOnly
            style={{ fontFamily: "monospace", color: "#fff", backgroundColor: "#2a2a2a", border: "none", borderRadius: "4px" }}
          />
        </div>
        <div>
          Status:{" "}
          {["Working", "Not Working", "Not Checked"].map((s) => (
            <Button
              key={s}
              onClick={() => setStatus(s)}
              color={status === s ? statusColors[s] : "#6b7280"} // clicked = red
            >
              {s}
            </Button>
          ))}
        </div>
      </Card>

      {/* Links */}
      <Card>
        <div>
          <Button color="#dc2626" onClick={() => window.open("https://discord.gg/nQM3MqQEWP", "_blank")}>
            Support
          </Button>
          <Button color="#b91c1c">Earn Money</Button>
          <Button color="#991b1b" onClick={() => window.open("https://discord.gg/nQM3MqQEWP", "_blank")}>
            Discord
          </Button>
        </div>
      </Card>
    </div>
  );
}
