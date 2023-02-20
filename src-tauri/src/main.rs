#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{App, Wry, Manager};
use window_shadows::set_shadow;

/// Wraps Result instances into an output.
/// Any errors are passed to the frontend.
/// obj: The object to wrap.
pub fn wrap<O, E>(obj: Result<O, E>, code: &str) -> O {
    match obj {
        Ok(output) => output,
        Err(_) => {
            panic!("An error occurred in the backend. {}", code);
        }
    }
}

fn main() {
    // Check for an existing deep link instance.
    tauri_plugin_deep_link::prepare("laudiolin");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open, online
        ])
        .setup(|app| {
            // Initialize deep linking.
            register_deep_link(app);

            // Set the window shadow.
            let window = app.get_window("main").unwrap();
            wrap(set_shadow(&window, true), "shadow");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Opens the specified URL in the default browser.
/// url: The URL to open.
#[tauri::command]
fn open(url: String) {
    wrap(open::that(url), "open");
}

/// Check if the device is online.
#[tauri::command]
async fn online() -> bool {
    // Check if the app is offline.
    if std::env::var("TAURI_OFFLINE").is_ok() {
        return false;
    }

    return online::check(None).is_ok();
}

/// Registers the deep link handler.
fn register_deep_link(app: &mut App<Wry>) {
    let handle = app.handle();
    tauri_plugin_deep_link::register(
        "laudiolin", move |request| {
            wrap(handle.get_window("main").unwrap().set_focus(), "focus");
            handle.emit_all("deeplink", request).unwrap();
        },
    ).unwrap();
}
