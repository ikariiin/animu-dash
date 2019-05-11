import * as React from 'react';
import "../styles/status-container.scss";
import {anilistQuery, getCurrentUserId} from "../../common/utils/anilist-query";
import Dropdown from "react-dropdown";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Input} from "../../common/components/input";

export interface StatusContainerProps {
  id: number;
}

export interface FetchedData {
  status: string;
  score: number;
  progress: number;
  media: {
    episodes: number;
  }
}

@observer
export class StatusContainer extends React.Component<StatusContainerProps> {
  @observable fetchedData: FetchedData|null = null;

  private static async getQuery(): Promise<string> {
    return `
      query($mediaId: Int) {
        MediaList(mediaId: $mediaId, userId: ${await getCurrentUserId()}) {
          status,
          score(format: POINT_10),
          progress,
          media {
            episodes
          }
        }
      }
    `;
  }

  static POSSIBLE_STATUS = [
    "CURRENT",
    "PLANNING",
    "COMPLETED",
    "DROPPED",
    "PAUSED",
    "REPEATING"
  ];

  private async fetchData(): Promise<void> {
    const response = await anilistQuery(await StatusContainer.getQuery(), {mediaId: `${this.props.id}`});

    console.log(response.data, this.props.id);
    this.fetchedData = response.data.MediaList;
  }

  componentDidMount(): void {
    this.fetchData();
  }

  render() {
    if(!this.fetchedData) return null;

    return (
      <section className="status-container">
        <div className="status-title">List Status</div>
        <section className="grid-view">
          <section className="dropdown-container">
            <div className="label">Status</div>
            <Dropdown options={StatusContainer.POSSIBLE_STATUS.map(status => status.toLowerCase())} value={this.fetchedData.status.toLowerCase()} />
          </section>
          <Input fieldName="Score" style={{ background: 'rgba(0,0,0,.5)', color: '#ECECEC' }} onChange={() => {}} value={'' + this.fetchedData.score} />
          <section className="episode-progress">
            <div className="label">Progress</div>
            <div className="numbers">
              {this.fetchedData.progress} <span className="divider">/</span> {this.fetchedData.media.episodes}
            </div>
          </section>
        </section>
      </section>
    );
  }
}