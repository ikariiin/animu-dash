import * as React from 'react';
import {ChangeEvent} from "react";
import "../styles/input.scss";

export interface InputProps  {
  fieldName: string;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  placeholder?: string;
  adornment?: React.ReactElement;
  value?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const Input: React.FunctionComponent<InputProps> = ({style, disabled, adornment, fieldName, onChange, helperText, placeholder, value}): JSX.Element => (
  <div className="input-container">
    <div className="field-name">{fieldName}</div>
    <div className="input-wrapper">
      <input disabled={disabled} style={style} onChange={(ev) => onChange(ev)} placeholder={placeholder ? placeholder : 'Start typing here...'} value={value} />
      {adornment && React.cloneElement(adornment, { className: "adornment" })}
    </div>
    {helperText && <div className="helper-text">{helperText}</div>}
  </div>
);