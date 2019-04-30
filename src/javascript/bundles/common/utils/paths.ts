const {join} = require('path');
const { remote } = require('electron');

export const paths = {
  config: {
    setup: join(remote.app.getAppPath(), "/config/setup.json"),
  },
  ffmpeg: join(remote.app.getAppPath(), "/resources/bundled/ffmpeg.exe"),
  ffprobe: join(remote.app.getAppPath(), "/resources/bundled/ffprobe.exe"),
  tempStore: join(remote.app.getAppPath(), "/temp-store")
};