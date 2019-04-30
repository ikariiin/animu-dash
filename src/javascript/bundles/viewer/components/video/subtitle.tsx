import * as React from 'react';
import {IDialogue} from "../../utils/subtitle-parser";
import "../../styles/subtitle.scss";

export interface SubtitleProps extends IDialogue {
  scaling: {
    x: number;
    y: number;
  };
}

export class Subtitle extends React.Component<SubtitleProps> {
  static getPosition(subtitle: IDialogue) {
    const style: any = {};

    const alignment = subtitle.style.alignment;
    if(alignment.column === 'middle') {
      style['justifyContent'] = 'center';
    } else if (alignment.column === 'left') {
      style['justifyContent'] = 'flex-start';
    } else if (alignment.column === 'right') {
      style['justifyContent'] = 'flex-end';
    }

    if(alignment.row === 'bottom') {
      style['bottom'] = 0;
    } else if (alignment.row === 'middle') {
      style['bottom'] = `calc(100vh - 50px)`;
    } else if (alignment.row === 'top') {
      style['top'] = 0;
    }

    return style;
  }

  static fontStyles(subtitle: IDialogue) {
    const style: any = {};

    if(subtitle.style.bold) {
      style.fontWeight = 'bold';
    }
    if(subtitle.style.italic) {
      style.fontStyle = 'italic';
    }

    return style;
  }

  static scale(value: any, scalingFactor: any, scaleBy: any = 'x') {
    if(scaleBy === 'y') {
      return value * (window.screen.height / scalingFactor.y);
    }
    if(scaleBy === 'x') {
      return value * (window.screen.width / scalingFactor.x);
    }
  }

  static scaleMargins(margins: any, scalingFactor: any) {
    return {
      marginBottom: Subtitle.scale(margins.marginBottom, scalingFactor, 'y'),
      marginLeft: Subtitle.scale(margins.marginLeft, scalingFactor, 'x'),
      marginRight: Subtitle.scale(margins.marginRight, scalingFactor, 'x')
    };
  }

  render() {
    return (
      <section className="subtitle" style={{
        ...Subtitle.getPosition(this.props),
        ...this.props.style.margins,
        color: this.props.style.color,
        // @ts-ignore
        fontSize: Math.min(Subtitle.scale(this.props.style.fontSize, this.props.scaling), 55),
        '--outlineColor': this.props.style.outlineColor,
        ...Subtitle.fontStyles(this.props)
      }}>
        {this.props.text}
      </section>
    );
  }
}