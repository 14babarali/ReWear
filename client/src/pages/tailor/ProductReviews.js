import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import { StarIcon } from '@heroicons/react/24/solid';

const ProductReviews = () => {
  const location = useLocation();
  const maxStars = 5;
  const { reviews, product } = location.state || {};
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  if (!reviews || reviews.length === 0) {
    return <p>No reviews available for this product.</p>;
  }

  return (
    <div>
      <h1 className='text-center mt-2 text-2xl font-bold'>{product?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {reviews.map((review, index) => (
          <div key={index} className="flex flex-col p-4 border border-gray-200 bg-white rounded shadow-sm">
            {/* Profile Image */}
            <div className="mb-4">
              <img
                src={`http://localhost:3001/uploads/${review.reviewer_id.profile.profilePicture}`}
                alt="Reviewer"
                className="w-16 h-16 object-cover rounded-full mx-auto"
              />
            </div>

            {/* Reviewer Name and Rating */}
            <div className="text-center">
              <h3 className="text-lg font-semibold">{review.reviewer_id.profile.name}</h3>
              <div className="flex justify-center mt-1">
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
              <div className="text-sm text-gray-500 mt-1">
                {review.created_at &&
                  new Date(review.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
              </div>
            </div>

            {/* Comment */}
            <p className="text-gray-700 text-sm mt-4 text-left">{review.comment}</p>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {review.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={`http://localhost:3001/uploads/${image}`}
                    alt={`Review image ${imgIndex + 1}`}
                    className="w-20 h-20 object-cover rounded-md cursor-pointer"
                    onClick={() => openModal(image)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for displaying full-size image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={closeModal}
        >
          <div className="relative">
            <img
              src={`http://localhost:3001/uploads/${selectedImage}`}
              alt="Review image"
              className="max-w-full max-h-full rounded-md"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
