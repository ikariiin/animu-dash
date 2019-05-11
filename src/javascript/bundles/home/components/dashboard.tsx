import * as React from 'react';
import {Page, PageProps} from "../../common/components/page";
import {RecentActivitySection} from "./dashboard-specific-components/recent-activity-section";
import {LibrarySection} from "./dashboard-specific-components/library-section";

export class Dashboard extends React.Component<PageProps> {
  render() {
    return (
      <Page {...this.props} active="Dashboard">
        <LibrarySection {...this.props} />
        <RecentActivitySection />
      </Page>
    )
  }
}