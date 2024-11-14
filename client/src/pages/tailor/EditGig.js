import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditGigModal = ({ gig, onClose, fetchGig }) => {
  const [updatedGig, setUpdatedGig] = useState({ ...gig });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const backendUrl = "http://localhost:3001/";
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem('token');

  // Debug initial values
  console.log("Initial gig data:", gig);
  console.log("Initial token:", token);
  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ur' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const handleInputChange = (e, field) => {
    const value = field === 'gigImage' ? e.target.files[0] : e.target.value;
    console.log(`Input change on field: ${field}, New value:`, value);
    
    setUpdatedGig((prev) => ({ ...prev, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' })); // Clear error for this field
  };

  const validateInputs = () => {
    const newErrors = {};
    console.log("Validating inputs:", updatedGig);

    // Validate title
    if (updatedGig.title && typeof updatedGig.title !== 'string') {
      newErrors.title = 'Title must be a valid string.';
    }

    // Validate experience
    const experience = parseInt(updatedGig.experience, 10);
    if (!experience || experience < 2 || experience > 60) {
      newErrors.experience = t('Experience must be a number between 2 and 60.');
    }

    // Validate description
    if (updatedGig.description && updatedGig.description.length > 200) {
      newErrors.description = t('Description can be a maximum of 200 characters.');
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveGig = async () => {
    console.log("Save button clicked, validating inputs...");
    if (!validateInputs()) {
      console.log("Validation failed.");
      alert('Validation Failed...');
      return; // Exit if validation fails
    }

    console.log("Validation passed. Preparing form data...");
    setLoading(true);
    const formData = new FormData();
    formData.append("title", updatedGig.title);
    formData.append("experience", updatedGig.experience);
    formData.append("description", updatedGig.description);
    if (updatedGig.gigImage instanceof File) {
      formData.append("gigImage", updatedGig.gigImage);
    }

    // Log the form data values to ensure they're correct
    for (let [key, value] of formData.entries()) {
      console.log(`Form Data - ${key}:`, value);
    }

    try {
      console.log("Sending PUT request to API...");
      const response = await axios.put(`http://localhost:3001/gigs/update/${updatedGig._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
     

      });
      console.log('Preparing to send PUT request with data:', formData);

      console.log("API response:", response);
      if (response.status === 200 || response.status === 201) {
        alert('Gig Updated');
        console.log("Gig update successful. Fetching updated gigs...");
        fetchGig();  // Refresh the gig data after update
      } else {
        console.log("Unexpected response status:", response.status);
        alert(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating gig:", error);
      alert('Error Occurred during update.');
    } finally {
      setLoading(false);
      console.log("Closing modal...");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('Gig Edit Gig Details:')}</h2>
          <button onClick={onClose} className="bg-transparent text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <label className="block mb-2">{t('Gig Image:')}</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleInputChange(e, 'gigImage')}
          className="border-1 p-1 rounded w-full mb-4"
        />

        <label className="block mb-2">{t('Title:')}</label>
        <input
          type="text"
          value={updatedGig.title || ''}
          onChange={(e) => handleInputChange(e, 'title')}
          className="w-full p-2 border rounded mb-2"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <label className="block mb-2">{t('Experience (years):')}</label>
        <input
          type="number"
          value={updatedGig.experience || ''}
          onChange={(e) => handleInputChange(e, 'experience')}
          className="w-full p-2 border rounded mb-2"
        />
        {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}

        <label className="block mb-2">{t('Description:')}</label>
        <textarea
          value={updatedGig.description || ''}
          onChange={(e) => handleInputChange(e, 'description')}
          maxLength={200} // Limit to 200 characters
          className="w-full p-2 border rounded mb-2"
        />
        <p className="text-sm text-gray-500">
          {200 - (updatedGig.description?.length || 0)} {t('characters remaining')}
        </p>
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

        <div className="flex justify-end mt-4">
          <button onClick={handleSaveGig} className="bg-blue-500 text-white px-4 py-2 rounded mr-2" disabled={loading}>
            {loading ? 'Saving...' : t('Save')}
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
            {t('Cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGigModal;
