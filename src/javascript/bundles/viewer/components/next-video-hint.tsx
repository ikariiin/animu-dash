import * as React from 'react';
import {EpisodeFSItem} from "../../directory/components/episode-section";
import {observer} from "mobx-react";
import "../styles/next-video-hint.scss";
import {FetchedAnimeDetails} from "../../directory/components/directory-page";
import {observable} from "mobx";
import {Thumbnail} from "./video/thumbnail";
import {anilistQuery} from "../../common/utils/anilist-query";
import {monthToMonthStrMap} from "../utils/month-to-month-str-map";
import {PlayButton} from "../../common/components/play-button";
import {EpisodeDetails} from "../../directory/components/episode-card";
import {PageProps} from "../../common/components/page";
import {Routes} from "../../common/routing/routing";
import {Countdown} from "./countdown";

export interface NextVideoHintProps extends EpisodeFSItem, PageProps {
  details: null|FetchedAnimeDetails;
  pageParams: EpisodeDetails;
  timeBeforeSkip: number;
}

export interface NextEpisodeDetails {
  id: number;
  hashtag: string;
  startDate: { year: number, month: number, day: number };
}

@observer
export class NextVideoHint extends React.Component<NextVideoHintProps> {
  @observable nextEpisodeDetails: NextEpisodeDetails|null = null;

  static query = `
    query($id: Int) {
      Media(id: $id) {
        id,
        hashtag,
        startDate {
          year, month, day
        }
      }
    }
  `;

  private async fetchNextEpisodeDetails() {
    const nextEpDetails = await anilistQuery(NextVideoHint.query, {id: '' + this.props.details!.id});
    this.nextEpisodeDetails = nextEpDetails.data.Media;
  }

  componentDidMount(): void {
    this.fetchNextEpisodeDetails();
  }

  render() {
    if(!this.props.details) return null;

    return (
      <section className="next-video-hint">
        <section className="next-video-details">
          <div className="heading">Next Episode Up</div>
          <div className="name">{this.props.details.title.romaji}</div>
          <div className="episode">Episode {this.props.parsedAnimeTitle.episode_number}</div>
          {this.nextEpisodeDetails && (
            <div className="misc-details">
              {this.nextEpisodeDetails.hashtag} &middot; {monthToMonthStrMap(this.nextEpisodeDetails.startDate.month)} {this.nextEpisodeDetails.startDate.day} {this.nextEpisodeDetails.startDate.year}
            </div>
          )}
          <Countdown pretext="Switching to next episode in, " duration={this.props.timeBeforeSkip} onComplete={() => this.props.route(Routes.VIEWER, this.props.pageParams)} />
        </section>
        <Thumbnail file={this.props.filePath} className="video-thumbnail" onClick={() => this.props.route(Routes.VIEWER, this.props.pageParams)}>
          <PlayButton />
        </Thumbnail>
      </section>
    );
  }
}