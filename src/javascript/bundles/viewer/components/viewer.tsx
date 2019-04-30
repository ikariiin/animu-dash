import * as React from 'react';
import {Page, PageProps} from "../../common/components/page";
import {EpisodeFSItem} from "../../directory/components/episode-section";
import {VideoPlayer} from "./video/video-player";
import {VideoControls} from "./video/video-controls";

export interface ViewerPageProps extends PageProps, EpisodeFSItem {
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
          <VideoControls />
        </VideoPlayer>
      </Page>
    )
  }
}