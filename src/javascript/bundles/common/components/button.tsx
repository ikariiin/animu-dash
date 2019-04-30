import * as React from 'react';
import "../styles/button.scss";

export interface ButtonProps {
  className?: string;
  size?: "large"|"small"|"default";
  children: any;
  color?: "default"|"primary";
  onClick?: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  style?: React.CSSProperties;
}

export const Button: React.FunctionComponent<ButtonProps> = ({  onClick, className, color, children, size, style }): JSX.Element => (
  <button style={style} className={`${className} size-${size} color-default color-${color} button`} onClick={(ev) => onClick && onClick(ev)}>
    {children}
  </button>
);