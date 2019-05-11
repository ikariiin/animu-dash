import * as React from 'react';
import {Routes} from "../routing/routing";
import {SearchBar} from "./page-specific-components/search-bar";
import {SideBar} from "./page-specific-components/side-bar";
import "../styles/page/page.scss";

export interface PageProps {
  route: (route: Routes, vars?: any) => void;
  children?: any;
  className?: string;
  active?: string;
  hideSearchBar?: boolean;
}

export const Page: React.FunctionComponent<PageProps> = ({ active, route, children, className, hideSearchBar }): JSX.Element => (
  <section className={`page ${className}`}>
    <SideBar active={active} route={route} />
    <section className="content-wrapper">
      { !hideSearchBar && <SearchBar /> }
      <section className={`content ${hideSearchBar && 'no-search-bar'}`}>
        {children}
      </section>
    </section>
  </section>
);