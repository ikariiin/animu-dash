import * as React from 'react';
import {CardSection} from "../../../common/components/card-section";
import "../../styles/library-section.scss";
import {readFile} from "../../utils/save-setup";
import {paths} from "../../../common/utils/paths";
import {SetupConfig} from "../../../../types";
import {computed, observable} from "mobx";
import {observer} from "mobx-react";
import {DirectoryCard} from "../cards/directory-card";
import {Button} from "../../../common/components/button";
import {Routes} from "../../../common/routing/routing";
// @ts-ignore
const {readdir, stat} = window.require('fs').promises;

export interface LibrarySectionProps {
  route: (route: Routes, vars?: any) => void;
}

export interface IndexedDir {
  dir: string;
  name: string;
}

@observer
export class LibrarySection extends React.Component<LibrarySectionProps> {
  @observable libraryDirs: IndexedDir[] = [];
  @observable expanded: boolean = false;

  private async loadLibraryFolders(): Promise<void> {
    const setup: SetupConfig = JSON.parse((await readFile(paths.config.setup)).toString());
    const libraryContents = await readdir(setup.libraryPath);

    // @ts-ignore
    this.libraryDirs = (await Promise.all(libraryContents.map(async (node: string) => {
      try {
        const fqNode = `${setup.libraryPath}/${node}`;
        const nodeStat = await stat(fqNode);
        return nodeStat.isDirectory() ? {dir: fqNode, name: node} : null;
      } catch (e) {
        return null;
      }
    }))).filter(dir => dir !== null);
  }

  private toggleExpansion(): void {
    this.expanded = !this.expanded;
  }

  private openDirectory(dir: IndexedDir): void {
    this.props.route(Routes.DIRECTORY_VIEW, {
      indexedDir: dir
    });
  }

  @computed get renderCardsWhenLoaded() {
    if(this.expanded) return this.libraryDirs.map(dir => (
      <DirectoryCard onClick={(dir: IndexedDir) => this.openDirectory(dir)} dir={dir.dir} name={dir.name} />
    ));

    return this.libraryDirs.slice(0, 8).map(dir => (
      <DirectoryCard onClick={(dir: IndexedDir) => this.openDirectory(dir)} dir={dir.dir} name={dir.name} />
    ));
  }

  componentDidMount(): void {
    this.loadLibraryFolders();
  }

  render() {
    return (
      <section className="library-section">
        <CardSection
          headerAdornment={<Button size="small" style={{marginLeft: '1rem'}} onClick={() => this.toggleExpansion()}>
            {this.expanded ? 'Contract' : `Expand (${this.libraryDirs.length - 10} items hidden)`}
          </Button>}
          title="Your Library"

          style={{ display: 'flex', flexWrap: 'wrap' }} >
          {this.renderCardsWhenLoaded}
        </CardSection>
      </section>
    );
  }
}