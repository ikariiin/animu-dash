import * as React from 'react';
import "../styles/mini-button.scss";

export interface MiniButtonProps {
  onClick: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  white?: boolean;
}

export const MiniButton: React.FunctionComponent<MiniButtonProps> = ({ onClick, children, white }): JSX.Element => (
  <button className={`mini-button ${white && 'white'}`} onClick={onClick}>
    {children}
  </button>
);