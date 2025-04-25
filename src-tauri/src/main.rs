#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod file_server;

use local_ip_address::local_ip;
use tauri::command;

#[command]
fn get_device_ip() -> String {
    match local_ip() {
        Ok(ip) => ip.to_string(),
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
