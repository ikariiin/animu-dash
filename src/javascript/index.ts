import { BrowserWindow, app } from 'electron';
import {fork} from 'child_process';

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

function generator() {
  const generator = fork(__dirname + "/host/generator.js");
}

app.on('ready', () => {
  createWindow();
});

generator();