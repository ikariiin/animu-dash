import * as React from 'react';
import "../../styles/video-controls.scss";
import {FetchedAnimeDetails, ParsedAnimeTitle} from "../../../directory/components/directory-page";
import {ControlAnimeDetails} from "./control-anime-details";
import {PlayButton} from "./actions/play-button";
import {Progress} from "./progress";
import {observer} from "mobx-react";
import {observable} from "mobx";

export interface VideoControlsProps {
  videoRef?: React.RefObject<HTMLVideoElement>;
  animeDetails: FetchedAnimeDetails|null;
  episodeDetails: ParsedAnimeTitle
  hoverState: boolean;
}

@observer
export class VideoControls extends React.Component<VideoControlsProps> {
  @observable playing: boolean = true;

  private attachBindingForVideo(): void {
    if(!this.props.videoRef || !this.props.videoRef.current) return;

    this.props.videoRef.current.addEventListener('pause', () => this.playing = false);
    this.props.videoRef.current.addEventListener('play', () => this.playing = true);
  }

  private togglePlayState(): void {
    if(!this.props.videoRef || !this.props.videoRef.current) return;

    this.playing ? this.props.videoRef.current.pause() : this.props.videoRef.current.play();
  }

  componentDidMount(): void {
    this.attachBindingForVideo();
  }

  componentDidUpdate(prevProps: Readonly<VideoControlsProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if(prevProps.videoRef !== this.props.videoRef) {
      this.attachBindingForVideo();
    }
  }

  render() {
    return (
      <section className={`video-controls ${this.props.hoverState ? 'visible' : 'hidden'}`}>
        <ControlAnimeDetails episodeDetails={this.props.episodeDetails} animeDetails={this.props.animeDetails} />
        <div className="controls-content">
          <section className="actions">
            <PlayButton onClick={() => this.togglePlayState()} playing={this.playing} />
          </section>
          <Progress videoRef={this.props.videoRef} />
        </div>
      </section>
    );
  }
}