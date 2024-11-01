import React, { useState, useEffect } from 'react';
import './GigAdd.css'; // Custom CSS file for styling
import Lottie from 'react-lottie';
import loaderAnimation from './Giff/loader_complete.json'; // Path to your loader JSON file
import axios from 'axios'; // Import axios for API requests
import { useFormik } from 'formik';
import * as Yup from 'yup';

const GigAdd = () => {
  const [gigImage, setGigImage] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState([]); // State for portfolio images
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(false); // Loader state
  const [errorMessage, setErrorMessage] = useState(''); // Error message for validation
  const [successMessage, setSuccessMessage] = useState(''); // Success message for gig creation

  // Lottie animation settings
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };


  // Fetch services and materials
  useEffect(() => {
    const fetchServicesAndMaterials = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/services/all',{
          headers: {
            Authorization: `Bearer ${token}`, // Include token if using authentication
          },
        }); // Adjust endpoint as necessary
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setErrorMessage('Failed to fetch services.');
      }
    };

    fetchServicesAndMaterials();
  }, []);


  // Update materials when the selected service changes
  const handleServiceChange = (event) => {
    const serviceId = event.target.value;
    setSelectedService(serviceId);
    const selectedServiceData = services.find(service => service._id === serviceId);
    if (selectedServiceData) {
      setMaterials(selectedServiceData.material); // Set materials based on selected service
      setSelectedMaterials([]); // Reset selected materials when service changes
    } else {
      setMaterials([]);
      setSelectedMaterials([]);
    }
  };

  // Function to handle checkbox change
  const handleMaterialChange = (materialId) => {
    setSelectedMaterials(prevSelected => {
      if (prevSelected.includes(materialId)) {
        // If already selected, remove it
        return prevSelected.filter(id => id !== materialId);
      } else {
        // If not selected, add it
        return [...prevSelected, materialId];
      }
    });
  };

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      serviceType: '',
      fabricType: '',
      experienceYears: '', // Default experience
      measurementInstructions: 'Provide measurements in Inches.',
      basicPrice: '',
      premiumPrice: '',
      basicDeliveryDays: '', // Default value
      premiumDeliveryDays: '', // Default value
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required.'),
      description: Yup.string().min(5, 'Description must be more than 5 words.').required('Description is required.'),
      serviceType: Yup.string().required('Service type is required.'),
      fabricType: Yup.string().required('Material is required.'),
      experienceYears: Yup.number().min(2, 'Minimum 2 Years Experience Required'),
      basicPrice: Yup.number().min(1000, 'Basic price must be at least 1000 PKR.').required('Basic price is required.'),
      premiumPrice: Yup.number()
        .min(3000, 'Premium price must be at least 3000 PKR.')
        .moreThan(Yup.ref('basicPrice'), 'Premium price must be higher than basic price.')
        .required('Premium price is required.'),
      basicDeliveryDays: Yup.number().min(0, 'No Number allowed less than 0').max(20, 'Item Delivery date should not exceed 20 days').required('Basic delivery days are required.'),
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

      // Create FormData for the API request
      const formData = new FormData();
      formData.append('gigImage', gigImage);
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


      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      

      // try {
      //   // Make the API request to create a gig
      //   await axios.post('http://localhost:3001/gigs/add', formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //       Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if using authentication
      //     },
      //   });

      //   setLoading(false); // Hide loader
      //   setSuccessMessage('Your gig has been successfully created!');

      //   // Clear form fields
      //   formik.resetForm();
      //   setGigImage(null);
      //   setPortfolioImages([]);
      // } catch (error) {
      //   setLoading(false); // Hide loader
      //   setErrorMessage(
      //     error.response?.data?.error || 'Failed to create the gig. Please try again.'
      //   );
      // }
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

  return (
    <div className="max-w-4xl mt-3 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Portfolio Details</h2>
  
      {/* Form Fields in a 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Gig Title: <span className="text-red-500">*</span></label>
          <input
            type="text"
            {...formik.getFieldProps('title')}
            placeholder="Enter gig title"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
          ) : null}
        </div>

        {/* Gig Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Upload your Gig Picture: <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
          {gigImage && (
            <img
              src={URL.createObjectURL(gigImage)}
              alt="Gig preview"
              className="mt-4 w-full h-40 object-cover rounded-lg"
            />
          )}
        </div>
  
        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description: <span className="text-red-500">*</span></label>
          <textarea
            {...formik.getFieldProps('description')}
            placeholder="Enter gig description"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
          ) : null}
        </div>
  
        {/* Experience Years Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Experience Years: <span className="text-red-500">(Minimum 2 Years required)*</span>
          </label>
          <input
            type="number"
            {...formik.getFieldProps('experienceYears')}
            placeholder="Enter years of experience"
            min="2" // Ensuring a minimum value of 2
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {formik.touched.experienceYears && formik.errors.experienceYears ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.experienceYears}</div>
          ) : null}
        </div>
        
        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Service Type: <span className="text-red-500">*</span></label>
          <select
            id="serviceType"
            name="serviceType"
            onChange={(e) => {
              formik.handleChange(e);
              handleServiceChange(e); // Update materials based on service selection
            }}
            value={formik.values.serviceType}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="" className='text-ms font-medium text-gray-400'>Select a service</option>
            {services.map(service => (
              <option className='text-ms font-medium text-gray' key={service._id} value={service._id}>{service.name}</option>
            ))}
          </select>
          {formik.touched.serviceType && formik.errors.serviceType ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.serviceType}</div>
          ) : null}
        </div>

        {/* Materials Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Select Materials: <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="mt-1 p-2 bg-white text-gray-400 text-sm block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {selectedMaterials.length > 0 ? `${selectedMaterials.length} selected` : 'Select materials'}
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="max-h-60 m-0 p-0 overflow-y-auto">
                  {materials.map(material => (
                    <li key={material._id} className="flex p-2">
                    <input
                      type="checkbox"
                      id={`material-${material._id}`} // Ensure this ID matches the label
                      value={material._id}
                      checked={selectedMaterials.includes(material._id)}
                      onChange={() => handleMaterialChange(material._id)}
                      className="mr-2"
                    />
                    <label 
                      htmlFor={`material-${material._id}`} 
                      className="cursor-pointer text-ms font-normal m-0">
                      {material.name}
                    </label>
                  </li>
                  
                  ))}
                </ul>
              </div>
            )}
          </div>
          {selectedMaterials.length === 0 && formik.touched.fabricType && (
            <div className="text-red-500 text-sm mt-1">At least one material must be selected.</div>
          )}
        </div>
  
        {/* Basic Price Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Basic Price (PKR): <span className="text-red-500">*</span></label>
          <input
            type="number"
            {...formik.getFieldProps('basicPrice')}
            placeholder="Enter basic price"
            min="1000"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {formik.touched.basicPrice && formik.errors.basicPrice ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.basicPrice}</div>
          ) : null}
        </div>
  
        {/* Basic Delivery Days Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Basic Delivery Days: <span className="text-red-500">*</span></label>
          <input
            type="number"
            {...formik.getFieldProps('basicDeliveryDays')}
            placeholder="Enter basic delivery days"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {formik.touched.basicDeliveryDays && formik.errors.basicDeliveryDays ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.basicDeliveryDays}</div>
          ) : null}
        </div>
  
        {/* Premium Price Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Premium Price (PKR): <span className="text-red-500">*</span></label>
          <input
            type="number"
            {...formik.getFieldProps('premiumPrice')}
            placeholder="Enter premium price"
            min="3000"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {formik.touched.premiumPrice && formik.errors.premiumPrice ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.premiumPrice}</div>
          ) : null}
        </div>
  
        {/* Premium Delivery Days Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Premium Delivery Days: <span className="text-red-500">*</span></label>
          <input
            type="number"
            {...formik.getFieldProps('premiumDeliveryDays')}
            placeholder="Enter premium delivery days"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {formik.touched.premiumDeliveryDays && formik.errors.premiumDeliveryDays ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.premiumDeliveryDays}</div>
          ) : null}
        </div>
      </div>
      {/* Measurement Instructions Input */}
      <div className='mt-2'>
          <label className="block text-sm font-medium text-gray-700">Measurement Instructions</label>
          <textarea
            {...formik.getFieldProps('measurementInstructions')}
            placeholder="Enter measurement instructions"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          {formik.touched.measurementInstructions && formik.errors.measurementInstructions ? (
            <div className="text-red-500 text-sm mt-1">{formik.errors.measurementInstructions}</div>
          ) : null}
        </div>
  
      {/* Submit Button */}
      <div className="mt-6">
        <button
          onClick={formik.handleSubmit}
          className="w-full md:w-auto px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {loading ? <Lottie options={defaultOptions} height={30} width={30} /> : 'Submit'}
        </button>
      </div>
  
      {/* Error and Success Messages */}
      {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
      {successMessage && <div className="mt-4 text-green-500">{successMessage}</div>}
    </div>
  );
  
};

export default GigAdd;