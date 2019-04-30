import {paths} from "../../common/utils/paths";

const { exec } = require('child_process');

export class FfFamilyExec {
  private readonly opts: string;

  constructor(opts: string) {
    this.opts = opts;
  }

  public ffmpeg(timeout = 0): Promise<any> {
    const cmd = `"${paths.ffmpeg}" ${this.opts}`;
    return new Promise((resolve, reject) => {
      const process = exec(cmd, (err: string, stdout: string, stderr: string) => {
        if(err) reject(err);

        // if(stderr) {
        //   resolve(stderr);
        //   return;
        // }
        resolve(stdout);
      });

      if(timeout !== 0) {
        setTimeout(() => {
          process.stdin.setDefaultEncoding('utf8');
          process.stdin.writable && process.stdin.write('q');
          process.kill();
        }, timeout);
      }
    });
  }

  public async ffprobe(): Promise<any> {
    const cmd = `"${paths.ffprobe}" ${this.opts}`;

    return new Promise((resolve, reject) => {
      exec(cmd, (err: string, stdout: string, stderr: string) => {
        if(err) reject(err);
        if(stderr) reject(stderr);

        resolve(stdout);
      });
    });
  }
}