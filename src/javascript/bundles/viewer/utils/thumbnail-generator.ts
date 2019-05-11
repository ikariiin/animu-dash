import {FfFamilyExec} from "./ff-family-exec";
import {paths} from "../../common/utils/paths";
import {createHash} from "crypto";
import {existsSync} from "fs";
import {promises as fs} from "fs";

export class ThumbnailGenerator {
  constructor(private filename: string) {}

  private generateOutputFilename(): string {
    return `${paths.tempStore}/${createHash("md5").update(`${this.filename}-thumbnail`).digest("hex")}.jpg`;
  }

  private static async fetchFileImageContents(path: string): Promise<Buffer> {
    return fs.readFile(path);
  }

  public async generate(): Promise<string> {
    const outPath = this.generateOutputFilename();
    if(existsSync(outPath)) return `file://${encodeURIComponent(outPath)}`;

    const ffExec = new FfFamilyExec(`-ss -i ${this.filename} -vf select="eq(pict_type\\,I)" -vframes 1 ${outPath}`);
    await ffExec.ffmpeg(1000);

    return `file://${encodeURIComponent(outPath)}`;
  }
}