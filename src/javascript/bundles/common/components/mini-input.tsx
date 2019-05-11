import * as React from 'react';
import "../styles/mini-input.scss";

export interface MiniInputProps {
  value: string;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export const MiniInput: React.FunctionComponent<MiniInputProps> = ({ value, onChange, placeholder }): JSX.Element => (
  <input className="mini-input" placeholder={placeholder} value={value} onChange={(ev) => onChange(ev)} />
);