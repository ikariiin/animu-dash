import {FfFamilyExec} from "./ff-family-exec";
import {paths} from "../../common/utils/paths";
import {createHash} from "crypto";
import {existsSync} from "fs";
import {promises as fs} from "fs";

export class ThumbnailGenerator {
  constructor(private filename: string) {}

  private generateOutputFilename(): string {
    console.log(this.filename);
    return `${paths.store}/${createHash("md5").update(`${this.filename}-thumbnail`).digest("hex")}.jpg`;
  }

  private static async fetchFileImageContents(path: string): Promise<Buffer> {
    return fs.readFile(path);
  }

  public async generate(timeout: number = 10000): Promise<string> {
    const outPath = this.generateOutputFilename();
    if(existsSync(outPath)) return `file://${outPath}`;

    const ffExec = new FfFamilyExec(`-i "${this.filename}" -vf "thumbnail" -vframes 1 "${outPath}"`);
    await ffExec.ffmpeg(timeout);

    return `file://${outPath}`;
  }
}