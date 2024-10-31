import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // to highlight stars on hover
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/reviews/add', {
        productId,
        // images,
        rating,
        comment
      },{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setMessage('Review submitted successfully!');
      onReviewAdded(); 
      setRating(0);
      setComment('');
    } catch (error) {
      console.error("Error submitting review: ", error.response || error.message);
      setMessage('Error submitting review.');
    }
  };

  const handleClick = (value) => {
    setRating(value);
  };

  const handleMouseOver = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="review-form">
      <h4>Leave a Review</h4>
      <form onSubmit={handleSubmit}>
        <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" placeholder="Rate 1-5" required />
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review..." required />
        <button 
          type="submit" 
        >
          Submit Review
        </button>
        {message && <p>{message}</p>}
      </form>

      <style>{`
        .star-rating {
          display: flex;
          justify-content: center; /* Centers the stars horizontally */
          align-items: center;     /* Ensures vertical alignment if necessary */
        }
        .star {
          color: #ddd;
        }
        .star.filled {
          color: gold;
        }
      `}</style>
    </div>
  );
};

export default ReviewForm;
