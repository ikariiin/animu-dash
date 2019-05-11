import { BrowserWindow, app } from 'electron';

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1580,
    height: 850,
    frame: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  });
  window.loadURL("http://localhost:8080");

  return window;
}

app.on('ready', createWindow);