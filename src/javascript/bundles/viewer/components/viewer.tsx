import * as React from 'react';
import {Page, PageProps} from "../../common/components/page";
import {VideoPlayer} from "./video/video-player";
import {VideoControls} from "./video/video-controls";
import {EpisodeDetails} from "../../directory/components/episode-card";

export interface ViewerPageProps extends PageProps, EpisodeDetails {
}

export class ViewerPage extends React.Component<ViewerPageProps> {
  componentDidMount(): void {
    document.body.style.overflowY = "hidden";
  }
  componentWillUnmount(): void {
    document.body.style.overflowY = "auto";
  }

  render() {
    return (
      <Page {...this.props} hideSearchBar>
        <VideoPlayer {...this.props}>
          <VideoControls
            hoverState={false}
            episodeDetails={this.props.parsedAnimeTitle}
            animeDetails={this.props.animeDetails}
          />
        </VideoPlayer>
      </Page>
    )
  }
}