import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const AddService = () => {
  const location = useLocation();
  const { service } = location.state || {}; // Get the service object

  // Initialize state for name and gender separately
  const [name, setName] = useState(service ? service.name.split(' (')[0] : ''); // Extract name before " ("
  const [gender, setGender] = useState(service ? service.name.split(' (')[1]?.replace(')', '') : ''); // Extract gender from the name
  const [material, setMaterial] = useState(service ? service.material : []);
  const [materialInput, setMaterialInput] = useState('');
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

  const handleMaterialChange = (e) => {
    const input = e.target.value;
    if (validateAlphabetOnly(input) || input === '') {
      setMaterialInput(input);
      setError('');
    } else {
      setError('Material must contain alphabets only.');
    }
  };

  const addMaterial = () => {
    if (materialInput.trim()) {
      setMaterial([...material, { name: materialInput.trim() }]);
      setMaterialInput('');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setError('');
    setSuccessMessage('');

    // Combine name and gender for submission
    const formattedName = `${name} (${gender})`;

    if (!formattedName.trim() || material.length === 0 || !gender) {
      setError('Validation Error: Name is required, must have at least one material, and gender must be selected.');
      return;
    }

    try {
      if (service) {
        // Edit existing service
        await axios.put(`http://localhost:3001/services/update/${service._id}`, { name: formattedName, material }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage('Service updated successfully!');
      } else {
        // Add new service
        await axios.post('http://localhost:3001/services/add', { name: formattedName, material }, {
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
            <label className="block text-gray-700 text-left">Gender</label>
            <div className="flex items-center">
            <label className="mr-4 flex items-center">
                <input
                type="radio"
                value="Mens"
                checked={gender === 'Mens'}
                onChange={() => setGender('Mens')}
                className="mr-1"
                />
                Mens
            </label>
            <label className="mr-4 flex items-center">
                <input
                type="radio"
                value="Womens"
                checked={gender === 'Womens'}
                onChange={() => setGender('Womens')}
                className="mr-1"
                />
                Womens
            </label>
            <label className="mr-4 flex items-center">
                <input
                type="radio"
                value="Childs"
                checked={gender === 'Childs'}
                onChange={() => setGender('Childs')}
                className="mr-1"
                />
                Childs
            </label>
            </div>
            {gender === '' && <p className="text-red-500 text-left">Please select a gender.</p>}
        </div>
        <div>
            <label className="block text-gray-700 text-left">Materials</label>
            <div className="flex items-center">
            <input
                type="text"
                value={materialInput}
                onChange={handleMaterialChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Add material"
            />
            <button
                type="button"
                onClick={addMaterial}
                className="ml-2 bg-blue-500 text-white rounded px-4 py-2"
            >
                Add
            </button>
            </div>
            <ul className="mt-2">
            {material.map((mat, index) => (
                <li key={index} className="flex justify-between items-center mb-2 rounded border-1 p-1">
                <span>{mat.name}</span>
                <button
                    type="button"
                    onClick={() => setMaterial(material.filter((_, i) => i !== index))}
                    className="bg-white text-red-500 rounded ml-2"
                >
                    <FontAwesomeIcon icon={faTrash}/>
                </button>
                </li>
            ))}
            </ul>
        </div>
        <div className="flex justify-center mt-4">
            <button type="submit" className="bg-green-500 text-white rounded px-4 py-2">
                {service ? 'Update Service' : 'Add Service'}
            </button>
            <button
                className='bg-gray-500 text-white rounded px-4 py-2 ml-4'
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
