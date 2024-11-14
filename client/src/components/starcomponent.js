// src/components/StarRating.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const StarRating = ({ condition }) => {
  const rating = parseFloat(condition);
  const filledStars = Math.floor((rating / 10) * 5);
  const hasHalfStar = (rating / 10) * 5 - filledStars >= 0.5;
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < filledStars) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} style={{ color: 'gold' }} />);
    } else if (i === filledStars && hasHalfStar) {
      stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} style={{ color: 'gold' }} />);
    } else {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} style={{ color: 'lightgray' }} />);
    }
  }

  return <>{stars}</>;
};

export default StarRating;
  