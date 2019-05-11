import * as React from 'react';
import "../styles/base.scss";
import {computed, observable} from "mobx";
import {Routes} from "../routing/routing";
import {LoginPage} from "../../login/components/login-page";
import {HomePage} from "../../home/components/home-page";
import {observer} from "mobx-react";
import {DirectoryPage} from "../../directory/components/directory-page";
import {ViewerPage} from "../../viewer/components/viewer";

@observer
export class AnimuDashApp extends React.Component<{}, {}> {
  @observable pageInContext = Routes.LOGIN;
  @observable pageVars: any = {};

  route(route: Routes, vars: any = {}): void {
    this.pageInContext = route;
    this.pageVars = vars;
  }

  @computed get renderContextPage() {
    switch (this.pageInContext) {
      case Routes.LOGIN:
        return <LoginPage route={(route, vars) => this.route(route, vars)} />;
      case Routes.HOME:
        return <HomePage route={(route, vars) => this.route(route, vars)} />;
      case Routes.DIRECTORY_VIEW:
        return <DirectoryPage route={(route, vars) => this.route(route, vars)} {...this.pageVars} />;
      case Routes.VIEWER:
        return <ViewerPage route={(route, vars) => this.route(route, vars)} {...this.pageVars} />;
      default:
        throw new Error("yeet boy.");
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* Here we will apply out switching mechanism for routes */}
        {/* Also have a mobx observable to keep track of it. */}
        {this.renderContextPage}
      </React.Fragment>
    );
  }
}