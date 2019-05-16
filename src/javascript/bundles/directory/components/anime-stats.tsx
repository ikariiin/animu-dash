import * as React from 'react';
import {computed, observable} from "mobx";
import {observer} from "mobx-react";
import {FetchedAnimeDetails} from "./directory-page";
import {Banner} from "../../common/components/banner";
import {anilistQuery} from "../../common/utils/anilist-query";
import "../styles/anime-stats.scss";
import {monthToMonthStrMap} from "../../viewer/utils/month-to-month-str-map";
import {shell} from 'electron';

export interface AnimeStatsProps extends FetchedAnimeDetails {
}

export interface AnimeStatsData {
  episodes: number;
  duration: number;
  status: "RELEASING"|"FINISHED"|"NOT_YET_RELEASED"|"CANCELLED";
  startDate: {
    day: number;
    month: number;
    year: number;
  },
  format: "";
  averageScore: number;
  meanScore: number;
  hashtag: string;
}

@observer
export class AnimeStats extends React.Component<AnimeStatsProps> {
  @observable stats: null|AnimeStatsData =  null;

  static query = `
    query($id: Int) {
      Media(id: $id) {
        episodes,
        duration,
        status,
        startDate { day, month, year },
        format,
        hashtag,
        averageScore,
        meanScore,
        nextAiringEpisode { airingAt },
        mediaListEntry {
          score
        }
      }
    }
  `;

  private async fetchAnimeStats(): Promise<void> {
    const response = await anilistQuery(AnimeStats.query, {id: '' + this.props.id});
    this.stats = response.data.Media;
    console.log(response.data.Media);
  }

  private getStatusInfo(): string {
    if(!this.stats) return '';

    let info = 'The show ';
    switch (this.stats.status) {
      case "CANCELLED":
      case "FINISHED":
      case "NOT_YET_RELEASED":
        info += 'has ';
        break;
      case "RELEASING":
      default:
        info += 'is ';
        break;
    }

    if(this.stats.status === "CANCELLED") { info += 'been cancelled.' }
    if(this.stats.status === "FINISHED") { info += 'finished airing.' }
    if(this.stats.status === "NOT_YET_RELEASED") { info += 'been not released yet.' }
    if(this.stats.status === "RELEASING") { info += 'being aired.' }

    return info;
  }

  public componentDidMount(): void {
    this.fetchAnimeStats();
  }

  @computed get renderedStats(): JSX.Element|null {
    if(!this.stats) return null;

    return (
      <Banner className="anime-stats-banner">
        <section className="anime-stats">
          <div className="title">Stats for this particular anime</div>
          <section className="col-layout">
            <div className="column">
              <div className="col-title">Anime Details</div>

              <section className="info-point">
                The show has <span className="important">{this.stats.episodes}</span> episodes, each
                being about <span className="important">{this.stats.duration}</span> minutes long.
              </section>
              <section className="info-point">
                {this.getStatusInfo()}
              </section>
              <section className="info-point">
                The show started airing on <span className="important">{monthToMonthStrMap(this.stats.startDate.month)} {this.stats.startDate.day} {this.stats.startDate.year}</span>.
              </section>
              <section className="info-point">
                You can discuss about this anime on twitter by the hashtag <span className="link" onClick={
                  () => shell.openExternal(`https://twitter.com/search?q=${encodeURIComponent(this.stats!.hashtag)}`)
                }>{this.stats.hashtag}</span>
              </section>
              <section className="info-point">
                Average score is <span className="important">{this.stats.averageScore}</span> while the mean score is
                &nbsp;<span className="important">{this.stats.meanScore}</span>.
              </section>
            </div>
            <div className="column">
              <div className="col-title">Your watching stats</div>
            </div>
            <div className="column">
              <div className="col-title">Graphs</div>
            </div>
          </section>
        </section>
      </Banner>
    );
  }

  public render() {
    if(this.stats) return this.renderedStats;
    return (
      <section className="anime-stats-loading">
        loading
      </section>
    );
  }
}