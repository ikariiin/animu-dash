import * as React from 'react';
import {anilistQuery} from "../../../common/utils/anilist-query";
import {observable} from "mobx";
import "../../styles/inactive-overlay.scss";
import {stripHTML} from "../../../directory/components/directory-page";
import {Character as CharacterC} from '../character';
import {StatusContainer} from "../status-container";
import {EpisodeDetails} from "../../../directory/components/episode-card";

export interface InactiveOverlayProps {
  episodeDetails: EpisodeDetails|null;
}

export interface Character {
  role: string;
  id: number;
  voiceActors: Array<{
    name: { first: string; last: string; native: string; }
    language: string;
  }>;
  node: {
    name: {
      first: string;
      native: string;
      last: string;
    },
    description: string;
    image: {
      large: string;
    }
  }
}

export interface InactiveOverlayData {
  id: number;
  title: {
    romaji: string;
  };
  coverImage: {
    large: string;
  };
  description: string;
  episodes: number;
  startDate: {
    year: number;
    month: number;
    day: number;
  }
  status: "RELEASING"|"FINISHED"|"NOT_YET_RELEASED"|"CANCELLED";
  characters: {
    edges: Array<Character>
  };
}

export class InactiveOverlay extends React.Component<InactiveOverlayProps> {
  @observable private animeData: InactiveOverlayData|null = null;
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
        episodes,
        startDate {
          year, month, day
        },
        status,
        characters {
          edges {
            id,
            role,
            voiceActors {
              name { first, last, native },
              language
            }
            node {
              name { first, last, native },
              image {
                large
              },
              description
            }
          }
        }
      }
    }
  `;

  private async fetchAnimeData(): Promise<void> {
    if(!this.props.episodeDetails || !this.props.episodeDetails.animeDetails) return;
    const response = await anilistQuery(InactiveOverlay.query, {id: `${this.props.episodeDetails.animeDetails.id}`});
    this.animeData = response.data.Media;
  }

  componentDidMount(): void {
    this.fetchAnimeData();
  }

  render() {
    if(!this.animeData || !this.props.episodeDetails) return null;
    return (
      <div className="inactive-overlay">
        <div className="overlay-content">
          <div className="cover-container">
            <img alt={`${this.props.episodeDetails.parsedAnimeTitle.anime_title} cover`} className="cover" src={this.animeData.coverImage.large} />
          </div>
          <div className="text">
            <div className="title">{this.animeData.title.romaji}</div>
            <div className="ep-details">Episode {this.props.episodeDetails.parsedAnimeTitle.episode_number}</div>
            <section className="description">
              {stripHTML(this.animeData.description)}
            </section>

            <StatusContainer id={this.animeData.id} />
          </div>
          <section className="characters">
            <div className="title">Characters</div>
            {this.animeData.characters.edges.slice(0, 6).map(character => (
              <CharacterC {...character} key={character.id} />
            ))}
          </section>
        </div>
      </div>
    )
  }
}