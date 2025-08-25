import React, { useState, useEffect } from "react";

function App() {
  // Initial accounts pool
  const initialAccounts = [
    { username: "JackCrystalMystic200", password: "Generated$2799231", id: "8303546331", created: "4/13/2025", status: "Working" },
    { username: "AltUser123456", password: "Generated$987654", id: "123456789", created: "4/14/2025", status: "Working" },
    { username: "AltUser654321", password: "Generated$123456", id: "987654321", created: "4/15/2025", status: "Working" },
  ];

  // Keys and roles
  const keys = {
    "premium48294729": "premium",
    "applefan773": "owner",
    "extreme48374937493": "extreme",
    "FREE25": "free",
  };

  // State
  const [role, setRole] = useState(null);
  const [enteredKey, setEnteredKey] = useState("");
  const [displayName, setDisplayName] = useState("joshuaknows_you");
  const [accountsPool] = useState(initialAccounts);
  const [account, setAccount] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [cooldown, setCooldown] = useState("0s");
  const [usedAccounts, setUsedAccounts] = useState(() => {
    return JSON.parse(localStorage.getItem("usedAccounts") || "[]");
  });

  // Persist used accounts
  useEffect(() => {
    localStorage.setItem("usedAccounts", JSON.stringify(usedAccounts));
  }, [usedAccounts]);

  // Sidebar hover glow
  const [hoveredItem, setHoveredItem] = useState(null);
  const sidebarItems = [
    { name: "⚡ Generate" },
    { name: "🔒 Accounts", extreme: true },
    { name: "🔒 Cookie Checker", extreme: true },
    { name: "🔒 Scrape", extreme: true },
    { name: "🔔 Updates" },
    { name: "👑 Upgrade" },
  ];

  // Redeem key
  const redeemKey = () => {
    const selectedRole = keys[enteredKey];
    if (selectedRole) {
      setRole(selectedRole);
    } else {
      alert("Invalid key!");
    }
  };

  // Status buttons
  const handleStatusClick = (status) => {
    setAccount(prev => ({ ...prev, status }));
  };
  const statusButtonStyle = (active) => ({
    flex: 1,
    padding: "5px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: active ? "#ff3333" : "#330000",
    color: active ? "#fff" : "#ccc",
    cursor: "pointer",
  });

  // Styles
  const sidebarStyle = {
    width: "250px",
    backgroundColor: "#1a0000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
    color: "#fff",
  };
  const mainStyle = {
    flex: 1,
    backgroundColor: "#0b0b0b",
    padding: "30px",
    overflowY: "auto",
  };
  const cardStyle = {
    backgroundColor: "#1a0000",
    borderRadius: "10px",
    padding: "15px",
    marginTop: "20px",
  };
  const avatarStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#330000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
  };
  const buttonStyle = {
    marginRight: "10px",
    backgroundColor: "#ff3333",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#fff",
  };

  // Cooldown logic
  const startCooldown = (seconds) => {
    setCooldown(`${Math.floor(seconds / 60)}m ${seconds % 60}s`);
    const timer = setInterval(() => {
      seconds -= 1;
      if (seconds <= 0) {
        clearInterval(timer);
        setCooldown("0s");
        localStorage.removeItem("cooldownTimestamp");
      } else {
        setCooldown(`${Math.floor(seconds / 60)}m ${seconds % 60}s`);
      }
    }, 1000);
  };

  // On component mount, restore cooldown
  useEffect(() => {
    const savedTimestamp = localStorage.getItem("cooldownTimestamp");
    if (savedTimestamp) {
      const now = Date.now();
      const remaining = Math.floor((savedTimestamp - now) / 1000);
      if (remaining > 0) startCooldown(remaining);
    }
  }, []);

  // Generate alt
  const generateAlt = () => {
    if (cooldown !== "0s") {
      alert("Please wait for the cooldown to finish!");
      return;
    }

    const nextAccount = accountsPool.find(a => !usedAccounts.includes(a.username));
    if (!nextAccount) {
      alert("No more unused accounts!");
      return;
    }

    setUsedAccounts(prev => [...prev, nextAccount.username]);
    setAccount(nextAccount);
    setHasGenerated(true);

    let seconds = 5 * 60; // 5-minute cooldown
    startCooldown(seconds);
    localStorage.setItem("cooldownTimestamp", Date.now() + seconds * 1000);
  };

  // Generate premium/2010 alt (owner only)
  const generatePremiumAlt = () => {
    if (role !== "owner") {
      alert("You don’t have permission to generate this account type!");
      return;
    }
    generateAlt();
  };

  // Reset used alts (owner only)
  const resetAlts = () => {
    if (role !== "owner") return;
    setUsedAccounts([]);
    localStorage.removeItem("cooldownTimestamp");
    setCooldown("0s");
    alert("All accounts have been reset!");
  };

  // Key redemption screen
  if (!role) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#0b0b0b", color: "#fff", flexDirection: "column" }}>
        <h2>Enter your key to redeem role</h2>
        <input value={enteredKey} onChange={(e) => setEnteredKey(e.target.value)} style={{ padding: "10px", borderRadius: "5px", marginBottom: "10px" }} />
        <button onClick={redeemKey} style={{ padding: "10px 15px", borderRadius: "5px", backgroundColor: "#ff3333", color: "#fff", border: "none", cursor: "pointer" }}>Redeem</button>
      </div>
    );
  }

  // Dashboard
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Segoe UI, sans-serif", color: "#fff" }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px", color: "#ff3333" }}>
          <span>👤</span> AltGenator
        </div>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sidebarItems.map((item, index) => (
              <li
                key={index}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  padding: "10px 0",
                  color: item.name === "⚡ Generate" ? "#ff3333" : "#fff",
                  transition: "0.2s",
                  textShadow: hoveredItem === index ? "0 0 8px #ff3333" : "none",
                  cursor: "pointer",
                }}
              >
                {item.name}
                {item.extreme && (
                  <span style={{ backgroundColor: "#ff3333", borderRadius: "3px", padding: "2px 5px", fontSize: "10px", marginLeft: "5px" }}>Extreme</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <a href="#" style={{ display: "block", color: "#ff6666", textDecoration: "none", marginBottom: "5px" }}>📧 Support</a>
          <a href="#" style={{ display: "block", color: "#ff6666", textDecoration: "none" }}>💲 Earn Money</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#330000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginRight: "10px" }}>👤</div>
          <div>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              style={{ padding: "5px", borderRadius: "5px", border: "none", marginBottom: "3px", width: "150px", color: "#fff", backgroundColor: "#330000" }}
            />
            <br />
            <span style={{ color: "gold", fontSize: "12px" }}>
              {role === "owner" ? "👑 Owner" :
               role === "premium" ? "👑 Premium Access" :
               role === "extreme" ? "👑 Extreme" :
               role === "free" ? "Free Access" : ""}
            </span>
          </div>
        </div>

        {role === "owner" && (
          <button onClick={resetAlts} style={{ marginTop: "20px", padding: "5px 10px", borderRadius: "5px", border: "none", backgroundColor: "#ff3333", color: "#fff", cursor: "pointer" }}>
            Reset Alts
          </button>
        )}
      </aside>

      {/* Main */}
      <main style={mainStyle}>
        <h1 style={{ color: "#ff3333" }}>Account Generator</h1>
        <p>Generate unlimited Roblox accounts instantly</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2>Account Type Selection</h2>
          <button style={{ backgroundColor: "#ff3333", color: "#fff", border: "none", borderRadius: "5px", padding: "5px 10px", cursor: "pointer" }}
            onClick={generateAlt} disabled={cooldown !== "0s"}>Generate Alt</button>
        </div>

        <p>Choose an account type to generate</p>

        <div style={{ ...cardStyle, marginBottom: "15px", cursor: "pointer" }} onClick={generateAlt}>
          <div>
            <strong>Alt</strong> <span>{cooldown}</span>
            <p>Generate Roblox alt account</p>
          </div>
        </div>

        <div style={{ ...cardStyle, opacity: role === "owner" ? 1 : 0.6, marginBottom: "15px", cursor: role === "owner" ? "pointer" : "default" }} onClick={generatePremiumAlt}>
          <div>
            <strong>Random</strong>
            <p>Generate random account with Robux or items</p>
            {role !== "owner" && <button style={{ backgroundColor: "gold", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>👑 Upgrade</button>}
          </div>
        </div>

        <div style={{ ...cardStyle, opacity: role === "owner" ? 1 : 0.6, cursor: role === "owner" ? "pointer" : "default" }} onClick={generatePremiumAlt}>
          <div>
            <strong>2010 Unchecked</strong>
            <p>Generate random account with 2010 join date</p>
            {role !== "owner" && <button style={{ backgroundColor: "gold", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>👑 Upgrade</button>}
          </div>
        </div>

        {hasGenerated && account && (
          <div style={cardStyle}>
            <div style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "15px" }}>
              <div style={avatarStyle}>👤</div>
              <div>
                <h3>{account.username}</h3>
                <p>ID: {account.id}</p>
                <p>Created: {account.created}</p>
                <span>Alt</span>
                <div style={{ marginTop: "10px" }}>
                  <button style={buttonStyle}>Roblox Profile</button>
                  <button style={buttonStyle}>Roblox Login</button>
                </div>
              </div>
            </div>
            <div>
              <label>Username</label>
              <input type="text" value={account.username} readOnly style={{ width: "100%", padding: "5px", borderRadius: "5px", border: "none", backgroundColor: "#330000", color: "#fff", marginBottom: "10px" }} />
              <label>Password</label>
              <input type="text" value={account.password} readOnly style={{ width: "100%", padding: "5px", borderRadius: "5px", border: "none", backgroundColor: "#330000", color: "#fff", marginBottom: "10px" }} />
              <label>Combo Format (username:password)</label>
              <input type="text" value={`${account.username}:${account.password}`} readOnly style={{ width: "100%", padding: "5px", borderRadius: "5px", border: "none", backgroundColor: "#330000", color: "#fff", marginBottom: "10px" }} />
              <label>Account Status</label>
              <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                <button style={statusButtonStyle(account.status === "Working")} onClick={() => handleStatusClick("Working")}>Working</button>
                <button style={statusButtonStyle(account.status === "Not Working")} onClick={() => handleStatusClick("Not Working")}>Not Working</button>
                <button style={statusButtonStyle(account.status === "Not Checked")} onClick={() => handleStatusClick("Not Checked")}>Not Checked</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
