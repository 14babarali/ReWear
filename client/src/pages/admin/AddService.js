import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AddService = () => {
  const location = useLocation();
  const { service } = location.state || {}; // Get the service object

  const [name, setName] = useState(service ? service.name : '');
  const [description, setDescription] = useState(service ? service.description : '');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateAlphabetOnly = (value) => /^[A-Za-z\s]+$/.test(value);

  const handleNameChange = (e) => {
    const input = e.target.value;
    if (validateAlphabetOnly(input) || input === '') {
      setName(input);
      setError('');
    } else {
      setError('Name must contain alphabets only.');
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setError('');
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setError('');
    setSuccessMessage('');

    if (!name.trim() || !description.trim()) {
      setError('Validation Error: Both name and description are required.');
      return;
    }

    try {
      if (service) {
        // Edit existing service
        await axios.put(`http://localhost:3001/services/update/${service._id}`, { name, description }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage('Service updated successfully!');
      } else {
        // Add new service
        await axios.post('http://localhost:3001/services/add', { name, description }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage('Service added successfully!');
      }
      setTimeout(() => {
        navigate('/admin/services');
      }, 1500);
    } catch (error) {
      console.error('Error saving service:', error);
      setError('Failed to save service. Please try again.');
    }
  };

  return (
    <div className="flex flex-col container mx-auto mt-0 p-2 justify-center">
      <h2 className="text-2xl text-center font-bold mb-2 mt-0">{service ? 'Edit Service' : 'Add New Service'}</h2>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <form onSubmit={handleAddService} className="d-flex m-0 flex-col bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-left" htmlFor="name">Service Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-left" htmlFor="description">Service Description</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows="4"
            required
          />
        </div>
        <div className="flex justify-center mt-4">
          <button type="submit" className="bg-green-500 text-white rounded px-4 py-2">
            {service ? 'Update Service' : 'Add Service'}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white rounded px-4 py-2 ml-4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;
