const {join} = require('path');
const { remote } = require('electron');
import { platform } from "os";

const currentPlatform = platform();

export const paths = {
  config: {
    setup: join(remote.app.getAppPath(), "/config/setup.json"),
  },
  ffmpeg: currentPlatform === "win32" ? join(remote.app.getAppPath(),  "/resources/bundled/ffmpeg.exe") : "ffmpeg",
  ffprobe: currentPlatform === "win32" ? join(remote.app.getAppPath(), "/resources/bundled/ffprobe.exe") : "ffprobe",
  tempStore: join(remote.app.getAppPath(), "/temp-store"),
  store: join(remote.app.getAppPath(), "/store")
};