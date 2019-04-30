import * as React from 'react';
import {EpisodeFSItem} from "../../../directory/components/episode-section";
import "../../styles/video-player.scss";
import "../../utils/subtitle-extractor";
import {SubtitleExtractor} from "../../utils/subtitle-extractor";
import {Subtitles} from "./subtitles";
import {observer} from "mobx-react";
import {observable} from "mobx";

export interface VideoPlayerProps extends EpisodeFSItem {
  children?: any;
}

@observer
export class VideoPlayer extends React.Component<VideoPlayerProps> {
  @observable private subsPath: null|string = null;
  @observable videoRef = React.createRef<HTMLVideoElement>();

  private async extractSubtitles(): Promise<void> {
    const subtitleExtractor = new SubtitleExtractor(this.props.filePath);
    const subs = await subtitleExtractor.getSubtitleStreams();
    this.subsPath = await subtitleExtractor.extract(subs[0]);
  }

  componentDidMount(): void {
    this.extractSubtitles();
  }

  render() {
    return (
      <section className="video-player">
        <video className="video-element" ref={this.videoRef} src={this.props.filePath} controls={true} />
        {this.subsPath && <Subtitles videoRef={this.videoRef} subtitleFilePath={this.subsPath} />}
        {this.props.children}
      </section>
    );
  }
}