# 🌊 Waveshare

**Waveshare** is a lightweight, local-first file-sharing app that lets you instantly share files over the same Wi-Fi network or hotspot. Just pick a file, get a QR code, and let others download it — no internet or accounts required.

![tauri](https://img.shields.io/badge/Built%20with-Tauri-blueviolet?style=flat&logo=tauri)
![rust](https://img.shields.io/badge/Backend-Rust-orange?logo=rust)
![actix](https://img.shields.io/badge/Actix-Web%20Server-7F3FBF?logo=actix)
![status](https://img.shields.io/badge/Status-Work%20In%20Progress-yellow)

---

## ✨ Features

- 🔐 Share files securely via your local network or hotspot
- 🔗 Each shared file gets a unique tokenized URL
- 🖥️ Minimal UI with file selection and server control
- ⚡ Fast, lightweight, and internet-independent

---

## 🚀 Getting Started

### Prerequisites

- Rust (stable)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
- Node.js & npm (https://nodejs.org/en/download)
- Tauri CLI

```bash
npm create tauri-app@latest -- --tauri-version 1
```

### Clone & Run

```bash
git clone https://github.com/rinsane/waveshare.git
cd waveshare
npm install
npm run tauri dev
```

This will launch the Tauri app with a Rust backend powered by Actix Web.
NOTE: you might run into some missing dependencies errors, just do this:
```bash
sudo apt update
sudo apt-get install libsoup2.4-dev
sudo apt install libwebkit2gtk-4.0-dev
```

## 🔧 Backend Design

- File selected via UI is stored using a `Mutex<Option<PathBuf>>`
- Each shared file is assigned a unique token, e.g. `http://<host_ip>:8080/download/<token>`
- `actix_files::NamedFile` serves the file directly
- QR code is generated based on the download URL

## 📱 Frontend UI

- Manual file path input (drag & drop support planned)
- Button to generate a QR code
- Download link preview
- Button to shut down the server gracefully

## 🔒 Security

- Only users on the same local network or hotspot can access the file
- URLs are unguessable due to randomized tokens
- No files are uploaded to any cloud or external server

## 🛠️ Roadmap

- Drag and drop support
- File upload queue
- Download tracking
- Auto-shutdown timer
- Password protection for shared links

```
Made with ❤️ by wavesharers
```
