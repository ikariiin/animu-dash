import * as React from 'react';
import {CardSection} from "../../../common/components/card-section";
import {anilistQuery, getCurrentUserId} from "../../../common/utils/anilist-query";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {MediaActivity, MediaFocusCard} from "../cards/media-focus-card";

@observer
export class RecentActivitySection extends React.Component<{}> {
  static maxResults = 11;
  static query = `
    query($id: Int, $page: Int) {
      Page(perPage: ${RecentActivitySection.maxResults}, page: $page) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        activities(userId: $id) {
          ... on ListActivity {
            id,
            progress,
            createdAt,
            status,
            media {
              title {
                romaji
              },
              coverImage {
                large
              }
            }
          }
        }
      }
    }
  `;

  @observable recentActivity: MediaActivity[] = [];
  userId = "0";

  private async fetchRecentActivity(): Promise<void> {
    const userId = await getCurrentUserId();
    this.userId = userId;

    const response = await anilistQuery(RecentActivitySection.query, {id: userId, page: "1"});

    if(response.data.Page.pageInfo && response.data.Page.pageInfo.lastPage !== 1) {
      const revisedResponse = await anilistQuery(RecentActivitySection.query, {id: userId, page: response.data.Page.pageInfo.lastPage.toString()});

      if(revisedResponse.data.Page.pageInfo && revisedResponse.data.Page.activities.length < RecentActivitySection.maxResults) {
        const extraResponse = await anilistQuery(RecentActivitySection.query, {id: userId, page: `${revisedResponse.data.Page.pageInfo.lastPage - 1}`});
        const extraActivities = extraResponse.data.Page.activities.reverse().slice(0, RecentActivitySection.maxResults - revisedResponse.data.Page.activities.length);

        this.recentActivity = [
          ...revisedResponse.data.Page.activities.reverse(),
          ...extraActivities
        ];
      } else {
        this.recentActivity = revisedResponse.data.Page.activities;
      }
    } else {
      this.recentActivity = response.data.Page.activities;
    }
  }

  componentDidMount(): void {
    this.fetchRecentActivity();
  }

  render() {
    return (
      <CardSection title="Recent Activity">
        {this.recentActivity.length !== 0 && this.recentActivity.map(result => (
          <MediaFocusCard {...result} key={result.id} />
        ))}
      </CardSection>
    )
  }
}