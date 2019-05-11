import * as React from 'react';
import {EpisodeFSItem} from "../../directory/components/episode-section";
import {observer} from "mobx-react";
import "../styles/next-video-hint.scss";
import {FetchedAnimeDetails} from "../../directory/components/directory-page";
import {observable} from "mobx";
import {Thumbnail} from "./video/thumbnail";

export interface NextVideoHintProps extends EpisodeFSItem {
  details: null|FetchedAnimeDetails;
}

@observer
export class NextVideoHint extends React.Component<NextVideoHintProps> {
  @observable

  private async initThumbnail() {

  }

  componentDidMount(): void {
    this.initThumbnail();
  }

  render() {
    if(!this.props.details) return null;

    return (
      <section className="next-video-hint">
        <Thumbnail file={this.props.filePath} className="video-thumbnail" />
        <section className="next-video-details">
          <div className="heading">Next Episode Up--</div>
          <div className="name">{this.props.details.title.romaji}</div>
          <div className="episode">Episode {this.props.parsedAnimeTitle.episode_number}</div>
        </section>
      </section>
    )
  }
}