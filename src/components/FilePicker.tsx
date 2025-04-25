import React, { useState } from "react";
import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";

interface Props {
  setDownloadLink: (url: string) => void;
  darkMode: boolean;
}

export default function FilePicker({ setDownloadLink, darkMode }: Props) {
  const [path, setPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  // Theme configuration
  const theme = {
    background: darkMode ? "#1e1e1e" : "white",
    text: darkMode ? "#ffffff" : "#000000",
    inputBg: darkMode ? "#2d2d2d" : "#f8f9fa",
    border: darkMode ? "#444" : "#ddd",
    primaryButton: darkMode ? "#2980b9" : "#3498db",
    secondaryButton: darkMode ? "#27ae60" : "#2ecc71",
    editButton: darkMode ? "#555" : "#95a5a6",
    editButtonActive: darkMode ? "#c0392b" : "#e74c3c",
    disabledButton: darkMode ? "#555" : "#bdc3c7",
  };

  async function handleSelectFile() {
    const selectedFile = await open({
      multiple: false,
      filters: [{ name: "All Files", extensions: ["*"] }],
    });
    if (selectedFile) {
      setPath(selectedFile as string);
    }
  }

  async function handleShare() {
    if (!path) return;
    setIsLoading(true);

    try {
      const token = await invoke<string>("set_file_to_share", { path });
      const ip = await invoke<string>("get_device_ip");
      const link = `http://${ip}:8080/download/${token}`;
      setDownloadLink(link);
    } catch (e) {
      console.error("Failed to share file:", e);
      alert("Failed to share file. Check the console for more info.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <button
        onClick={handleSelectFile}
        style={{
          padding: "12px 20px",
          cursor: "pointer",
          backgroundColor: theme.secondaryButton,
          color: "white",
          border: "none",
          borderRadius: "6px",
          width: "100%",
          marginBottom: "15px",
          fontWeight: "bold",
          transition: "background-color 0.3s ease",
        }}
      >
        Select File
      </button>

      <div
        style={{
          display: "flex",
          width: "100%",
          marginBottom: "15px",
        }}
      >
        <input
          type="text"
          placeholder="No file selected"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          readOnly={!isEditable}
          style={{
            flex: 1,
            padding: "12px",
            boxSizing: "border-box",
            backgroundColor: isEditable ? theme.background : theme.inputBg,
            border: `1px solid ${theme.border}`,
            borderRadius: "6px",
            marginRight: "8px",
            color: theme.text,
            transition: "all 0.3s ease",
          }}
        />
        <button
          onClick={() => setIsEditable(!isEditable)}
          style={{
            width: "45px",
            height: "45px",
            cursor: "pointer",
            backgroundColor: isEditable
              ? theme.editButtonActive
              : theme.editButton,
            color: "white",
            border: "none",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            transition: "all 0.3s ease",
          }}
          title={isEditable ? "Lock editing" : "Edit path"}
        >
          {isEditable ? "🔒" : "✏️"}
        </button>
      </div>

      <button
        onClick={handleShare}
        disabled={isLoading || !path}
        style={{
          padding: "12px 20px",
          cursor: isLoading || !path ? "not-allowed" : "pointer",
          backgroundColor:
            isLoading || !path ? theme.disabledButton : theme.primaryButton,
          color: "white",
          border: "none",
          borderRadius: "6px",
          width: "100%",
          fontWeight: "bold",
          transition: "background-color 0.3s ease",
        }}
      >
        {isLoading ? "Sharing..." : "Share File"}
      </button>
    </div>
  );
}
