import * as React from 'react';
import "../../styles/progress.scss";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {utc} from 'moment';

export interface ProgressProps {
  videoRef?: React.RefObject<HTMLVideoElement>;
}

@observer
export class Progress extends React.Component<ProgressProps> {
  @observable private currentTime: number = 0;
  @observable private duration: number = 1;

  private attachVideoBinding(): void {
    if(!this.props.videoRef || !this.props.videoRef.current) return;

    if(this.props.videoRef.current.readyState !== 4) {
      this.props.videoRef.current.oncanplay = (ev: Event) => this.attachVideoBinding();
      return;
    }

    const video = this.props.videoRef.current;
    video.addEventListener('timeupdate', (ev: Event) => this.currentTime = video.currentTime);
    this.duration = video.duration;
  }

  private seek(ev: React.ChangeEvent<HTMLInputElement>): void {
    const seekVal = +ev.target.value;
    this.currentTime = seekVal * this.duration;
    this.props.videoRef!.current!.currentTime = this.currentTime;
  }

  public componentDidMount(): void {
    this.attachVideoBinding();
  }

  public componentDidUpdate(prevProps: Readonly<ProgressProps>, prevState: Readonly<{}>, snapshot?: any): void {
    if(this.props.videoRef !== prevProps.videoRef) {
      this.attachVideoBinding();
    }
  }

  render() {
    if(!this.props.videoRef || !this.props.videoRef.current) return null;

    return (
      <section className="progress-container">
        <time className="duration-time">{utc(this.currentTime * 1000).format(this.duration > 3600 ? 'HH:mm:ss' : 'mm:ss')}</time>
        <input type="range" className="video-progress" min={0} max={1} value={this.currentTime / this.duration} step={0.00001} onChange={(ev) => this.seek(ev)} />
        <time className="duration-time">{utc(this.duration * 1000).format(this.duration > 3600 ? 'HH:mm:ss' : 'mm:ss')}</time>
      </section>
    )
  }
}