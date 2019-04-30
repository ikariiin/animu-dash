import * as React from 'react';
import {paths} from "../../common/utils/paths";
import {SetupConfig} from "../../../types";
import {computed, observable} from "mobx";
import {observer} from "mobx-react";
import {SetupScreen} from "./setup-screen";
import {Dashboard} from "./dashboard";
import {PageProps} from "../../common/components/page";
// @ts-ignore
const fs = window.require('fs');
// @ts-ignore
const {promisify} = window.require('util');

const fsRead = promisify(fs.readFile);

@observer
export class HomePage extends React.Component<PageProps> {
  @observable renderSetupScreen = false;

  // We will check if the library config is already set, if not
  // have a go at it.

  private static async getSetupConfig(): Promise<SetupConfig> {
    const setupConfig = await fsRead(paths.config.setup);
    return JSON.parse(setupConfig.toString());
  }

  private static async checkSetup(): Promise<null|string> {
    return (await HomePage.getSetupConfig()).libraryPath;
  }

  async componentDidMount(): Promise<void> {
    const setupDone = await HomePage.checkSetup();
    if(!setupDone) {
      this.renderSetupScreen = true;
    }
  }

  @computed get renderScreen(): JSX.Element|null {
    if(this.renderSetupScreen) return <SetupScreen onComplete={() => this.renderSetupScreen = false} />;

    return <Dashboard {...this.props} />;
  }

  render() {
    return (
      <section className="mount-root home-page">
        {this.renderScreen}
      </section>
    )
  }
}