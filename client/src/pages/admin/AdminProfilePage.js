import React, { useState, useEffect } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Backend code commented out
import { ToastContainer, toast, Bounce } from 'react-toastify';
import './adminProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const AdminProfilePage = () => {
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

    if (storedUser.role === 'tailor') {
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

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
        navigate('/TailorProfile');
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
    <div className="admin-profile-container mt-5 mb-5">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="dark"
        transition={Bounce}
        limit={3}
      />
      {user && (
        <div className="admin-profile-card">
          <div className="admin-profile-header">
            <h4>Admin Profile</h4>
          </div>
          <div className="admin-profile-body">
            {/* Admin Info Section */}
            <section className="admin-info">
              <div className="row">
                <div className="col-md-4 text-center position-relative">
                  <img 
                    src={imageUrl}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent looping
                      e.target.src = 'http://localhost:3001/uploads/no-image.jfif'; // Fallback image
                    }}
                    alt="Admin Profile" 
                    className="admin-profile-image" />
                </div>
                <div className="col-md-8 admin-info">
                  <h4>{user.profile?.name || 'Admin Name'}</h4>

                  <div className="profile-section">
                    <p><strong>Email:</strong> {user?.email || 'No Email Provided'}</p>
                  </div>

                  <div className="profile-section">
                    <p><strong>Phone:</strong> {user.profile?.phone || 'No Phone Provided'}</p>
                  </div>
                </div>
              </div>
            </section>

            <hr />

            {/* Edit Profile Section */}
            <section className="edit-profile mt-4">
              <button className="btn btn-primary" onClick={() => setEditProfileOpen(!editProfileOpen)}>
                {editProfileOpen ? (
                  <>
                    <FontAwesomeIcon icon={faChevronUp} /> Close Edit Profile
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faChevronDown} /> Edit Profile
                  </>
                )}
              </button>
              {editProfileOpen && (
                <form onSubmit={handleSubmit} className="mt-3">
                  <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={user.profile.name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <br />
                    <ReactPhoneInput
                      country={'us'}
                      value={user.profile.phone}
                      onChange={setPhone}
                      onlyCountries={['pk']}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: true
                      }}
                    />
                  </div>

                  <div className="form-group mt-3">
                    <label htmlFor="profilePicture">Profile Picture:</label>
                    <input
                      type="file"
                      className="form-control-file"
                      id="profilePicture"
                      onChange={handleImageChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary mt-3">
                    Update Profile
                  </button>
                </form>
              )}
            </section>

            <hr />

            {/* Change Password Section */}
            <section className="change-password mt-4">
              <button className="btn btn-primary" onClick={() => setChangePasswordOpen(!changePasswordOpen)}>
                {changePasswordOpen ? (
                  <>
                    <FontAwesomeIcon icon={faChevronUp} /> Close Change Password
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faChevronDown} /> Change Password
                  </>
                )}
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
                  <div className="d-flex show-password">
                    <input
                      type="checkbox"
                      className='m-0'
                      id="showPassword"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    <label
                      className='m-0'
                      htmlFor="showPassword">{t('Show Password')}</label>
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">
                    Change Password
                  </button>
                </form>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfilePage;
