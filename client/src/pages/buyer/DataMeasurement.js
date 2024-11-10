import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DataMeasurement.css';

const DataMeasurement = () => {
  const location = useLocation();
  const initialMeasurements = location.state?.measurements || {};
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeasurements({ ...measurements, [name]: value });
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
    // Reset measurements to provided default values
    setMeasurements({
      neck: '',         
      shoulderWidth: '', 
      chestBust: '',     
      waist: '',          
      sleeveLength: '',   
      bicep: '',         
      wrist: '',         
      shirtLength: ''    
    });
    setFitType('');
    setDescription('');
    setPicture(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isAnyFieldEmpty = Object.values(measurements).some(value => value === '');
    const wordCount = description.trim().split(/\s+/).length;

    if (isAnyFieldEmpty) {
      alert('Please fill in all the measurement fields before submitting.');
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

    // Navigate to the buyer page with measurements, description, and picture
    navigate('/buyer/TailorSearch', { state: { measurements, userCategory, fitType, description, picture } });
  };

  const renderFitOptions = () => {
    return (
      <div className="fit-options-custom">
        <label>
          <input
            type="radio"
            name="fitType"
            value="classic fit"
            checked={fitType === 'classic fit'}
            onChange={(e) => setFitType(e.target.value)}
          />
          Classic Fit
        </label>
        <label>
          <input
            type="radio"
            name="fitType"
            value="slim fit"
            checked={fitType === 'slim fit'}
            onChange={(e) => setFitType(e.target.value)}
          />
          Slim Fit
        </label>
        <label>
          <input
            type="radio"
            name="fitType"
            value="extreme slim fit"
            checked={fitType === 'extreme slim fit'}
            onChange={(e) => setFitType(e.target.value)}
          />
          Extreme Slim Fit
        </label>
      </div>
    );
  };

  return (
    <div className="form-container-custom">
      <h2>Edit Measurement, Fitting Type, Description, and Picture</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group-custom">
          <label>
            User:
            <select value={userCategory} disabled style={{ display: 'block', width: '100%' }}>
              <option value="male">Male</option>
            </select>
          </label>
        </div>

        <div className="form-group-custom">
          <h5>Fitting Type</h5>
          {renderFitOptions()}
        </div>

        <div className="form-group-custom">
          <h5>Measurements</h5>
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            * This measurement could be wrong. Please ensure accuracy while submitting.
          </p>
          <label>
            Neck:
            <input
              type="number"
              name="neck"
              value={measurements.neck || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Shoulder Width:
            <input
              type="number"
              name="shoulderWidth"
              value={measurements.shoulderWidth || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Chest/Bust:
            <input
              type="number"
              name="chestBust"
              value={measurements.chestBust || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Waist:
            <input
              type="number"
              name="waist"
              value={measurements.waist || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Sleeve Length:
            <input
              type="number"
              name="sleeveLength"
              value={measurements.sleeveLength || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Bicep:
            <input
              type="number"
              name="bicep"
              value={measurements.bicep || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Wrist:
            <input
              type="number"
              name="wrist"
              value={measurements.wrist || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Shirt Length:
            <input
              type="number"
              name="shirtLength"
              value={measurements.shirtLength || ''}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div className="form-group-custom">
          <h5>Description</h5>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Write a description (at least 5 words)"
            rows="3"
            style={{ width: '100%',  border: '1px solid black' }}
          />
        </div>

        <div className="form-group-custom">
          <h5>Upload Design</h5>
          <input type="file" accept=".png, .jpeg" onChange={handlePictureChange} />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>

        <div className="button-group-custom">
          <button type="submit" className="submit-button-custom">
            Submit
          </button>
          <button type="button" className="reset-button-custom" onClick={resetMeasurements}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataMeasurement;
