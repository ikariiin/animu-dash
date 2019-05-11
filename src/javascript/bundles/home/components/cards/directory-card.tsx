import * as React from 'react';
import "../../styles/cards/directory-card.scss";
import {IoIosFolder} from 'react-icons/io';
import {trimIfRequired} from "./media-focus-card";
import {IndexedDir} from "../dashboard-specific-components/library-section";

export interface DirectoryCardProps {
  dir: string;
  name: string;
  onClick: (dir: IndexedDir) => void;
}

export const DirectoryCard: React.FunctionComponent<DirectoryCardProps> = ({ dir, name, onClick }): JSX.Element => (
  <section className="directory-card" onClick={() => onClick({dir, name})}>
    <div className="icon">
      <IoIosFolder />
    </div>
    <section className="name">
      {trimIfRequired(name, 23)}
    </section>
    <section className="directory">
      {trimIfRequired(dir.replace(/\\/g, '/'), 35)}
    </section>
  </section>
);