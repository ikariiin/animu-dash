import * as React from 'react';
import {IDialogue, ISubtitles, SubtitleParser} from "../../utils/subtitle-parser";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {convertStrFormattedTime} from "../../utils/convert-str-fomatted-time";
import {Subtitle} from "./subtitle";
const {readFile} = require('fs').promises;
import "../../styles/subtitles.scss";

export interface SubtitlesProps {
  subtitleFilePath: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  hoverState: boolean;
}

@observer
export class Subtitles extends React.Component<SubtitlesProps> {
  @observable private subtitles: ISubtitles|null = null;
  @observable visibleSubtitles: IDialogue[] = [];

  private async loadAndParseSubtitles(): Promise<void> {
    const fileContent = (await readFile(this.props.subtitleFilePath)).toString();
    const parser = new SubtitleParser(fileContent);
    parser.process();
    this.subtitles = parser.getResponse();
  }

  private bindSubtitles() {
    if(this.props.videoRef.current) {
      this.props.videoRef.current.addEventListener('timeupdate', (ev: Event) => {
        if(!this.props.videoRef.current) return;

        const video: HTMLVideoElement = this.props.videoRef.current;

        this.visibleSubtitles = this.visibleSubtitles.filter(selectedSubtitle => (
          video.currentTime.toFixed(2) < convertStrFormattedTime(selectedSubtitle.timings.end).toFixed(2)
          && video.currentTime.toFixed(2) > convertStrFormattedTime(selectedSubtitle.timings.start).toFixed(2)
        ));

        if(!this.subtitles) return;

        this.subtitles.dialogues.filter(subtitle => {
          if(
            convertStrFormattedTime(subtitle.timings.start) <= video.currentTime
            && convertStrFormattedTime(subtitle.timings.end) >= video.currentTime
          ) {
            if((video.currentTime - convertStrFormattedTime(subtitle.timings.start)) < 1) {
              // Check if already being displayed
              return !this.visibleSubtitles.some(currentSubtitle => (
                currentSubtitle.timings.start === subtitle.timings.start
                && subtitle.text === currentSubtitle.text
              ));
            }

            return false;
          }

          return false;
        }).forEach(subtitle => this.visibleSubtitles.push(subtitle));
      });
    }
  }

  async componentDidMount(): Promise<void> {
    await this.loadAndParseSubtitles();
    await this.bindSubtitles();
  }

  componentDidUpdate(prevProps: Readonly<SubtitlesProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if(prevProps.videoRef.current !== this.props.videoRef.current) {
      this.bindSubtitles();
    }
  }

  render() {
    return (
      <section className={`subtitle-container ${this.props.hoverState ? 'hang-up' : ''}`}>
        {this.visibleSubtitles.map((dialogue, idx) => <Subtitle hangUp={this.props.hoverState} key={idx} {...dialogue} scaling={this.subtitles!.scalingInfo} />)}
      </section>
    )
  }
}