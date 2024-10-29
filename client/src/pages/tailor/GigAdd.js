import React, { useState } from 'react';
import './GigAdd.css'; // Custom CSS file for styling
import Lottie from 'react-lottie';
import loaderAnimation from './Giff/loader_complete.json'; // Path to your loader JSON file
import axios from 'axios'; // Import axios for API requests

const GigAdd = () => {
  const [gigImage, setGigImage] = useState(null);
  const [title, setTitle] = useState(''); // New state for gig title
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState('Custom Suit'); // Default value for serviceType
  const [fabricType, setFabricType] = useState('Cotton'); // Default value for fabricType
  const [measurementsRequired, setMeasurementsRequired] = useState(true); // Default for measurementsRequired
  const [measurementInstructions, setMeasurementInstructions] = useState("Please provide measurements in inches or centimeters.");
  const [basicPrice, setBasicPrice] = useState('');
  const [premiumPrice, setPremiumPrice] = useState('');
  const [basicDeliveryDays, setBasicDeliveryDays] = useState(14); // Default value
  const [premiumDeliveryDays, setPremiumDeliveryDays] = useState(15); // Default value
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

  const validateForm = () => {
    // Check if image is uploaded
    if (!gigImage) {
      setErrorMessage('Please upload a gig picture.');
      return false;
    }

    // Check if title is provided
    if (!title.trim()) {
      setErrorMessage('Title is required.');
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

    // Check delivery days
    if (!premiumDeliveryDays || premiumDeliveryDays < 5 || premiumDeliveryDays > 30) {
      setErrorMessage('Premium delivery days must be between 5 and 30.');
      return false;
    }

    return true;
  };

  const handlePriceChange = (setter, value) => {
    // Allow only numeric values
    if (!isNaN(value)) {
      setter(value);
    }
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
      formData.append('title', title); // New field for title
      formData.append('description', description);
      formData.append('serviceType', serviceType); // New field for service type
      formData.append('fabricType', fabricType); // New field for fabric type
      formData.append('measurementsRequired', measurementsRequired);
      formData.append('measurementInstructions', measurementInstructions);
      formData.append('basicPrice', basicPrice);
      formData.append('premiumPrice', premiumPrice);
      formData.append('basicDeliveryDays', basicDeliveryDays);
      formData.append('premiumDeliveryDays', premiumDeliveryDays);

      try {
        // Make the API request to create a gig
        await axios.post('http://localhost:3001/gigs/add', formData, {
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
        setTitle('');
        setDescription('');
        setServiceType('Custom Suit');
        setFabricType('Cotton');
        setMeasurementsRequired(true);
        setMeasurementInstructions("Please provide measurements in inches or centimeters.");
        setBasicPrice('');
        setPremiumPrice('');
        setBasicDeliveryDays(14);
        setPremiumDeliveryDays(15);
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
        <label>Upload your Gig Picture: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleImageChange}
        />
        <div className='w-20'>
          {gigImage ? (
            <img
              src={URL.createObjectURL(gigImage)}
              alt="Preview of the gig image" // More descriptive alt text
              className="gig-image-preview w-20"
            />
          ) : (
            ''
          )}
        </div>
      </div>

      {/* Title Input */}
      <div className="gig-title mt-2" style={{gap:'10px'}}>
        <label>Gig Title: <span style={{ color: 'red' }}>* </span></label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter gig title"
        />
      </div>

      <div className='d-flex mt-2 mb-2' style={{ gap: '15px', flexDirection: 'row', alignItems: 'center',justifyContent:'start' }}>
          {/* Service Type Selection */}
          <div className="d-flex gig-service-type" style={{ alignItems: 'center'}}>
              <label htmlFor="serviceType" className='m-0' style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>
                Service Type: <span style={{ color: 'red' }}>*</span>
              </label>
              <select id="serviceType" className='m-0' value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                  <option value="Custom Suit">Custom Suit</option>
                  <option value="Dressmaking">Dressmaking</option>
                  <option value="Alteration">Alteration</option>
                  <option value="Waist-Coat">Waist-Coat</option>
                  <option value="Leather Jacket">Leather Jacket</option>
                  <option value="Leather Shoes">Leather Shoes</option>
                  <option value="Sherwani">Sherwani</option>
                  <option value="Bridal-Dress">Bridal-Dress</option>
                  <option value="Other">Other</option>
              </select>
          </div>

          {/* Fabric Type Selection */}
          <div className="d-flex gig-fabric-type" style={{ alignItems: 'center'}}>
              <label htmlFor="fabricType" className='m-0' style={{ whiteSpace: 'nowrap', minWidth: '120px' }}>
                Fabric Type:
                <span style={{ color: 'red' }}>*</span>
              </label>
              <select id="fabricType" className='m-0' value={fabricType} onChange={(e) => setFabricType(e.target.value)}>
                  <option value="Cotton">Cotton</option>
                  <option value="Wool">Wool</option>
                  <option value="Linen">Linen</option>
                  <option value="Silk">Silk</option>
                  <option value="Leather">Leather</option>
                  <option value="Synthetic">Synthetic</option>
                  <option value="Other">Other</option>
              </select>
          </div>
      </div>

      {/* Dynamic Description */}
      <div className="gig-description">
        <label>Description: <span style={{ color: 'red' }}>*</span></label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description here..."
        />
      </div>


      {/* Measurements Required */}
      <div className="gig-measurements-required mt-2">
        <label>
          <input
            type="checkbox"
            checked={measurementsRequired}
            onChange={(e) => setMeasurementsRequired(e.target.checked)}
          />
          &nbsp;Measurements Required <span style={{ color: 'red' }}>*</span>
        </label>
      </div>

      {/* Measurement Instructions */}
      <div className="gig-measurement-instructions">
        <label>Measurement Instructions: <span style={{ color: 'red' }}>*</span></label>
        <textarea
          value={measurementInstructions}
          onChange={(e) => setMeasurementInstructions(e.target.value)}
          placeholder="Provide measurement instructions..."
        />
      </div>

      {/* Price Input for Basic and Premium */}
      <div className="gig-price">
        <label>Basic Price (PKR): <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          value={basicPrice}
          onChange={(e) => handlePriceChange(setBasicPrice, e.target.value)}
          placeholder="Enter basic price"
        />

        <label>Premium Price (PKR): <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          value={premiumPrice}
          onChange={(e) => handlePriceChange(setPremiumPrice, e.target.value)}
          placeholder="Enter premium price"
        />

        <label>Basic Delivery Days: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          value={basicDeliveryDays}
          onChange={(e) => setBasicDeliveryDays(e.target.value)}
          placeholder="Enter delivery days"
        />

        <label>Premium Delivery Days: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          value={premiumDeliveryDays}
          onChange={(e) => setPremiumDeliveryDays(e.target.value)}
          placeholder="Enter delivery days"
        />
      </div>

      {/* Error Message Display */}
      {errorMessage && <p className="error-message text-red-500 text-center">{errorMessage}</p>}

      {/* Success Message Display */}
      {successMessage && <p className="success-message text-green-500 text-center">{successMessage}</p>}

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

export default GigAdd;
