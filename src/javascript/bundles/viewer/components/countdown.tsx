import * as React from 'react';
import "../styles/countdown.scss";
import {observer} from "mobx-react";
import {observable} from "mobx";
import Timeout = NodeJS.Timeout;

export interface CountdownProps {
  duration: number;
  pretext?: string;
  onComplete?: () => void;
}

@observer
export class Countdown extends React.Component<CountdownProps> {
  @observable private timeLeft: number = 0;
  private intervalId: null|Timeout = null;

  private countDown(): void {
    this.intervalId = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      }
      if(this.timeLeft === 0) {
        this.props.onComplete && this.props.onComplete();
        clearInterval(this.intervalId!);
      }
    }, 1000);
  }

  componentDidMount(): void {
    this.timeLeft = this.props.duration;
    this.countDown();
  }

  public render() {
    return (
      <section className="countdown">
        {this.props.pretext} {this.timeLeft} seconds
      </section>
    )
  }
}