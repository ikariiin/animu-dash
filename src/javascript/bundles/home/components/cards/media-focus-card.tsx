import * as React from 'react';
import "../../styles/cards/media-focus-card.scss";
import * as moment from 'moment';
import {getUserAvatar} from "../../utils/get-user-avatar";
import {Avatar} from "../../../common/components/avatar";

export interface MediaActivity {
  id: number;
  progress: number|null;
  status: string;
  createdAt: number;
  media?: {
    title: {
      romaji: string;
    },
    coverImage: {
      large: string;
    }
  }
}

export function trimIfRequired(name: string, length: number = 25): string {
  if(name.length > length) return name.slice(0, length - 3) + '...';
  return name;
}

export const MediaFocusCard: React.FunctionComponent<MediaActivity> = ({ media, progress, status, createdAt }): JSX.Element|null => {
  if(!media) return null;

  return (
    <section className="media-focus-card">
      <section className="author-details">
        <Avatar url={getUserAvatar()}/>
        <time className="time">{moment(createdAt * 1000).fromNow()}</time>
      </section>
      <div className="cover-image" style={{ backgroundImage: `url(${media.coverImage.large})` }} />
      <div className="details">
        <section className="name">{media && trimIfRequired(media.title.romaji)}</section>
        <section className="sub-details">
          <span className="status">{status} {status === "watched episode" && "ep"}{progress}</span>
        </section>
      </div>
    </section>
  );
};