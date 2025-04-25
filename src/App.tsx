import React, { useState } from "react";
import FilePicker from "./components/FilePicker";
import QRCode from "react-qr-code";

export default function App() {
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const theme = {
    background: darkMode ? "#121212" : "#f5f5f5",
    text: darkMode ? "#ffffff" : "#000000",
    cardBg: darkMode ? "#1e1e1e" : "white",
    inputBg: darkMode ? "#2d2d2d" : "#f8f9fa",
    border: darkMode ? "#444" : "#ddd",
    primaryButton: darkMode ? "#2980b9" : "#3498db",
    secondaryButton: darkMode ? "#27ae60" : "#2ecc71",
    disabledButton: darkMode ? "#555" : "#bdc3c7",
    placeholderText: darkMode ? "#b0b0b0" : "#7f8c8d",
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.background,
        color: theme.text,
        transition: "all 0.3s ease",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "8px 12px",
          borderRadius: "20px",
          border: "none",
          backgroundColor: darkMode ? "#333" : "#ddd",
          color: darkMode ? "#fff" : "#000",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 1000,
        }}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ marginBottom: "30px", color: theme.text }}>Waveshare</h1>

        <FilePicker setDownloadLink={setDownloadLink} darkMode={darkMode} />

        <div
          style={{
            marginTop: "30px",
            width: "100%",
            minHeight: "250px",
            backgroundColor: theme.cardBg,
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: downloadLink ? "flex-start" : "center",
            border: `1px solid ${theme.border}`,
            transition: "all 0.3s ease",
          }}
        >
          {downloadLink ? (
            <>
              <div style={{ padding: "10px", marginBottom: "15px" }}>
                <QRCode
                  value={downloadLink}
                  size={200}
                  bgColor={theme.cardBg}
                  fgColor={theme.text}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={downloadLink}
                  readOnly
                  style={{
                    flex: 1,
                    padding: "10px",
                    fontSize: "14px",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "4px",
                    marginRight: "10px",
                    backgroundColor: theme.inputBg,
                    color: theme.text,
                  }}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(downloadLink);
                    alert("Link copied to clipboard!");
                  }}
                  style={{
                    padding: "10px 15px",
                    cursor: "pointer",
                    backgroundColor: theme.primaryButton,
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Copy
                </button>
              </div>
            </>
          ) : (
            <p style={{ color: theme.placeholderText, textAlign: "center" }}>
              Share a file to generate QR code
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
