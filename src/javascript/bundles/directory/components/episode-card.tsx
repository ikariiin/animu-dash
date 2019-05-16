import * as React from 'react';
import {EpisodeFSItem} from "./episode-section";
import "../styles/episode-card.scss";
import {FetchedAnimeDetails} from "./directory-page";
import {PlayButton} from "../../common/components/play-button";
import {Thumbnail} from "../../viewer/components/video/thumbnail";

export interface EpisodeDetails extends EpisodeFSItem {
  animeDetails: FetchedAnimeDetails|null;
  episodesList: EpisodeFSItem[]
}

export interface EpisodeCardProps extends EpisodeFSItem {
  onClick?: (episode: EpisodeDetails) => void;
  animeDetails: FetchedAnimeDetails|null;
  episodesList: EpisodeFSItem[]
}

export class EpisodeCard extends React.Component<EpisodeCardProps> {
  render() {
    return (
      <section className="episode-card">
        <Thumbnail file={this.props.filePath} className="thumbnail" onClick={() => this.props.onClick && this.props.onClick({
          parsedAnimeTitle: this.props.parsedAnimeTitle,
          filePath: this.props.filePath,
          animeDetails: this.props.animeDetails,
          episodesList: this.props.episodesList
        })}>
          <PlayButton />
        </Thumbnail>
        <section className="details">
          <section className="episode-number">Episode {this.props.parsedAnimeTitle.episode_number}</section>
        </section>
      </section>
    )
  }
}