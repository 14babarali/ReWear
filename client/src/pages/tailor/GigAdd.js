import React, { useState } from 'react';
import './GigAdd.css'; // Custom CSS file for styling
import Lottie from 'react-lottie';
import loaderAnimation from './Giff/loader_complete.json'; // Path to your loader JSON file
import axios from 'axios'; // Import axios for API requests
import { useFormik } from 'formik';
import * as Yup from 'yup';

const GigAdd = () => {
  const [gigImage, setGigImage] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState([]); // State for portfolio images
  const [loading, setLoading] = useState(false); // Loader state
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [errorMessage, setErrorMessage] = useState(''); // Error message for validation
  const [successMessage, setSuccessMessage] = useState(''); // Success message for gig creation
  const [isEditMode, setIsEditMode] = useState(true);

  // Lottie animation settings
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      serviceType: '',
      fabricType: '',
      measurementsRequired: true,
      experienceYears: 1, // Default experience
      measurementInstructions: 'Provide measurements in inches or centimeters.',
      basicPrice: '',
      premiumPrice: '',
      basicDeliveryDays: 14, // Default value
      premiumDeliveryDays: 15, // Default value
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required.'),
      description: Yup.string().min(5, 'Description must be more than 5 words.').required('Description is required.'),
      serviceType: Yup.string().required('Service type is required.'),
      fabricType: Yup.string().required('Fabric type is required.'),
      basicPrice: Yup.number().min(1000, 'Basic price must be at least 1000 PKR.').required('Basic price is required.'),
      premiumPrice: Yup.number()
        .min(3000, 'Premium price must be at least 3000 PKR.')
        .moreThan(Yup.ref('basicPrice'), 'Premium price must be higher than basic price.')
        .required('Premium price is required.'),
      basicDeliveryDays: Yup.number().required('Basic delivery days are required.'),
      premiumDeliveryDays: Yup.number()
        .min(5, 'Premium delivery days must be at least 5.')
        .max(30, 'Premium delivery days cannot exceed 30.')
        .required('Premium delivery days are required.'),
    }),
    onSubmit: async (values) => {
      if (!gigImage) {
        setErrorMessage('Please upload a gig picture.');
        return;
      }

      setLoading(true); // Show loader
      setShowModal(true); // Show modal after validation

      // Create FormData for the API request
      const formData = new FormData();
      formData.append('gigImage', gigImage);
      formData.append('portfolioImages', portfolioImages); // Append portfolio images
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('serviceType', values.serviceType);
      formData.append('fabricType', values.fabricType);
      formData.append('measurementsRequired', values.measurementsRequired);
      formData.append('experienceYears', values.experienceYears);
      formData.append('measurementInstructions', values.measurementInstructions);
      formData.append('basicPrice', values.basicPrice);
      formData.append('premiumPrice', values.premiumPrice);
      formData.append('basicDeliveryDays', values.basicDeliveryDays);
      formData.append('premiumDeliveryDays', values.premiumDeliveryDays);

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
        formik.resetForm();
        setGigImage(null);
        setPortfolioImages([]);
      } catch (error) {
        setLoading(false); // Hide loader
        setShowModal(false); // Hide modal
        setErrorMessage(
          error.response?.data?.error || 'Failed to create the gig. Please try again.'
        );
      }
    },
  });

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

    setGigImage(file); // Store the main gig image for uploading
    setErrorMessage(''); // Clear any previous error
  };

  const handlePortfolioImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    const newImages = files.filter(file => validImageTypes.includes(file.type));
    
    if (newImages.length > 0) {
      setPortfolioImages(newImages); // Store portfolio images
      setErrorMessage(''); // Clear previous error
    } else {
      setErrorMessage('Please upload valid image files (jpg, jpeg, png).');
    }
  };

  return (
    <div className="gig-container bg-white w-full mt-2">
      <div className="gig-header">
        <h2>Portfolio Details</h2>
      </div>

      {/* Image Upload for Gig */}
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
              alt="Preview of the gig image"
              className="gig-image-preview w-20"
            />
          ) : (
            ''
          )}
        </div>
      </div>

      {/* Portfolio Images Upload */}
      <div className="gig-portfolio-upload mt-2">
        <label>Upload Work Images: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          multiple
          onChange={handlePortfolioImageChange}
        />
        <div className='portfolio-previews'>
          {portfolioImages.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Portfolio Preview ${index + 1}`}
              className="portfolio-image-preview w-20"
            />
          ))}
        </div>
      </div>

      {/* Title Input */}
      <div className="gig-title mt-2" style={{gap:'10px'}}>
        <label>Gig Title: <span style={{ color: 'red' }}>* </span></label>
        <input
          type="text"
          {...formik.getFieldProps('title')}
          placeholder="Enter gig title"
        />
        {formik.touched.title && formik.errors.title ? (
          <div className="error">{formik.errors.title}</div>
        ) : null}
      </div>

      {/* Service Type Input */}
      <div className="gig-service-type mt-2">
        <label>Service Type: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          {...formik.getFieldProps('serviceType')}
          placeholder="Enter service type"
        />
        {formik.touched.serviceType && formik.errors.serviceType ? (
          <div className="error">{formik.errors.serviceType}</div>
        ) : null}
      </div>

      {/* Description Input */}
      <div className="gig-description mt-2">
        <label>Description: <span style={{ color: 'red' }}>*</span></label>
        <textarea
          {...formik.getFieldProps('measurementInstructions')}
          placeholder="Enter gig description"
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="error">{formik.errors.description}</div>
        ) : null}
      </div>

      {/* Fabric Type Input */}
      <div className="gig-fabric-type mt-2">
        <label>Fabric Type: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          {...formik.getFieldProps('fabricType')}
          placeholder="Enter fabric type"
        />
        {formik.touched.fabricType && formik.errors.fabricType ? (
          <div className="error">{formik.errors.fabricType}</div>
        ) : null}
      </div>

      {/* Basic Price Input */}
      <div className="gig-basic-price mt-2">
        <label>Basic Price (PKR): <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          {...formik.getFieldProps('basicPrice')}
          placeholder="Enter basic price"
          min="1000"
        />
        {formik.touched.basicPrice && formik.errors.basicPrice ? (
          <div className="error">{formik.errors.basicPrice}</div>
        ) : null}
      </div>

      {/* Basic Delivery Days Input */}
      <div className="gig-basic-delivery mt-2">
        <label>Basic Delivery Days: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          {...formik.getFieldProps('basicDeliveryDays')}
          placeholder="Enter basic delivery days"
        />
        {formik.touched.basicDeliveryDays && formik.errors.basicDeliveryDays ? (
          <div className="error">{formik.errors.basicDeliveryDays}</div>
        ) : null}
      </div>

      {/* Premium Price Input */}
      <div className="gig-premium-price mt-2">
        <label>Premium Price (PKR): <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          {...formik.getFieldProps('premiumPrice')}
          placeholder="Enter premium price"
          min="3000"
        />
        {formik.touched.premiumPrice && formik.errors.premiumPrice ? (
          <div className="error">{formik.errors.premiumPrice}</div>
        ) : null}
      </div>

      {/* Premium Delivery Days Input */}
      <div className="gig-premium-delivery mt-2">
        <label>Premium Delivery Days: <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          {...formik.getFieldProps('premiumDeliveryDays')}
          placeholder="Enter premium delivery days"
        />
        {formik.touched.premiumDeliveryDays && formik.errors.premiumDeliveryDays ? (
          <div className="error">{formik.errors.premiumDeliveryDays}</div>
        ) : null}
      </div>

      {/* Submit Button */}
      <button onClick={formik.handleSubmit} className="submit-button mt-3">
        {loading ? (
          <Lottie options={defaultOptions} height={50} width={50} />
        ) : (
          'Submit'
        )}
      </button>

      {/* Error and Success Messages */}
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
    </div>
  );
};

export default GigAdd;
