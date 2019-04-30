import * as React from 'react';
import "../styles/setup-screen.scss";
import {FolderPicker} from "./folder-picker";

export interface SetupScreenProps {
  onComplete: (path: string) => void;
}

export class SetupScreen extends React.Component<SetupScreenProps> {
  render() {
    return (
      <section className="setup-screen">
        <section className="wrapper">
          <h1 className="title">Let's get you set up.</h1>
          <br />
          <FolderPicker />
        </section>
      </section>
    );
  }
}