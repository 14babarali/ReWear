import React, { useState } from 'react';
import './GigPage.css'; // Custom CSS file for styling
import Lottie from 'react-lottie';
import loaderAnimation from './Giff/loader_complete.json'; // Path to your loader JSON file
import axios from 'axios'; // Import axios for API requests

const GigPage = () => {
  const [gigImage, setGigImage] = useState(null);
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState(['', '', '']);
  const [basicPrice, setBasicPrice] = useState('');
  const [premiumPrice, setPremiumPrice] = useState('');
  const [loading, setLoading] = useState(false); // Loader state
  const [errorMessage, setErrorMessage] = useState(''); // Error message for validation
  const [successMessage, setSuccessMessage] = useState(''); // Success message for gig creation
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  // Lottie animation settings
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if the file is an image
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validImageTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (jpg, jpeg, png).');
      setGigImage(null);
      return;
    }

    setGigImage(file); // Store the file for uploading
    setErrorMessage(''); // Clear any previous error
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const handlePriceChange = (setter, value) => {
    // Allow only numeric values
    if (!isNaN(value)) {
      setter(value);
    }
  };

  const validateForm = () => {
    // Check if image is uploaded
    if (!gigImage) {
      setErrorMessage('Please upload a gig picture.');
      return false;
    }

    // Check if description is more than 5 words
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount < 5) {
      setErrorMessage('Description must be more than 5 words.');
      return false;
    }

    // Validate prices
    if (!basicPrice || basicPrice < 1000 || basicPrice > 3000) {
      setErrorMessage('Basic price must be between 1000 and 3000 PKR.');
      return false;
    }
    if (!premiumPrice || premiumPrice < 3000 || premiumPrice > 10000) {
      setErrorMessage('Premium price must be between 3000 and 10,000 PKR.');
      return false;
    }

    // Check if all skills are filled
    if (skills.some((skill) => skill.trim() === '')) {
      setErrorMessage('All three skills are required.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setErrorMessage(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success message

    if (validateForm()) {
      setLoading(true); // Show loader
      setShowModal(true); // Show modal after validation

      // Create FormData for the API request
      const formData = new FormData();
      formData.append('gigImage', gigImage);
      formData.append('description', description);
      formData.append('skills', JSON.stringify(skills));
      formData.append('basicPrice', basicPrice);
      formData.append('premiumPrice', premiumPrice);

      try {
        // Make the API request to create a gig
        const response = await axios.post('/api/gigs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if using authentication
          },
        });

        setLoading(false); // Hide loader
        setSuccessMessage('Your gig has been successfully created!');
        setShowModal(false); // Hide modal after upload is complete

        // Clear form fields
        setGigImage(null);
        setDescription('');
        setSkills(['', '', '']);
        setBasicPrice('');
        setPremiumPrice('');
      } catch (error) {
        setLoading(false); // Hide loader
        setShowModal(false); // Hide modal
        setErrorMessage(
          error.response?.data?.error || 'Failed to create the gig. Please try again.'
        );
      }
    }
  };

  return (
    <div className="gig-container">
      <div className="gig-header">
        <h2>Gig Showcase</h2>
      </div>

      {/* Image Upload */}
      <div className="gig-image-upload">
        <label>Upload your Gig Picture:</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleImageChange}
        />
        {gigImage && <img src={URL.createObjectURL(gigImage)} alt="Gig Preview" className="gig-image-preview" />}
      </div>

      {/* Dynamic Description */}
      <div className="gig-description">
        <label>Gig Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter gig description here..."
        />
      </div>

      {/* Dynamic Skills */}
      <div className="gig-skills">
        <label>Gig Skills (Max 3):</label>
        {skills.map((skill, index) => (
          <input
            key={index}
            type="text"
            value={skill}
            onChange={(e) => handleSkillChange(index, e.target.value)}
            placeholder={`Skill ${index + 1}`}
          />
        ))}
        <div className="skills-display">
          {skills.map((skill, index) => (
            skill && <span key={index} className="skill-badge">{skill}</span>
          ))}
        </div>
      </div>

      {/* Price Input for Basic and Premium */}
      <div className="gig-price">
        <label>Basic Price (PKR):</label>
        <input
          type="text"
          value={basicPrice}
          onChange={(e) => handlePriceChange(setBasicPrice, e.target.value)}
          placeholder="Enter basic price"
        />

        <label>Premium Price (PKR):</label>
        <input
          type="text"
          value={premiumPrice}
          onChange={(e) => handlePriceChange(setPremiumPrice, e.target.value)}
          placeholder="Enter premium price"
        />
      </div>

      {/* Error Message Display */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Success Message Display */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Submit Button */}
      <div className="submit-container">
        <button onClick={handleSubmit} disabled={loading}>Submit</button>
      </div>

      {/* Modal for Loader */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Lottie options={defaultOptions} height={120} width={120} />
            <p>Your gig is being uploaded...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigPage;
