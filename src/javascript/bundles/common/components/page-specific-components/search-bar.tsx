import * as React from 'react';
import "../../styles/page/search-bar.scss";
import { IoIosSettings, IoIosSearch } from "react-icons/io";
import {Avatar} from "../avatar";
import {getUserAvatar} from "../../../home/utils/get-user-avatar";
import {getCurrentUserName} from "../../utils/get-user-name";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {trimIfRequired} from "../../../home/components/cards/media-focus-card";

@observer
export class SearchBar extends React.Component<{}> {
  @observable private username: string = "loading";

  private async fetchUserName(): Promise<void> {
    this.username = await getCurrentUserName();
  }

  componentDidMount(): void {
    this.fetchUserName();
  }

  render() {
    return (
      <section className="search-bar">
        <div className="search-icon">
          <IoIosSearch />
        </div>
        <input placeholder="Search your library" />
        <Avatar url={getUserAvatar()} label={trimIfRequired(this.username, 20)} />
        <div className="divider" />
        <button className="settings-icon">
          <IoIosSettings />
        </button>
      </section>
    );
  }
};