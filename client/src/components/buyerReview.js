import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './stylesheets/buyerReview.css';

const BuyerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  
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
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                {/* Display the product name */}
                <div className="buyer-info">
                  {/* Display the reviewer's profile picture */}
                  <img
                    src={review.reviewer_id && review.reviewer_id.profile.profilePicture
                      ? `http://localhost:3001/uploads/${review.reviewer_id.profile.profilePicture}`
                      : 'http://localhost:3001/uploads/no-image.png'}
                    alt="Reviewer"
                    title="Reviewer Profile Picture"
                    className="buyer-avatar"
                  />
                  <div className='d-flex flex-col'>
                  <span className='text-base'>{review.reviewer_id ? review.reviewer_id.profile.name : 'Name-not-found'}</span>
                  <span className='text-gray-500 text-sm'>{review.product_id ? review.product_id.name : 'Product Name not Avaiable'}</span>
                  </div>
                  {/* <div className="buyer-details">
                    <h4>{review.reviewer_id ? review.reviewer_id.name : 'Anonymous'}</h4>
                  </div> */}
                </div>
                <div>
                    {/* Display the review date */}
                    <p className="review-date text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                    {/* Display the rating stars */}
                    <div className="rating">{renderStars(review.rating)}</div>
                  </div>
                
              </div>
              {/* Display the review comment */}
              <p className="review-text">{review.comment}</p>
              {/* Display review images if available */}
              {review.images && review.images.length > 0 && (
                <div className="review-images gap-2">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3001/uploads/${image}`}
                      alt={`Review image ${index + 1}`}
                      className="review-image"
                    />
                  ))}
                </div>
              )}
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
