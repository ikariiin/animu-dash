import * as React from 'react';
import "../styles/banner.scss";

export interface BannerProps {
  children: any;
  title?: JSX.Element|string;
  className?: string;
}

export const Banner: React.FunctionComponent<BannerProps> = ({ title, children, className }): JSX.Element => (
  <section className={`banner ${className}`}>
    {title && <div className="title">{title}</div>}
    <section className="banner-content">
      {children}
    </section>
  </section>
);