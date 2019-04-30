import * as React from 'react';
import {EpisodeFSItem} from "./episode-section";
import {IoIosPlay} from 'react-icons/io';
import "../styles/episode-card.scss";

export interface EpisodeCardProps extends EpisodeFSItem {
  onClick?: (episode: EpisodeFSItem) => void;
}

export class EpisodeCard extends React.Component<EpisodeCardProps> {
  render() {
    return (
      <section className="episode-card">
        <div className="thumbnail" onClick={() => this.props.onClick && this.props.onClick({
          parsedAnimeTitle: this.props.parsedAnimeTitle,
          filePath: this.props.filePath
        })}>
          <button className="play-button" onClick={() => {}}>
            <IoIosPlay />
          </button>
        </div>
        <section className="details">
          <section className="episode-number">Episode {this.props.parsedAnimeTitle.episode_number}</section>
        </section>
      </section>
    )
  }
}