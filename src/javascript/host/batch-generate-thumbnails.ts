import {existsSync, promises} from 'fs';
import {SetupConfig} from "../types";
import {resolve} from 'path';
import {createHash} from "crypto";
import {execSync} from "child_process";

export class BatchGenerateThumbnails {
  static VIDEO_FILES = ["mkv", "mp4", "avi"];

  constructor(private setupPath: string = resolve(__dirname + "/../../config/setup.json")) {
  }

  private async traverseFolderAndGenerate(folder: string) {
    const files = (await promises.readdir(folder)).map(node => `${folder}/${node}`);
    const videos = files.filter(file => BatchGenerateThumbnails.VIDEO_FILES.includes(file.split('.').pop()!));
    videos.forEach(video => {
      try {
        const filename = createHash("md5").update(`${video}-thumbnail`).digest("hex") + '.jpg';
        if(existsSync(`${__dirname}/../../store/${filename}`)) return;
        console.log(video, filename);
        execSync(
          `ffmpeg -i "${video}" -vf "thumbnail" -vframes 1 ${`${__dirname}/../../store/${filename}`}`
        );
      } catch (e) {
      }
    });
  }

  public async synchronouslyGenerate(): Promise<void> {
    const setup: SetupConfig = JSON.parse((await promises.readFile(this.setupPath)).toString());
    const nodes = await promises.readdir(setup.libraryPath!);

    const folders = (await Promise.all(nodes.filter(async (node: string) => {
      const stat = await promises.lstat(`${setup.libraryPath!}/${node}`);
      return stat.isDirectory() && node[0] !== '.';
    }))).map((dir: string) => `${setup.libraryPath!}/${dir}`);

    folders.forEach(async (folder: string) => {
      this.traverseFolderAndGenerate(folder);
    });
  }
}