import * as React from 'react';
import "../styles/banner.scss";

export interface BannerProps {
  children: any;
  title?: JSX.Element|string;
}

export const Banner: React.FunctionComponent<BannerProps> = ({ title, children }): JSX.Element => (
  <section className="banner">
    {title && <div className="title">{title}</div>}
    <section className="banner-content">
      {children}
    </section>
  </section>
);