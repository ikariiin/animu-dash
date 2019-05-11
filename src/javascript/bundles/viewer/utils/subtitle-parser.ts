const assParser = require('ass-parser');

export interface IAlignment {
  column: string;
  row: string;
}
export interface IBody {
  type?: string;
  key?: string;
  value: string;
}
export interface IParsedSection {
  section: string;
  body: Array<IBody>
}
export interface IDialogue {
  speaker: string;
  text: string;
  style: any;
  timings: {
    start: string;
    end: string;
  };
}
export interface ISubtitles {
  scalingInfo: {
    x: number;
    y: number;
  },
  dialogues: IDialogue[]
}

export class SubtitleParser {
  private readonly rawTextSubtitle: string;
  private subtitles: Array<IParsedSection> = [];
  private originalScale = {
    x: 1,
    y: 1
  };
  private computedDialogues: Array<IDialogue> = [];

  constructor(rawTextSubtitle: string) {
    this.rawTextSubtitle = rawTextSubtitle;
  }

  convert(): Array<IParsedSection> {
    return assParser(this.rawTextSubtitle);
  }

  /**
   * Alignment works as the position of keys on the numberpad. Like so:
   * ---      Left    Middle  Right
   * Top      7       8       9
   * Middle   4       5       6
   * Bottom   1       2       3
   */
  static getAlignment(n: number): IAlignment {
    switch(n) {
      case 1:
        return {
          column: 'left',
          row: 'bottom'
        };
      case 2:
        return {
          column: 'middle',
          row: 'bottom'
        };
      case 3:
        return {
          column: 'right',
          row: 'bottom'
        };
      case 4:
        return {
          column: 'left',
          row: 'middle'
        };
      case 5:
        return {
          column: 'middle',
          row: 'middle'
        };
      case 6:
        return {
          column: 'right',
          row: 'middle'
        };
      case 7:
        return {
          column: 'left',
          row: 'top'
        };
      case 8:
        return {
          column: 'middle',
          row: 'top'
        };
      case 9:
        return {
          column: 'right',
          row: 'top'
        };
      default:
        throw new Error("Could not calculate the position of the subtitles");
    }
  }

  static processVerticalMargin(alignmentStyle: string, marginV: number) {
    const align = SubtitleParser.getAlignment(parseInt(alignmentStyle, 10));
    if(align.row === 'top') {
      return {
        marginTop: +marginV
      };
    }
    if(align.row === 'bottom') {
      return {
        marginBottom: +marginV
      };
    }

    return {};
  }

  static colorHexChunk(str: string, size: number) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size);
    }

    return chunks;
  }

  static convertHexToDecimal(hex: string) {
    return parseInt(hex, 16);
  }

  convertSSAColorToRGBA(ssaColor: string) {
    const hexWithAlphaChannel = ssaColor.substr(2);
    const channels = SubtitleParser.colorHexChunk(hexWithAlphaChannel, 2).map(channel => SubtitleParser.convertHexToDecimal(channel));
    // The color is in the format:
    // 0: Alpha
    // 1: Blue
    // 2: Green
    // 3: Red

    // Weird, but the alpha channel is always 0, so we set to opaque at all times.

    return `rgba(${channels[3]}, ${channels[2]}, ${channels[1]}, 1)`;
  }

  computeStyles(styles: any) {
    const computedStyles: any = {};

    styles.forEach((style: any) => {
      const stylePairs = style['value'];
      computedStyles[stylePairs['Name']] = {
        fontSize: parseInt(stylePairs['Fontsize'], 10),
        color: this.convertSSAColorToRGBA(stylePairs['PrimaryColour']),
        outlineColor: this.convertSSAColorToRGBA(stylePairs['BackColour']),
        bold: parseInt(stylePairs['Bold'], 10) < 0,
        italic: parseInt(stylePairs['Italic'], 10) < 0,
        margins: {
          ...SubtitleParser.processVerticalMargin(stylePairs['Alignment'], stylePairs['MarginV']),
          marginLeft: +`${stylePairs['MarginL']}`,
          marginRight: +`${stylePairs['MarginR']}`
        },
        alignment: SubtitleParser.getAlignment(parseInt(stylePairs['Alignment'], 10))
      }
    });

    return computedStyles;
  }

  static filterSubtitleText(text: string) {
    // For new we remove all the parts that are enclosed within `{}`
    return text.replace(/\s*\{.*?\}\s*/g, '');
  }

  static normalizeText(text: string) {
    // Bunch of replaces
    return text.replace(/\\N/g, "\n");
  }

  computeDialogues(events: any, styles: any): IDialogue[] {
    return events.map((dialogue: any) => {
      const dialogueValue = dialogue['value'];
      return {
        speaker: dialogueValue["Name"],
        style: styles[dialogueValue["Style"]],
        text: SubtitleParser.normalizeText(SubtitleParser.filterSubtitleText(dialogueValue["Text"])),
        timings: {
          start: dialogueValue["Start"],
          end: dialogueValue["End"]
        }
      };
    });
  }

  process() {
    this.subtitles = this.convert();
    const scriptInfo = this.subtitles.filter(section => section.section === "Script Info")[0];
    const styles = this.subtitles.filter(section => section.section === "V4+ Styles")[0];
    const events = this.subtitles.filter(section => section.section === "Events")[0];

    const computedStyles = this.computeStyles(styles.body.filter((v, k) => k !== 0));
    this.computedDialogues = this.computeDialogues(events.body.filter((v, k) => k !== 0), computedStyles);
    this.originalScale = {
      y: +scriptInfo.body.filter((info: IBody) => info.key === "PlayResY")[0]['value'],
      x: +scriptInfo.body.filter(info => info.key === "PlayResX")[0]['value']
    };
  }

  getResponse(): ISubtitles {
    return {
      scalingInfo: this.originalScale,
      dialogues: this.computedDialogues
    };
  }
}