import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditGigModal = ({ gig, onClose, fetchGig }) => {
  const [updatedGig, setUpdatedGig] = useState({ ...gig });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const backendUrl = "http://localhost:3001/";
  const token = localStorage.getItem('token');

  const handleInputChange = (e, field) => {
    const value = field === 'gigImage' ? e.target.files[0] : e.target.value;
    setUpdatedGig((prev) => ({ ...prev, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' })); // Clear error for this field
  };

  const validateInputs = () => {
    const newErrors = {};
    alert(updatedGig._id);

    // Validate title
    if (updatedGig.title && typeof updatedGig.title !== 'string') {
      newErrors.title = 'Title must be a valid string.';
    }

    // Validate experience
    const experience = parseInt(updatedGig.experience, 10);
    if (!experience || experience < 2 || experience > 60) {
      newErrors.experience = 'Experience must be a number between 2 and 60.';
    }

    // Validate description
    if (updatedGig.description && updatedGig.description.length > 200) {
      newErrors.description = 'Description can be a maximum of 200 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveGig = async () => {
    if (!validateInputs()) {
        alert('Validation Failed...');
      return; // Exit if validation fails
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", updatedGig.title);
    formData.append("experience", updatedGig.experience);
    formData.append("description", updatedGig.description);
    if (updatedGig.gigImage instanceof File) {
      formData.append("gigImage", updatedGig.gigImage);
    }
    console.log(formData.entries());
    try {
      const response= await axios.put(`${backendUrl}gigs/update/${updatedGig._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if(response.status === 200 || response.status === 201){
        alert('Gig Updated');
      fetchGig();
      }
      else{
        alert(response.status);
      }
    } catch (error) {
      console.error("Error updating gig:", error);
      alert('Error Occured.....');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Gig Details</h2>
          <button onClick={onClose} className="bg-transparent text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <label className="block mb-2">Gig Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleInputChange(e, 'gigImage')}
          className="border-1 p-1 rounded w-full mb-4"
        />

        <label className="block mb-2">Title:</label>
        <input
          type="text"
          value={updatedGig.title || ''}
          onChange={(e) => handleInputChange(e, 'title')}
          className="w-full p-2 border rounded mb-2"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <label className="block mb-2">Experience (years):</label>
        <input
          type="number"
          value={updatedGig.experience || ''}
          onChange={(e) => handleInputChange(e, 'experience')}
          className="w-full p-2 border rounded mb-2"
        />
        {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}

        <label className="block mb-2">Description:</label>
        <textarea
          value={updatedGig.description || ''}
          onChange={(e) => handleInputChange(e, 'description')}
          maxLength={200} // Limit to 200 characters
          className="w-full p-2 border rounded mb-2"
        />
        <p className="text-sm text-gray-500">
          {200 - (updatedGig.description?.length || 0)} characters remaining
        </p>
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

        <div className="flex justify-end mt-4">
          <button onClick={handleSaveGig} className="bg-blue-500 text-white px-4 py-2 rounded mr-2" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGigModal;
