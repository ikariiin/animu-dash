import {FfFamilyExec} from "./ff-family-exec";
import "./ff-family-exec";
import {paths} from "../../common/utils/paths";

const {existsSync} = require('fs');
const {createHash} = require('crypto');

export interface IStream {
  index: number;
  codec_name: string;
  codec_long_name: string;
  codec_type: string;
  start_pts: number;
  start_time: number;
  duration: string;
  tags: {
    language: string;
    BPS: string;
    [key: string]: string;
  },
  [key: string]: any;
}

export class SubtitleExtractor {
  private readonly filename: string;

  public constructor(filename: string) {
    this.filename = filename;
  }

  private generateOutPath() {
    return `${paths.tempStore}/${createHash('md5').update(this.filename).digest("hex")}`;
  }

  public async getStreams(): Promise<IStream[]> {
    const ffExec = new FfFamilyExec(`-v quiet -print_format json -show_format -show_streams -i "${this.filename}"`);
    return JSON.parse(await ffExec.ffprobe())['streams'];
  }

  public async getSubtitleStreams(): Promise<IStream[]> {
    const streams = await this.getStreams();
    return streams.filter(stream => stream.codec_type === "subtitle");
  }

  public async extract(stream: IStream): Promise<string> {
    const outPath = this.generateOutPath() + `.${stream.codec_name}`;
    if(existsSync(outPath)) return outPath;

    const ffExec = new FfFamilyExec(`-i "${this.filename}" -map 0:${stream.index} -c copy "${outPath}"`);
    await ffExec.ffmpeg(15000);

    return outPath;
  }
}