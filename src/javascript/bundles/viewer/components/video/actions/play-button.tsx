import * as React from 'react';
import {IoIosPlay, IoIosPause} from 'react-icons/io';
import "../../../styles/actions/play-button.scss";

export interface PlayButtonProps {
  onClick: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  playing: boolean;
}

export const PlayButton: React.FunctionComponent<PlayButtonProps> = ({ onClick, playing }): JSX.Element => (
  <button className="play-button" onClick={onClick}>
    {playing ? <IoIosPause /> : <IoIosPlay />}
  </button>
);