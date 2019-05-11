import * as React from 'react';
import "../styles/webview-window.scss";

export interface WebviewWindowProps {
  src: string;
  className?: string;
  titleBarExtension?: JSX.Element
}

export const WebviewWindow: React.FunctionComponent<WebviewWindowProps> = ({ src, className, titleBarExtension }): JSX.Element => (
  <section className={`${className} webview-window`}>
    <div className="title-bar">
      <section className="url-container">{src}</section>
      {titleBarExtension && titleBarExtension}
    </div>
    <webview src={src} className="webview-element" />
  </section>
);