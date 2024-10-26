import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // to highlight stars on hover
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/buyerReview', {
        productId,
        rating,
        review
      });
      setMessage('Review submitted successfully!');
      setRating(0);
      setReview('');
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
        <div className="form-group">
          <label>Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                onClick={() => handleClick(star)}
                onMouseOver={() => handleMouseOver(star)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer', fontSize: '24px' }}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="review">Review:</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            style={{
              border: '2px solid black',
              padding: '10px',
              borderRadius: '5px',
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: 'Lora, serif'
            }}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={rating === 0 || review.trim() === ''}
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
