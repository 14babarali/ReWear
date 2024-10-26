import React, { useState, useEffect } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Backend code commented out
import { ToastContainer, toast, Bounce } from 'react-toastify';
import './adminProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dummy profile image URL for frontend preview
  const imageUrl = `https://via.placeholder.com/150`; // Placeholder image

  useEffect(() => {
    // This effect can be used to fetch the admin details from localStorage or backend
    // const fetchAdmin = async () => {
    //   const token = localStorage.getItem('token');
    //   if (!token) {
    //     navigate('/login');
    //     return;
    //   }

    //   const storedAdmin = localStorage.getItem('admin');
    //   if (storedAdmin) {
    //     const adminData = JSON.parse(storedAdmin);
    //     setAdmin(adminData);
    //     setName(adminData.name);
    //     setEmail(adminData.email);
    //     setPhone(adminData.phone);
    //     setProfileImage(adminData.profilePicture);
    //   } else {
    //     navigate('/login');
    //     return;
    //   }
    // };

    // Simulating admin data for frontend only
    const adminData = {
      name: "Admin User",
      email: "admin@example.com",
      phone: "1234567890",
      profilePicture: "https://via.placeholder.com/150"
    };
    setAdmin(adminData);
    setName(adminData.name);
    setEmail(adminData.email);
    setPhone(adminData.phone);
    setProfileImage(adminData.profilePicture);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Frontend validation and dummy toast success message for form submission
    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^[0-9]+$/;

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

    // Simulate profile update success message
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    // Simulate password change success message
    toast.success('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
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
      {admin && (
        <div className="admin-profile-card">
          <div className="admin-profile-header">
            <h4>Admin Profile</h4>
          </div>
          <div className="admin-profile-body">
            {/* Admin Info Section */}
            <section className="admin-info">
              <div className="row">
                <div className="col-md-4 text-center position-relative">
                  <img src={imageUrl} alt="Admin Profile" className="admin-profile-image" />
                </div>
                <div className="col-md-8 admin-info">
                  <h4>{admin?.name || 'Admin Name'}</h4>

                  <div className="profile-section">
                    <p><strong>Email:</strong> {admin?.email || 'No Email Provided'}</p>
                  </div>

                  <div className="profile-section">
                    <p><strong>Phone:</strong> {admin?.phone || 'No Phone Provided'}</p>
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <br />
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
                  <button type="button" className="btn btn-secondary" onClick={handleShowPassword}>
                    {showPassword ? 'Hide Password' : 'Show Password'}
                  </button>
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
