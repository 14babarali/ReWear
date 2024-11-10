import React, { useState } from 'react';
import './stylesheets/Productinfo.css'; // CSS file for styling
import { FaChevronDown } from 'react-icons/fa'; // Import a chevron icon
import { StarIcon } from '@heroicons/react/24/solid';


const Productinfo = ({ description, reviews }) => {
  const maxStars = 5;
  const [activeSection, setActiveSection] = useState(null); // Track which section is open

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };


  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section); // Toggle section
  };

  return (
    <div className="info-section-container mb-2 w-full">
      <div className="info-item" onClick={() => toggleSection('description')}>
        <span className="info-label">Description</span>
        <FaChevronDown className={`info-arrow ${activeSection === 'description' ? 'active' : ''}`} />
      </div>
      {activeSection === 'description' && (
        <div className="info-content">
          <p>{description}</p>
        </div>
      )}

      <div className="info-item" onClick={() => toggleSection('size')}>
        <span className="info-label">Size & Fit</span>
        <FaChevronDown className={`info-arrow ${activeSection === 'size' ? 'active' : ''}`} />
      </div>
      {activeSection === 'size' && (
        <div className="info-content">
          <p>This product runs true to size. Use our size chart to ensure the best fit.</p>
        </div>
      )}

      <div className="info-item" onClick={() => toggleSection('shipping')}>
        <span className="info-label">Free Shipping & Returns</span>
        <FaChevronDown className={`info-arrow ${activeSection === 'shipping' ? 'active' : ''}`} />
      </div>
      {activeSection === 'shipping' && (
        <div className="info-content">
          <p>Free shipping on orders over Rs:3000, Easy returns within 30 days.</p>
        </div>
      )}

      <div className="info-item" onClick={() => toggleSection('reviews')}>
        <span className="info-label">Reviews ({reviews.length})</span>
        <FaChevronDown className={`info-arrow ${activeSection === 'reviews' ? 'active' : ''}`} />
      </div>
      {activeSection === 'reviews' && (
        <div className="info-content">
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((review, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border-1 border-gray-200 bg-white rounded">
                {/* Profile Image */}
                <div className='rounded'>
                <img
                  src={`http://localhost:3001/uploads/${review.reviewer_id.profile.profilePicture}`}
                  alt="Reviewer"
                  style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%'}}
                />
                </div>

                {/* Review Content */}
                <div className="review-content flex flex-col w-full">
                  {/* Reviewer Name and Rating */}
                  <div className="flex items-center">
                    <h3 className="reviewer-name text-lg mb-0 font-semibold mr-2">
                      {review.reviewer_id.profile.name}
                    </h3>
                    <span className='text-sm text-gray-700 mr-3'>Rated</span>
                    {/* Rating Stars */}
                    <div className="flex items-center space-x-1">
                      {[...Array(maxStars)].map((_, starIndex) => {
                        const starNumber = starIndex + 1;
                        return (
                          <StarIcon
                            key={starNumber}
                            className={`h-5 w-5 ${review.rating >= starNumber ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        );
                      })}
                    </div>
                    
                    <div className='ml-5 text-sm text-gray-600'>
                      {review.created_at && new Date(review.created_at).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="review-comment text-left text-gray-700 mt-2">{review.comment}</p>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="review-images flex space-x-2 mt-2">
                      {review.images.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={`http://localhost:3001/uploads/${image}`}
                          alt={`Review image ${imgIndex + 1}`}
                          className="w-20 h-20 object-cover rounded-md"
                          onClick={() => openModal(image)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Modal for displaying full-size image */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={closeModal}>
          <div className="d-flex relative w-[70%] justify-center">
            <img src={`http://localhost:3001/uploads/${selectedImage}`} alt="Review image" className="w-3/6 h-3/6 rounded-md" />
            <button onClick={closeModal} className="absolute bg-transparent top-4 right-4 text-white text-xl font-bold">✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productinfo;
