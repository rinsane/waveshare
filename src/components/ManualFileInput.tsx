import React, { useState } from "react";
import { invoke } from "@tauri-apps/api";

interface Props {
  setDownloadLink: (url: string) => void;
}

export default function ManualFileInput({ setDownloadLink }: Props) {
  const [path, setPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

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

  async function handleShutdown() {
    try {
      await invoke("shutdown_server");
    } catch (e) {
      alert("Failed to shut down the server.");
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '400px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '15px' 
      }}>
        <input
          type="text"
          placeholder="Enter file path (e.g. /home/user/file.txt)"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          disabled={!isEditable} // Disable if not editable
          style={{
            width: 'calc(100% - 50px)', // Adjust to make space for checkbox
            padding: '10px',
            boxSizing: 'border-box'
          }}
        />
        <label style={{ marginLeft: '10px' }}>
          <input
            type="checkbox"
            checked={isEditable}
            onChange={() => setIsEditable(!isEditable)}
          />
          Edit
        </label>
      </div>

      <button
        onClick={handleShare}
        disabled={isLoading || !path}
        style={{
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: isLoading || !path ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          width: '100%',
          marginBottom: '10px'
        }}
      >
        {isLoading ? 'Sharing...' : 'Share File'}
      </button>

      <button
        onClick={handleShutdown}
        style={{
          padding: '8px 15px',
          cursor: 'pointer',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          width: '100%'
        }}
      >
        Stop Server
      </button>
    </div>
  );
}
