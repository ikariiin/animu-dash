import * as React from 'react';
import "../styles/page/card-section.scss";

export interface CardSectionProps {
  title: string|React.ReactElement;
  children: any;
  style?: React.CSSProperties;
  headerAdornment?: any;
}

export const CardSection: React.FunctionComponent<CardSectionProps> = ({ title, children, style, headerAdornment }) => (
  <section className="card-section">
    <header className="header-container">
      <h2 className="header">{title}</h2>
      {headerAdornment}
    </header>
    <section className="card-section-content" style={style}>
      {children}
    </section>
  </section>
);