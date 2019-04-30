import * as React from 'react';
import {DirectoryPageProps, FetchedAnimeDetails, ParsedAnimeTitle} from "./directory-page";
import {CardSection} from "../../common/components/card-section";
import {observable} from "mobx";
import {EpisodeCard} from "./episode-card";
import {Routes} from "../../common/routing/routing";
// @ts-ignore
const anitomy = window.require('anitomy-js');
// @ts-ignore
const {readdir} = window.require('fs').promises;

export interface EpisodeFSItem {
  parsedAnimeTitle: ParsedAnimeTitle;
  filePath: string;
}
export interface EpisodeSectionProps extends DirectoryPageProps {
}

export class EpisodeSection extends React.Component<EpisodeSectionProps> {
  @observable episodesList: EpisodeFSItem[] = [];

  private async loadEpisodes(): Promise<void> {
    const nodes: string[] = (await await readdir(this.props.indexedDir.dir))
      .map((node: string) => `${this.props.indexedDir.dir}/${node}`)
      .filter((node: string) => node.split('.').pop() === "mkv");
    this.episodesList = await Promise.all(nodes.map(async (node: string) => ({
      parsedAnimeTitle: await anitomy.parse(node),
      filePath: node
    })));
  }

  private openEpisodeViewer(episode: EpisodeFSItem): void {
    this.props.route(Routes.VIEWER, episode);
  }

  componentDidMount(): void {
    this.loadEpisodes();
  }

  render() {
    return (
      <CardSection title="Episodes" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
        {this.episodesList.sort((a: EpisodeFSItem, b: EpisodeFSItem): number => {
          if(!a.parsedAnimeTitle.episode_number || !b.parsedAnimeTitle.episode_number) return 0;
          return parseInt(a.parsedAnimeTitle.episode_number, 10) - parseInt(b.parsedAnimeTitle.episode_number, 10);
        }).map(episode => <EpisodeCard {...episode} onClick={(episode: EpisodeFSItem) => this.openEpisodeViewer(episode)} />)}
      </CardSection>
    )
  }
}