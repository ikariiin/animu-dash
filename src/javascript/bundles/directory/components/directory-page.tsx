import * as React from 'react';
import {Routes} from "../../common/routing/routing";
import {Page} from "../../common/components/page";
import {IndexedDir} from "../../home/components/dashboard-specific-components/library-section";
import {Banner} from "../../common/components/banner";
import {computed, observable} from "mobx";
import {observer} from "mobx-react";
import {anilistQuery} from "../../common/utils/anilist-query";
import "../styles/directory-page.scss";
import {trimIfRequired} from "../../home/components/cards/media-focus-card";
import {EpisodeSection} from "./episode-section";
// @ts-ignore
const anitomy = window.require('anitomy-js');

export interface DirectoryPageProps {
  route: (route: Routes, vars?: any) => void;
  indexedDir: IndexedDir;
}

export interface ParsedAnimeTitle {
  anime_title: string;
  audio_term?: string;
  file_name: string;
  release_group?: string;
  release_version?: string;
  source?: string;
  video_term?: string;
  video_resolution?: string;
  volume_number?: string[];
  episode_number?: string;
}

export interface FetchedAnimeDetails {
  id: number;
  title: {
    romaji: string;
  };
  bannerImage: string;
  pageInfo: any;
  genres: string[];
  description: string;
}

export function stripHTML(infestedContent: string): string {
  const doc = new DOMParser().parseFromString(infestedContent, 'text/html');
  return doc.body.textContent || "";
}

@observer
export class DirectoryPage extends React.Component<DirectoryPageProps> {
  @observable parsedAnimeTitle: null|ParsedAnimeTitle = null;
  @observable animeDetails: FetchedAnimeDetails|null = null;

  static query = `
    query($query: String) {
      Page(perPage: 1) {
        media(search: $query, type: ANIME) {
          id,
          title {
            romaji
          },
          bannerImage,
          genres,
          description(asHtml: false)
        }
      }
    }
  `;

  private async parseAnimeDetails(): Promise<void> {
    this.parsedAnimeTitle = await anitomy.parse(this.props.indexedDir.name);
  }

  private async loadAnimeDetails(): Promise<void> {
    if(!this.parsedAnimeTitle) return;
    const response = await anilistQuery(DirectoryPage.query, {query: this.parsedAnimeTitle.anime_title});

    // @ts-ignore
    this.animeDetails = {...response.data.Page.media[0]}
  }

  componentDidMount(): void {
    this.parseAnimeDetails();
  }

  @computed get renderWhenParsedAndLoaded() {
    if(this.parsedAnimeTitle && this.animeDetails) return (
      <section className="banner-image-cover" style={{ backgroundImage: `url(${this.animeDetails.bannerImage})` }}>
        <section className="details">
          <section className="details-content">
            <div className="title">{this.animeDetails.title.romaji}</div>
            <section className="genres">
              {this.animeDetails.genres.join(', ')}
            </section>
            <p className="description">
              {trimIfRequired(stripHTML(this.animeDetails.description), 400)}
            </p>
          </section>
        </section>
      </section>
    );

    if(!this.animeDetails) {
      this.loadAnimeDetails();
      return "loading"
    }

    return "parsing";
  }

  render() {
    return (
      <Page {...this.props} active="Library">
        <Banner>
          {this.renderWhenParsedAndLoaded}
        </Banner>
        <EpisodeSection {...this.props} />
      </Page>
    )
  }
}