import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './stylesheets/buyerReview.css';

const BuyerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  // Static review data
  const staticReview = {
    buyerName: 'Talha Masood',
    buyerAvatar: '/default-avatar.png',
    date: new Date(),
    rating: 4,
    text: 'Great product, highly recommended!'
  };

  useEffect(() => {
    // Fetching reviews data from the server
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3001/reviews/getall', {

          headers: {
            'Authorization': `Bearer ${token}`
        }

        } ); // Replace with your API endpoint
        setReviews([]);
        setReviews(response.data); // Add static review to the fetched reviews
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // setReviews([staticReview]);
        setLoading(false);
      }
    };
    fetchReviews();
  }, [token]);

  if (loading) {
    return <div className="loader">Loading reviews...</div>;
  }

  return (
    <div className="reviews-container h-full w-full mt-3 bg-white">
      <h2 className="reviews-title">Buyer Reviews</h2>
      <div className="reviews-grid">
        {reviews.length === 0 ? (
          <p className="no-reviews text-center">No reviews available.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <div className="buyer-info">
                  <img
                    src={review.buyerAvatar || '/default-avatar.png'}
                    alt="Buyer Avatar"
                    className="buyer-avatar"
                  />
                  <div className="buyer-details">
                    <h4>{review.buyerName}</h4>
                    <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="rating">{renderStars(review.rating)}</div>
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Function to render star ratings
const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < rating ? 'star filled' : 'star'}>
        ★
      </span>
    );
  }
  return stars;
};

export default BuyerReviews;
