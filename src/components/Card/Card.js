import React from "react";
import "./Card.scss";

const Card = ({ card }) => {
  return (
    <div className="card-item">
      {card.cover && (
        <img
          src={card.cover}
          alt="thodo"
          className="card-cover"
          draggable="false" //onMouseDown={(e)=>e.preventDefault()}
        />
      )}
      {card.title}
    </div>
  );
};

export default Card;
