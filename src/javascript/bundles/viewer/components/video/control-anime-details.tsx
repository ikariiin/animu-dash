import * as React from 'react';
import {FetchedAnimeDetails, ParsedAnimeTitle} from "../../../directory/components/directory-page";
import {anilistQuery} from "../../../common/utils/anilist-query";
import {computed, observable} from "mobx";
import "../../styles/control-anime-details.scss";
import {observer} from "mobx-react";
import {trimIfRequired} from "../../../home/components/cards/media-focus-card";

export interface ControlAnimeDetailsProps {
  animeDetails: FetchedAnimeDetails|null;
  episodeDetails: ParsedAnimeTitle;
}

export interface ControlAnimeDetail {
  id: number;
  title: {
    romaji: string;
  };
  coverImage: {
    large: string;
  };
  description: string;
}

@observer
export class ControlAnimeDetails extends React.Component<ControlAnimeDetailsProps> {
  @observable animeDetails: ControlAnimeDetail|null = null;

  static query = `
    query($id: Int) {
      Media(id: $id) {
        id,
        title {
          romaji
        },
        coverImage {
          large
        },
        description(asHtml: false)
      }
    }
  `;

  private async fetchDetails(): Promise<void> {
    if(!this.props.animeDetails) return;

    const response = await anilistQuery(ControlAnimeDetails.query, {id: `${this.props.animeDetails.id}`});
    this.animeDetails = response.data.Media;
  }

  componentDidMount(): void {
    this.fetchDetails();
  }

  @computed get renderIfLoaded() {
    if(!this.animeDetails) return null;

    return (
      <React.Fragment>
        <div className="cover" style={{ backgroundImage: `url(${this.animeDetails.coverImage.large})` }} />
        <section className="detail-section">
          <div className="section-title">Now Watching</div>
          <div className="name">{trimIfRequired(this.animeDetails.title.romaji, 25)}</div>
          <div className="episode">Ep. {this.props.episodeDetails.episode_number}</div>
        </section>
      </React.Fragment>
    )
  }

  render() {
    return (
      <section className="control-anime-details">
        {this.renderIfLoaded}
      </section>
    )
  }
}