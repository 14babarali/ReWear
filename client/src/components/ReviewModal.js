'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/24/solid';
import axios from 'axios'; // Make sure to import axios for API requests
import { useNavigate } from 'react-router-dom';

export default function ReviewModal({ onClose, productId }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewImage, setReviewImage] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        setReviewImage(file);
        setError(''); // Clear any previous error
      } else {
        setReviewImage(null);
        setError('Please upload a valid image file (JPG, PNG, etc.).');
      }
    }
  };

  const handleReviewSubmit = async () => {
    if (error || rating === 0  || !comment) {
      // Validate input fields
      setError('Please fill out all fields correctly.'); 
      return;
    }

    const formData = new FormData();
    formData.append('productId', productId); // Include the product ID for backend processing
    formData.append('comment', comment);
    formData.append('rating', rating);
    if (reviewImage) {
      formData.append('images', reviewImage); // Append image if it exists
    }

    try {
        const token = localStorage.getItem('token');
        if(token){

        
      const response = await axios.post('http://localhost:3001/reviews/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Review submitted successfully:', response.data);
      
      // Reset form and close modal
      resetForm();
      onClose(); // Close modal after submitting

        }
        else{
            setError('Please login to Post Review');
        }

    } catch (error) {
        console.error('Error submitting review:', error.response ? error.response.data : error.message);
      setError('Failed to submit review. Please try again.');
    }
  };

  const resetForm = () => {
    setComment('');
    setRating(0);
    setReviewImage('');
    setReviewImage(null);
    setError('');
  };

  const handleRating = (newRating) => {
    setRating(newRating);
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75" />

        <div className="fixed inset-0 z-10 flex items-center justify-center p-4 text-center">
          <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="bg-white px-6 py-4">
              <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                Post a Review
              </DialogTitle>
              <div className="mt-3">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review here..."
                  rows="4"
                  className="mt-3 w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              {/* Optional Image Upload Field */}
              <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">Upload Product Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg"
                multiple
              />
              {/* Display error message if file type is invalid */}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleReviewSubmit} // Call the updated submission function
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 sm:ml-3 sm:w-auto"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={()=>navigate(-1)}
                className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
