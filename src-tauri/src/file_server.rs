use actix_files::NamedFile;
use actix_web::{web, App, HttpServer, Result};
use once_cell::sync::Lazy;
use std::{
    collections::HashMap,
    path::PathBuf,
    sync::{Arc, Mutex},
};
use tauri::command;
use uuid::Uuid;

type FileMap = Arc<Mutex<HashMap<String, PathBuf>>>;

static FILE_MAP: Lazy<FileMap> = Lazy::new(|| Arc::new(Mutex::new(HashMap::new())));

#[command]
pub fn set_file_to_share(path: String) -> Result<String, String> {
    let token = Uuid::new_v4().to_string();
    let mut map = FILE_MAP.lock().map_err(|e| e.to_string())?;
    map.insert(token.clone(), PathBuf::from(path));
    Ok(token)
}

pub async fn download_file(path: web::Path<String>) -> Result<NamedFile> {
    let token = path.into_inner(); // Extract the token from the web::Path
    let map = FILE_MAP.lock().unwrap();
    if let Some(path) = map.get(&token) {
        NamedFile::open(path).map_err(|_| actix_web::error::ErrorNotFound("File not found"))
    } else {
        Err(actix_web::error::ErrorNotFound("Invalid token"))
    }
}

pub async fn start_file_server() -> std::io::Result<()> {
    HttpServer::new(|| App::new().route("/download/{token}", web::get().to(download_file)))
        .bind("0.0.0.0:8080")?
        .run()
        .await
}
