import * as React from 'react';

export interface IconProps {
  children: React.ReactElement;
}

export const Icon: React.FunctionComponent<IconProps> = ({ children }): JSX.Element => (
  React.cloneElement(
    children,
    {
      className: "icon"
    }
  )
);