import React from "react";
import "./Card.scss";

const Card = ({ card }) => {
  return (
    <li className="card-item">
      {card.cover && (
        <img
          src="https://i.picsum.photos/id/870/536/354.jpg?blur=2&grayscale&hmac=A5T7lnprlMMlQ18KQcVMi3b7Bwa1Qq5YJFp8LSudZ84"
          alt="thodo"
          className="task-item"
        />
      )}
      {card.title}
    </li>
  );
};

export default Card;
