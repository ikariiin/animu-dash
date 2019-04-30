import * as React from 'react';
import {WebviewWindow} from "../../common/components/webview-window";
import {MiniInput} from "../../common/components/mini-input";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {MiniButton} from "../../common/components/mini-button";

export interface OauthWindowProps {
  onComplete: (code: string) => void;
}

@observer
export class OauthWindow extends React.Component<OauthWindowProps> {
  static clientID = "1913";
  static redirectURI = "https://anilist.co/api/v2/oauth/pin";

  @observable codeValue = "";

  private onCodeInputChange(ev: React.ChangeEvent<HTMLInputElement>): void {
    this.codeValue = ev.target.value;
  }

  private insertCode(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    this.props.onComplete(this.codeValue);
  }

  render() {
    return (
      <WebviewWindow
        src={`https://anilist.co/api/v2/oauth/authorize?client_id=${OauthWindow.clientID}&redirect_uri=${OauthWindow.redirectURI}&response_type=code`}
        titleBarExtension={
          <React.Fragment>
            <MiniInput value={this.codeValue} onChange={(ev) => this.onCodeInputChange(ev)} placeholder="Place the code here" />
            <MiniButton white onClick={(ev) => this.insertCode(ev)}>Go</MiniButton>
          </React.Fragment>
        }
      />
    );
  }
}