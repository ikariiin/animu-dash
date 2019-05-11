import * as React from 'react';
import {Character as ICharacter} from "./video/inactive-overlay";
import "../styles/character.scss";

export const Character: React.FunctionComponent<ICharacter> = ({ node, id, voiceActors, role }): JSX.Element => {
  const voiceActor = voiceActors.filter(actor => actor.language === "JAPANESE")[0];

  return (
    <section className="character">
      <div className="character-image" style={{ backgroundImage: `url(${node.image.large})` }} />
      <section className="details">
        <div className="name">{node.name.last} {node.name.first}</div>
        <div className="voice-actor">{voiceActor.name.last} {voiceActor.name.first}</div>
      </section>
    </section>
  )
};