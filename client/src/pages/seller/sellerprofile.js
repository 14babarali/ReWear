import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import './sellerprofile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import undereview from '../../assests/under_review.gif';

const SellerProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [cnicFrontImage, setCnicFrontImage] = useState(null);
  const [cnicBackImage, setCnicBackImage] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState('profile');

   // Flag to track if CNIC is already uploaded
   const [cnicUploaded, setCnicUploaded] = useState(false);

  const imageUrl = `http://localhost:3001/uploads/${profileImage}`;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    setUser(storedUser);
    setName(storedUser.profile.name);
    setEmail(storedUser.email);
    setPhone(storedUser.profile.phone);
    setAddresses(storedUser.profile.addresses || []);
    setProfileImage(storedUser.profile.profilePicture);
    setCnicFrontImage(storedUser.profile.cnicfront);
    setCnicBackImage(storedUser.profile.cnicback);

    if (storedUser.profile.cnicfront && storedUser.profile.cnicback) {
      setCnicUploaded(true);
    }

    if (storedUser.role === 'Tailor') {
      navigate('/tailor');
    } else if (storedUser.role === 'Buyer') {
      navigate('/');
    }
  }, [navigate]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    } else {
      alert('Please select an image file.');
      event.target.value = null;
    }
  };

  const handleCnicFrontChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCnicFrontImage(file);
    } else {
      alert('Please select a valid image file.');
      event.target.value = null;
    }
  };

  const handleCnicBackChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCnicBackImage(file);
    } else {
      alert('Please select a valid image file.');
      event.target.value = null;
    }
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
    setAddresses(updatedAddresses);
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, { street: '', city: '', postalcode: '' }]);
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^[0-9]+$/;
    const addressRegex = /^[a-zA-Z0-9\s,.:#'/-]+$/;
  
    if (!nameRegex.test(name)) {
      toast.error('Name should not contain special characters or numbers');
      return;
    }
  
    if (name.length > 30) {
      toast.error('Name should be less than 30 characters.');
      return;
    }
  
    if (!phoneRegex.test(phone)) {
      toast.error('Phone should contain only numbers');
      return;
    }
  
    if (!addresses.every(addr => addressRegex.test(addr.street) && addressRegex.test(addr.city))) {
      toast.error('Addresses contain invalid characters');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('addresses', JSON.stringify(addresses));

      if (selectedImage) {
        formData.append('profilePicture', selectedImage);
      }
      if (cnicFrontImage) {
        formData.append('cnicfront', cnicFrontImage);
      }
      if (cnicBackImage) {
        formData.append('cnicback', cnicBackImage);
      }
  
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3001/api/editprofile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 200) {
        toast.success("Profile updated successfully");

        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        toast.error('Error updating the user profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };
  

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    try {
      const data = { currentPassword, newPassword };
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:3001/api/changepassword', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        navigate('/sellerprofile');
      } else {
        toast.error(response.statusText);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
<div className="sellerprofile-container-fluid d-flex h-100 p-0">
  <ToastContainer
    position='top-center'
    hideProgressBar={true}
    newestOnTop={true}
    rtl={false}
    theme='light'
    transition={Bounce}
    limit={4}
  />
  <div className="profile-container mt-5 mb-5">
    {/* Tabs Navigation */}
    <div className="tabs">
      <button
        className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        {t('profile_details')}
      </button>
      <button
        className={`tab-button ${activeTab === 'edit' ? 'active' : ''}`}
        onClick={() => setActiveTab('edit')}
      >
        {t('edit_profile')}
      </button>
      <button
        className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
        onClick={() => setActiveTab('password')}
      >
        {t('change_password')}
      </button>
    </div>

    {/* Tabs Content */}
    <div className="tab-content">
      {/* Profile Details Tab */}
      {activeTab === 'profile' && user && (
        <div className="profile-info mt-4">
          {/* Profile Image */}
          <div className="seller-profile-image mr-6">
            <img
              src={imageUrl}
              alt="Profile"
            />
          </div>
          
          {/* Profile Details */}
          <div className="profile-details-info">
            <p className="text-lg  text-gray-800 mb-2">
              <strong>{t('name')}:</strong> {user.profile.name}
            </p>
            <p className="text-lg  text-gray-800 mb-2">
              <strong>{t('email')}:</strong> {user.email}
            </p>
            <p className="text-lg  text-gray-800 mb-2">
              <strong>{t('phone')}:</strong> {user.profile.phone}
            </p>
            
            {/* Addresses */}
            {user.profile.addresses && user.profile.addresses.length > 0 && (
              <div className="addresses mb-2">
                <p className="text-lg  text-gray-800">
                  <strong>{t('addresses')}:</strong>
                </p>
                <ul className="list-disc list-inside">
                  {user.profile.addresses.map((address, index) => (
                    <li key={index} className="text-gray-700 mb-2">
                      {address.street}, {address.city}, {address.postalcode}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>    
      )}

      {/* Edit Profile Tab */}
      {activeTab === 'edit' && (
        <div className="edit-profile">
          <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">{t('name')}</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t('email')}</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">{t('phone')}</label>
                  <ReactPhoneInput
                    defaultCountry="pk"
                    value={phone}
                    onChange={(value) => setPhone(value)}
                    onlyCountries={['pk']}
                  />
                </div>
                {addresses.map((address, index) => (
                  <div className="form-group" key={index}>
                    <label>{t('address')}</label>
                    <input
                      type="text"
                      name={t('street')}
                      placeholder={t('street')}
                      value={address.street}
                      onChange={(e) => handleAddressChange(index, e)}
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder={t('city')}
                      value={address.city}
                      onChange={(e) => handleAddressChange(index, e)}
                    />
                    <input
                      type="text"
                      name="postalcode"
                      placeholder={t('Postal Code')}
                      value={address.postalcode}
                      onChange={(e) => handleAddressChange(index, e)}
                    />
                    <button className="delete" type="button" onClick={() => handleRemoveAddress(index)} >
                      <FontAwesomeIcon icon={faTrash}/>
                      {t('')}
                    </button>
                  </div>
                ))}
                <div className="button-group">
                  <button type="button" onClick={handleAddAddress}>
                    <FontAwesomeIcon icon={faPlusCircle}/>
                    {t('address')}
                  </button>
                </div>
                <div className="form-group mt-4">
                  <label htmlFor="profilePicture">{t('profile_picture')}</label>
                  <input type="file" id="profilePicture" onChange={handleImageChange} />
                </div>
                {/* CNIC Upload Section */}
                  {!cnicUploaded ? (
                    <>
                      <div className="form-group">
                        <label htmlFor="cnicFront">{t('cnic_front')}</label>
                        <input type="file" id="cnicFront" onChange={handleCnicFrontChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="cnicBack">{t('cnic_back')}</label>
                        <input type="file" id="cnicBack" onChange={handleCnicBackChange} />
                      </div>
                    </>
                  ) : (
                    <div className="cnic-status mb-4">
                      <p>{t('cnic_reviewed')}</p>
                      <img src={undereview} alt="loading icon" />
                    </div>
                  )}
                <div className="form-group">
                  <button type="submit">{t('save_changes')}</button>
                </div>
          </form>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="change-password">
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="currentPassword">{t('current_password')}</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">{t('new_password')}</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">{t('confirm_new_password')}</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <div className="show-password">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              &nbsp;
              <label htmlFor="showPassword">{t('show_password')}</label>
            </div>
            <div className="form-group">
              <button type="submit">{t('change_password')}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  </div>
</div>
  );
};

export default SellerProfilePage;
