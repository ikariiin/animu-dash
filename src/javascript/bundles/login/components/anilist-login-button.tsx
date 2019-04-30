import * as React from 'react';
import "../styles/login-button.scss";

export interface AnilistLoginButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
};

export const AnilistLoginButton: React.FunctionComponent<AnilistLoginButtonProps> = ({ onClick }): JSX.Element => (
  <button className="anilist-login-button" onClick={(ev) => onClick(ev)}>
    Login in with Anilist
  </button>
);