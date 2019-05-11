import * as React from 'react';
import "../styles/login-page.scss";
import {FormContainer} from "./form-container";
import {observer} from 'mobx-react';
import {computed, observable} from "mobx";
import {OauthWindow} from "./oauth-window";
import {oauthFinalize} from "../../common/utils/oauth-finalize";
import {Routes} from "../../common/routing/routing";
import {PageProps} from "../../common/components/page";


@observer
export class LoginPage extends React.Component<PageProps> {
  @observable showOAuthWindow = false;

  private triggerOAuth(): void {
    this.showOAuthWindow = true;
  }

  private async setOAuthCode(code: string): Promise<void> {
    localStorage.token = await oauthFinalize(code);

    this.showOAuthWindow = false;
    this.props.route(Routes.HOME);
  }

  @computed get renderOAuthWindow(): null|React.ReactNode {
    if(!this.showOAuthWindow) return null;

    return (
      <OauthWindow onComplete={(code: string) => this.setOAuthCode(code)} />
    );
  }

  componentDidMount(): void {
    if(localStorage.token) {
      this.props.route(Routes.HOME);
    }
  }

  render() {
    return (
      <section className="mount-root login-page">
        {this.renderOAuthWindow}
        <FormContainer onClick={(ev) => this.triggerOAuth()} />
      </section>
    );
  }
}