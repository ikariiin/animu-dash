import * as React from 'react';
import {observer} from "mobx-react";
import {observable} from "mobx";
import {ThumbnailGenerator} from "../../utils/thumbnail-generator";

export interface ThumbnailProps {
  file: string;
  className?: string;
  children?: any;
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

@observer
export class Thumbnail extends React.Component<ThumbnailProps> {
  @observable private thumbnailURI: string|null = null;

  private async fetchThumbnail(): Promise<void> {
    const thumbnailGenerator = new ThumbnailGenerator(this.props.file);
    this.thumbnailURI = await thumbnailGenerator.generate();
  }

  public componentDidMount(): void {
    this.fetchThumbnail();
  }

  render() {
    if(!this.thumbnailURI) return "loading";

    return (
      <div className={`thumbnail ${this.props.className}`} onClick={this.props.onClick} style={{ backgroundImage: `url(${this.thumbnailURI})` }}>
        {this.props.children}
      </div>
    )
  }
}