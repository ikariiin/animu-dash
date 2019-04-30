import * as React from 'react';
import { render } from 'react-dom';
import {AnimuDashApp} from "./bundles/common/components/animu-dash-app";

render(
  <AnimuDashApp />,
  document.querySelector('[data-react-mount]')
);