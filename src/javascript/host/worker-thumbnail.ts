import {existsSync, promises} from "fs";
import {createHash} from "crypto";
import {execSync} from "child_process";
import {BatchGenerateThumbnails} from "./batch-generate-thumbnails";

async function traverseFolderAndGenerate() {
  const folder: string = process.argv[1];
  console.log(`Worker, folder: ${folder}`);
  const files = (await promises.readdir(folder)).map(node => `${folder}/${node}`);
  const videos = files.filter(file => BatchGenerateThumbnails.VIDEO_FILES.includes(file.split('.').pop()!));
  videos.forEach(video => {
    try {
      const filename = createHash("md5").update(`${video}-thumbnail`).digest("hex") + '.jpg';
      if(existsSync(`${__dirname}/../../store/${filename}.jpg`)) return;
      console.log(video, filename);
      execSync(
        `ffmpeg -i "${video}" -vf "thumbnail" -vframes 1 ${`${__dirname}/../../store/${filename}.jpg`}`
      );
    } catch (e) {
      console.error(e);
    }
  });
}

traverseFolderAndGenerate();