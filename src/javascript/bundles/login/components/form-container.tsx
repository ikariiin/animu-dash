import * as React from 'react';
import "../styles/login-form.scss";
import {AnilistLoginButton, AnilistLoginButtonProps} from "./anilist-login-button";

export const FormContainer: React.FunctionComponent<AnilistLoginButtonProps> = ({ onClick }): JSX.Element => (
  <section className="login-form-container">
    {/*<h1 className="title">Login</h1>*/}
    <section className="form-wrapper">
      <h1 className="title">Animu Dash</h1>
      <AnilistLoginButton onClick={onClick} />
    </section>
  </section>
);