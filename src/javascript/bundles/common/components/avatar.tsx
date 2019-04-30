import * as React from 'react';
import "../styles/avatar.scss";
import {observer} from "mobx-react";
import {observable} from "mobx";

export interface AvatarProps {
  url: string|Promise<string>;
  label?: string;
}

@observer
export class  Avatar extends React.Component<AvatarProps> {
  @observable imageURL = "";

  private async fetchImageIfPromise(): Promise<void> {
    this.imageURL = await this.props.url;
  }

  componentDidMount(): void {
    this.fetchImageIfPromise();
  }

  render() {
    if(typeof this.props.url === "string") return <div style={{ backgroundImage: `url(${this.props.url})` }} className="avatar" />;

    if(this.props.label) return (
      <section className="avatar-with-label">
        <Avatar url={this.props.url} />
        <div className="label">{this.props.label}</div>
      </section>
    );

    return <div style={{ backgroundImage: `url(${this.imageURL})` }} className="avatar" />;
  }
}