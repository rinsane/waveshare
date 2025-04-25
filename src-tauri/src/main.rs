#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod file_server;

use get_if_addrs::{get_if_addrs, IfAddr};
use tauri::command;

#[command]
fn get_device_ip() -> String {
    match get_if_addrs() {
        Ok(ifaces) => {
            for iface in ifaces {
                if let IfAddr::V4(ipv4) = iface.addr {
                    let ip = ipv4.ip;
                    if ip.is_private() && !ip.is_loopback() && !ip.is_link_local() {
                        return ip.to_string();
                    }
                }
            }
            "No suitable IP found".to_string()
        }
        Err(_) => "Unable to retrieve IP".to_string(),
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|_| {
            // Start the file server in a new thread
            std::thread::spawn(|| {
                actix_web::rt::System::new()
                    .block_on(file_server::start_file_server())
                    .unwrap();
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            file_server::set_file_to_share,
            get_device_ip
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
