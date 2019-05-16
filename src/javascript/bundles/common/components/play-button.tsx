import * as React from 'react';
import {IoIosPlay} from "react-icons/io";
import "../styles/play-button.scss";

export interface PlayButtonProps {
  onClick?: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export class PlayButton extends React.Component<PlayButtonProps> {
  render() {
    return (
      <button className="t-play-button" onClick={this.props.onClick}>
        <IoIosPlay />
      </button>
    );
  }
}