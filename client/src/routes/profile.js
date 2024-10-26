import React, { useState, useEffect } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import './stylesheet/profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const imageUrl = `http://localhost:3001/uploads/${profileImage}`;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setName(userData.profile.name);
        setEmail(userData.email);
        setPhone(userData.profile.phone);
        setAddresses(userData.profile.addresses || []);
        setProfileImage(userData.profile.profilePicture);
      } else {
        navigate('/');
        return;
      }
    };

    fetchUser();
  }, [navigate]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    } else {
      alert('Please select an image file.');
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
    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^[0-9]+$/;
    const addressRegex = /^[a-zA-Z0-9\s,.:#'/-]+$/;

    if (!nameRegex.test(name)) {
      toast.error('Name should not contain special characters or numbers');
      return;
    }

    if (name.length > 20) {
      toast.error('Name should be less than 20 characters.');
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

      const token = localStorage.getItem('token');

      const response = await axios.put('http://localhost:3001/api/editprofile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
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
      } else {
        toast.error(response.statusText);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <div className="profile-container mt-5 mb-5">
      <ToastContainer 
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme='dark'
        transition={Bounce}
        limit={3}
      />
      {user && (
        <>
          <div className="profile-card-header">
            <h4>Profile</h4>
          </div>
          <div className="profile-card-body">
            {/* User Info Section */}
            <section className="user-info-section">
              <div className="user-info-row">
                <div className="user-info-image text-center">
                  <img 
                    src={imageUrl} 
                    alt={user?.profile?.profilePicture || "Profile Picture"} 
                    className="user-profile-picture"
                  />
                </div>
                <div className="user-info-details">
                  <h4 className="user-name">
                    {user?.profile?.name || "No Name Provided"}
                  </h4>

                  {/* Email */}
                  <div className="user-info-item">
                    <p><strong>Email:</strong> {user?.email || "No Email Provided"}</p>
                  </div>

                  {/* Phone */}
                  <div className="user-info-item">
                    <p><strong>Phone:</strong> {user?.profile?.phone || "No Phone Provided"}</p>
                  </div>

                  {/* Address */}
                  <div className="user-info-item">
                    <p><strong>Address:</strong></p>
                    <ul className="user-address-list">
                      {(user?.profile?.addresses || []).length > 0 ? (
                        user.profile.addresses.map((address, index) => (
                          <li key={index}>
                            {address.street}, {address.city}, {address.postalcode}
                          </li>
                        ))
                      ) : (
                        <li>No Addresses Provided</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            <hr/>
            {/* Edit Profile Section */}
            <section className="edit-profile mt-4">
              <button className="btn btn-primary" onClick={() => setEditProfileOpen(!editProfileOpen)}>
                {editProfileOpen ? 
                  <><FontAwesomeIcon icon={faChevronUp} /> Close Edit Profile</> : 
                  <><FontAwesomeIcon icon={faChevronDown} /> Edit Profile</>}
              </button>
              {editProfileOpen && (
                <form onSubmit={handleSubmit} className="mt-3">
                  <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      value={email} 
                      readOnly 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <br/>
                    <ReactPhoneInput
                      country={'us'}
                      value={phone}
                      onChange={setPhone}
                      onlyCountries={['pk']}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: true
                      }}
                    />
                  </div>
                  {addresses.map((address, index) => (
                    <div key={index} className="form-group">
                      <label>Address {index + 1}:</label>
                      <input 
                        type="text" 
                        className="form-control mb-2" 
                        name="street" 
                        placeholder="Street" 
                        value={address.street} 
                        onChange={(e) => handleAddressChange(index, e)} 
                      />
                      <input 
                        type="text" 
                        className="form-control mb-2" 
                        name="city" 
                        placeholder="City" 
                        value={address.city} 
                        onChange={(e) => handleAddressChange(index, e)} 
                      />
                      <input 
                        type="text" 
                        className="form-control mb-2" 
                        name="postalcode" 
                        placeholder="Postal Code" 
                        value={address.postalcode} 
                        onChange={(e) => handleAddressChange(index, e)} 
                      />
                      <button type="button" className="btn btn-danger" onClick={() => handleRemoveAddress(index)}>
                        Remove Address
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-primary" onClick={handleAddAddress}>
                    Add New Address
                  </button>
                  <div className="form-group mt-3">
                    <label htmlFor="profilePicture">Profile Picture:</label>
                    <input 
                      type="file" 
                      className="form-control-file" 
                      id="profilePicture" 
                      onChange={handleImageChange} 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">Update Profile</button>
                </form>
              )}
            </section>
            <hr/>
            {/* Change Password Section */}
            <section className="change-password mt-4">
              <button className="btn btn-primary" onClick={() => setChangePasswordOpen(!changePasswordOpen)}>
                {changePasswordOpen ? 
                  <><FontAwesomeIcon icon={faChevronUp} /> Close Change Password</> : 
                  <><FontAwesomeIcon icon={faChevronDown} /> Change Password</>}
              </button>
              {changePasswordOpen && (
                <form onSubmit={handlePasswordChange} className="mt-3">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password:</label>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="form-control" 
                      id="currentPassword" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="form-control" 
                      id="newPassword" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="form-control" 
                      id="confirmNewPassword" 
                      value={confirmNewPassword} 
                      onChange={(e) => setConfirmNewPassword(e.target.value)} 
                    />
                  </div>
                  {/* Show Password Checkbox */}
                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="showPassword"
                      checked={showPassword}
                      onChange={handleShowPassword}
                    />
                    <label className="form-check-label" htmlFor="showPassword">{showPassword ? 'Hide Password' : 'Show Password'}</label>
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">Change Password</button>
                </form>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
