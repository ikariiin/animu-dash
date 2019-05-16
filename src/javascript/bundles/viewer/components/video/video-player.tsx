import * as React from 'react';
import "../../styles/video-player.scss";
import "../../utils/subtitle-extractor";
import {SubtitleExtractor} from "../../utils/subtitle-extractor";
import {Subtitles} from "./subtitles";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {InactiveOverlay} from "./inactive-overlay";
import {AnilistManager} from "../../../anilist/anilist-manager";
import {EpisodeDetails} from "../../../directory/components/episode-card";
import {EpisodeFSItem} from "../../../directory/components/episode-section";
import {NextVideoHint} from "../next-video-hint";
import {PageProps} from "../../../common/components/page";
import {Routes} from "../../../common/routing/routing";
import Timeout = NodeJS.Timeout;

export interface VideoPlayerProps extends EpisodeDetails, PageProps {
  children?: any;
}

@observer
export class VideoPlayer extends React.Component<VideoPlayerProps> {
  @observable private subsPath: null|string = null;
  @observable private videoRef = React.createRef<HTMLVideoElement>();
  @observable private hoverState: boolean = false;
  @observable private showOverlay: boolean = false;
  @observable private markedAsWatched: boolean = false;
  @observable private showNextVideoHint: null|EpisodeFSItem = null;
  private anilistManager: null|AnilistManager = null;
  private hoverStateTimeout: Timeout|null = null;
  private showOverlayTimeout: Timeout|null = null;

  static OVERLAY_DISPLAY_TIMEOUT: number = 4000;
  static HOVER_STATE_TIMEOUT: number = 2000;

  private async extractSubtitles(): Promise<void> {
    const subtitleExtractor = new SubtitleExtractor(this.props.filePath);
    const subs = await subtitleExtractor.getSubtitleStreams();
    this.subsPath = await subtitleExtractor.extract(subs[0]);
  }

  private disableHoverState(): void {
    this.hoverState = false;
    clearTimeout(this.hoverStateTimeout!);
  }

  private enableHoverState(): void {
    clearTimeout(this.hoverStateTimeout!);
    this.hoverState = true;
    this.hoverStateTimeout = setTimeout(() => this.disableHoverState(), VideoPlayer.HOVER_STATE_TIMEOUT);
  }

  private attachVideoBinding(): void {
    if(!this.videoRef.current) return;

    this.videoRef.current.addEventListener('pause', () => {
      clearTimeout(this.showOverlayTimeout!);
      this.showOverlayTimeout = setTimeout(() => this.showOverlay = true, VideoPlayer.OVERLAY_DISPLAY_TIMEOUT);
    });
    this.videoRef.current.addEventListener('play', () => {
      this.showOverlay = false;
      clearTimeout(this.showOverlayTimeout!);
    })
  }

  private displayHintForNextEpisode(): void {
    const currentEpisode = this.props.episodesList.filter(episode => episode.parsedAnimeTitle.episode_number === this.props.parsedAnimeTitle.episode_number)[0];
    const currentIndex = this.props.episodesList.indexOf(currentEpisode);
    this.showNextVideoHint = this.props.episodesList[currentIndex + 1];
  }

  private skipToNextEpisode(): void {
    if(!this.showNextVideoHint) return;

    this.props.route(Routes.VIEWER, {
      parsedAnimeTitle: this.showNextVideoHint.parsedAnimeTitle,
      filePath: this.showNextVideoHint.filePath,
      animeDetails: this.props.animeDetails,
      episodesList: this.props.episodesList
    });
  }

  private async addBindingsForAnilist() {
    this.anilistManager = new AnilistManager(this.props);
    await this.anilistManager.markAsWatching();

    if(!this.videoRef.current) return;
    this.videoRef.current.addEventListener('timeupdate', () => {
      if(!this.videoRef.current) return;

      if((this.videoRef.current.duration - this.videoRef.current.currentTime) <= 120) {
        if(this.markedAsWatched || !this.anilistManager) return;
        this.anilistManager.editProgress(+this.props.parsedAnimeTitle.episode_number!);
        this.markedAsWatched = true;
        this.displayHintForNextEpisode();
      }
    });
  }

  private refreshPlayer(): void {
    this.subsPath = null;
    this.videoRef = React.createRef<HTMLVideoElement>();
    this.hoverState = false;
    this.showOverlay = false;
    this.markedAsWatched = false;
    this.showNextVideoHint = null;
    this.anilistManager = null;
    this.hoverStateTimeout = null;
    this.showOverlayTimeout = null;

    this.addBindingsForAnilist();
    this.extractSubtitles();
    this.attachVideoBinding();
  }

  componentDidUpdate(prevProps: Readonly<VideoPlayerProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if(this.props.filePath !== prevProps.filePath) {
      this.refreshPlayer();
    }
  }

  componentDidMount(): void {
    this.addBindingsForAnilist();
    this.extractSubtitles();
    this.attachVideoBinding();
  }

  private toggleVideoState(): void {
    this.videoRef.current!.paused ? this.videoRef.current!.play() : this.videoRef.current!.pause();
  }

  render() {
    return (
      <section className="video-player"
        onPointerMove={(ev) => this.enableHoverState()}
        onPointerLeave={(ev) => this.disableHoverState()}>
        <video
          className="video-element"
          ref={this.videoRef}
          style={{ opacity: this.showNextVideoHint ? .6 : 1 }}
          autoPlay
          onClick={() => this.toggleVideoState()}
          src={`file://${this.props.filePath}`}
          controls={false} />
        {this.showOverlay && !this.showNextVideoHint && <InactiveOverlay episodeDetails={this.props} />}
        {this.showNextVideoHint && <NextVideoHint {...this.showNextVideoHint} details={this.props.animeDetails} pageParams={{
          parsedAnimeTitle: this.showNextVideoHint.parsedAnimeTitle,
          filePath: this.showNextVideoHint.filePath,
          animeDetails: this.props.animeDetails,
          episodesList: this.props.episodesList
        }} route={this.props.route} timeBeforeSkip={Math.floor(this.videoRef.current!.duration - this.videoRef.current!.currentTime)} />}
        {this.subsPath && <Subtitles videoRef={this.videoRef} hoverState={this.hoverState} subtitleFilePath={this.subsPath} />}
        {React.cloneElement(this.props.children, {videoRef: this.videoRef, hoverState: this.hoverState})}
      </section>
    );
  }
}