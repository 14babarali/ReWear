import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DataMeasurement = () => {
  const location = useLocation();
  const initialMeasurements = location.state?.measurements?.shirt
    ? { shirt: location.state.measurements.shirt, trouser: {}, shirtChecked: false, trouserChecked: false }
    : { shirt: {}, trouser: {}, shirtChecked: false, trouserChecked: false };

  // Retrieve data from localStorage
  const gigId = localStorage.getItem("gigId") || 'Not Selected';
  const selectedService = JSON.parse(localStorage.getItem("selectedService")) || 'Not Selected';
  const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan")) || 'Not Selected';

  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [userCategory, setUserCategory] = useState('male');
  const [fitType, setFitType] = useState(''); 
  const [description, setDescription] = useState(''); 
  const [picture, setPicture] = useState(null); 
  const [errorMessage, setErrorMessage] = useState(''); 

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);
  const navigate = useNavigate();

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setMeasurements({
      ...measurements,
      [section]: {
        ...measurements[section],
        [name]: value
      }
    });
  };

  const handleCheckboxChange = (e, section) => {
    const { checked } = e.target;
    setMeasurements({
      ...measurements,
      [`${section}Checked`]: checked
    });
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setPicture(file);
      setErrorMessage('');
    } else {
      setPicture(null);
      setErrorMessage('Only .png or .jpeg files are allowed.');
    }
  };

  const resetMeasurements = () => {
    setMeasurements({ shirt: {}, trouser: {}, shirtChecked: false, trouserChecked: false });
    setFitType('');
    setDescription('');
    setPicture(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const storedUser = localStorage.getItem('user');
    const userData = JSON.parse(storedUser);
    if (!userData) {
      alert('Please Login first');
      return;
    }
  
    const isAnyShirtFieldEmpty = Object.values(measurements.shirt).some(value => value === '');
    if (isAnyShirtFieldEmpty) {
      alert('Please fill in all the shirt measurement fields before submitting.');
      return;
    }
  
    const wordCount = description.trim().split(/\s+/).length;
    if (!measurements.shirtChecked && !measurements.trouserChecked) {
      alert("Please confirm at least one measurement (Shirt or Trouser) before submitting.");
      return;
    }
  
    if (wordCount < 5) {
      alert('Description must be at least 5 words.');
      return;
    }
  
    if (!picture) {
      alert('Please upload a valid picture.');
      return;
    }
  
    // Prepare the data structure to include the takensize details
    const measurementData = {};
    if (measurements.shirtChecked) {
      measurementData.shirt = {
        type: 'shirt',
        takensize: measurements.shirt, // Include all shirt measurements in takensize
        confirmed: true,
      };
    }
    if (measurements.trouserChecked) {
      measurementData.trouser = {
        type: 'trouser',
        takensize: measurements.trouser, // Include all trouser measurements in takensize
        confirmed: true,
      };
    }
  
    try {
      // Prepare form data to be sent to the backend
      const formData = new FormData();
      formData.append("buyerId", userData._id);
      formData.append("gigId", gigId);
      formData.append("userCategory", userCategory);
      formData.append("fitType", fitType);
      formData.append("description", description);

      // Stringify the full measurementData structure
      const measurementsJSON = JSON.stringify(measurementData);
      formData.append("measurements", measurementsJSON);
      formData.append("picture", picture); // add the picture file
      
      console.log("Form Data:", Array.from(formData.entries())); 

      // Send data to the backend endpoint
      const response = await axios.post('http://localhost:3001/tailoring-requests/create', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // replace "token" with your actual token key if needed
        },
      });

      if(response.status === 200 || response.status === 201){
        // Clear previous values from localStorage
        localStorage.removeItem("gigId");
        localStorage.removeItem("selectedService");
        localStorage.removeItem("selectedPlan");

        console.log("Measurement request created:", response.data);
        navigate('/buyer/RequestView', {
          state: {
            request: response.data,
          }
        });

      }
      else{
        alert(response.status);
      }
  
      
    } catch (error) {
      console.error("Error submitting measurement request:", error);
      alert("An error occurred while submitting the request. Please try again.");
    }
  };
  

  const renderFitOptions = () => (
    <select 
      value={fitType} 
      onChange={(e) => setFitType(e.target.value)} 
      className="w-full p-2 border border-gray-300 rounded-md text-sm"
    >
      <option value="classic fit">Classic Fit</option>
      <option value="slim fit">Slim Fit</option>
      <option value="extreme slim fit">Extreme Slim Fit</option>
    </select>
  );

  return (
    <div className="max-w-2xl mx-auto p-8 mb-5 bg-white shadow-md rounded-md">
      <div>
        <h2 className="text-2xl font-semibold text-center text-gray-800">Measurements</h2>
        {/* <h4 className='text-center'>Fitting Type, Description, and Picture</h4> */}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className='flex gap-5' style={{alignItems:'center'}}>
          <div className='flex gap-2' style={{alignItems:'center'}}>
            <label className="block text-base mb-0 font-normal text-gray-700">User:</label>
            <select value={userCategory} disabled className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-sm">
              <option value="male">Male</option>
            </select>
          </div>

          <div className='flex' style={{alignItems:'center'}}>
            <label className="text-base font-normal text-center mb-0 text-gray-700 w-full">Fitting Type:</label>
            {renderFitOptions()}
          </div>
        </div>
        <div>
          <span className='text-sm font-normal'>
          <p>Selected Service: {selectedService.name}</p>
          <p>Plan: {selectedPlan.name}</p>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className='border-1 p-2 rounded'>
            <h5 className="text-lg text-center font-medium mb-3 text-gray-700">Shirt Measurements</h5>
            <label className="flex items-center space-x-2 mb-5 text-sm text-gray-600">
              <input
                type="checkbox"
                name="shirtChecked"
                checked={measurements.shirtChecked}
                onChange={(e) => handleCheckboxChange(e, 'shirt')}
                className="h-4 w-4"
              />
              <span className='text-sm font-normal text-red-400'>Confirm Shirt Measurements</span>
            </label>
            {['Neck', 'Shoulder Width', 'Chest Bust', 'Waist', 'Sleeve Length', 'Bicep', 'Wrist', 'ShirtLength'].map(field => (
              <label key={field} className="block mb-4 text-sm font-normal text-gray-700">
                {field.replace(/([A-Z])/g, ' $1')}:
                <input
                  type="number"
                  name={field}
                  value={measurements.shirt[field] || ''}
                  onChange={(e) => handleInputChange(e, 'shirt')}
                  disabled={!measurements.shirtChecked}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                />
              </label>
            ))}
          </div>
          <div className='border-1 p-2 rounded'>
            <h5 className="text-lg text-center font-medium mb-3 text-gray-700">Trouser Measurements</h5>
            <label className="flex items-center space-x-2 mb-5 text-sm text-gray-600">
              <input
                type="checkbox"
                name="trouserChecked"
                checked={measurements.trouserChecked}
                onChange={(e) => handleCheckboxChange(e, 'trouser')}
                className="h-4 w-4"
              />
              <span className='text-sm text-red-400 font-normal'>Confirm Trouser Measurements</span>
            </label>
            {['Waist', 'Hip', 'InSeam', 'OutSeam', 'Thigh', 'Knee', 'FrontRise', 'BackRise', 'LegOpening'].map(field => (
              <label key={field} className="block mb-4 text-sm font-normal text-gray-700">
                {field.replace(/([A-Z])/g, ' $1')}:
                <input
                  type="number"
                  name={field}
                  value={measurements.trouser[field] || ''}
                  onChange={(e) => handleInputChange(e, 'trouser')}
                  disabled={!measurements.trouserChecked}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-lg font-medium mb-2 text-gray-700">Description</h5>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Write a description (at least 5 words)"
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div>
          <h5 className="text-lg font-medium mb-2 text-gray-700">Upload Design</h5>
          <input 
            type="file" 
            accept=".png, .jpeg" 
            onChange={handlePictureChange} 
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          />
          {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">Submit</button>
          <button type="button" onClick={resetMeasurements} className="px-6 py-2 bg-gray-400 text-white rounded-md text-sm font-medium">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default DataMeasurement;
