import React, { useState, useEffect } from 'react';
import './Adminusers.css'; // Import your external CSS file
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faTimesCircle ,faCheckCircle ,faUserGroup, faEnvelope, faPhone, faMapMarkerAlt, faMultiply, faFilter } from '@fortawesome/free-solid-svg-icons';


const Adminusers = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Tracking the selected user for viewing, editing, or deleting
  const [actionType, setActionType] = useState(''); // Tracking the current action ('view', 'edit', 'delete', 'approve', 'decline')
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('latest');
  const [roleFilter, setRoleFilter] = useState('all');

  const [statusFilter, setStatusFilter] = useState('all');
  const [isVerifiedFilter, setIsVerifiedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [fetchTrigger, setFetchTrigger] = useState(0);


  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3001/admin/allusers', {
          headers: {
            'Authorization': `Bearer ${token}` // Sending the token in Authorization header
          }
        });

        // Update users state with the fetched data
        setUsers(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized access');
        } else if (err.response && err.response.status === 404) {
          setError('No users found');
        } else {
          setError('Something went wrong');

        }
      } finally {
        setLoading(false); // Stop loading once the request completes
      }
    };

    fetchUsers();
  }, [fetchTrigger]); // The empty array ensures this only runs once when the component mounts

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Handle action selection (view, edit, delete, approve, decline)
  const handleAction = (user, type) => {
    console.log(`Action Type: ${type}`); // Debugging: Check if the type is correctly passed
    console.log(`Selected User: ${JSON.stringify(user)}`); // Debugging: Check if the selected user is correct
    setSelectedUser(user);
    setActionType(type); // Set the current action type
  };


  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
  
      // Send the request to the backend to update the user status
      const response = await axios.put(`http://localhost:3001/admin/users/${userId}/status`, 
        { status: newStatus }, // Send the new status in the request body
        {
          headers: {
            'Authorization': `Bearer ${token}` // Include the auth token
          }
        }
      );
  
      // Update the user's status in the UI after a successful request
      if (response.status === 200) {
        setUsers(prevUsers => 
          prevUsers.map(user => user._id === userId ? { ...user, status: newStatus } : user)
        );
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      // Optionally, display an error message to the admin
    }
  };
  

  const handleVerificationChange = async () => {
    try {
      
      const updatedUser = { ...selectedUser, isVerified: !selectedUser.isVerified };


      const token = localStorage.getItem('token');
      // Update the user in the backend using axios
      const response = await axios.put(`http://localhost:3001/admin/users/${selectedUser._id}/verify`, 
        {
        isVerified: updatedUser.isVerified,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}` // Include the auth token
          }
        }
      );
  
      if (response.status === 200) {
        // Display success message from the backend
        setSelectedUser(updatedUser);
        setFetchTrigger(prev => prev + 1);
        alert(response.data.message); // Display the success message
      } 
    } catch (error) {
      if (error.response) {
        // If the error has a response from the server (i.e., validation issues or server error)
        alert(`Error: ${error.response.data.message}`);
        console.error('Error response:', error.response.data.error); // Log detailed error for debugging
      } else {
        // If there is no response from the server (i.e., network issues)
        alert('An error occurred while updating verification status');
        console.error('Error:', error.message);
      }
    }
  };



  // Handle Confirm Action (Edit, Delete, Approve, Decline)
  const handleConfirmAction = () => {
    switch (actionType) {
      case 'edit':
        console.log(`Editing user with ID: ${selectedUser.id}`);
        break;
      case 'delete':
        console.log(`Deleting user with ID: ${selectedUser.id}`);
        setUsers(users.filter(user => user.id !== selectedUser.id)); // Remove user from the list
        break;
      case 'approve':
        console.log(`User with ID: ${selectedUser.id} approved.`);
        break;
      case 'decline':
        console.log(`User with ID: ${selectedUser.id} declined.`);
        break;
      default:
        break;
    }
    setSelectedUser(null); // Close the modal
  };

  // Handle cancel action
  const handleCancel = () => {
    setSelectedUser(null); // Close the modal without action
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FontAwesomeIcon icon={faCheckCircle} className="status-icon active" />;
      case 'restricted': return <FontAwesomeIcon icon={faExclamationCircle} className="status-icon restricted" />;
      case 'banned': return <FontAwesomeIcon icon={faTimesCircle} className="status-icon banned" />;
      default: return null;
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value); // Update sorting order
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
  const handleIsVerifiedFilterChange = (e) => setIsVerifiedFilter(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);


  // Sorting logic
  const sortedUsers = [...users].sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.created_at) - new Date(a.created_at); // Sort by latest first
    } else if (sortOrder === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at); // Sort by oldest first
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user => {
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesVerified = isVerifiedFilter === 'all' || user.isVerified.toString() === isVerifiedFilter;
    const matchesSearch = user.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesStatus && matchesVerified && matchesSearch;
  });

  // Function to count users by role
const countUsersByRole = (role) => {
  if (role === 'all') {
    return users.length;
  }
  return users.filter(user => user.role === role).length;
};

// Function to count users by status
const countUsersByStatus = (status) => {
  if (status === 'all') {
    return users.length;
  }
  return users.filter(user => user.status === status).length;
};

// Function to count users by verification status
const countUsersByVerification = (isVerified) => {
  if (isVerified === 'all') {
    return users.length;
  }
  return users.filter(user => String(user.isVerified) === isVerified).length;
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-user-management">
      <h1 className="admin-user-title">User Management</h1>

      <div className='search-filter'>
        
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name or email"
            style={{
              // padding: '8px 12px',
              fontSize: '12px',
              margin:'0px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '200px',
              outline: 'none',
              boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
              transition: 'width 0.3s ease',
            }}
          />
        {/* )}
        <FontAwesomeIcon icon={faSearch} onClick={toggleSearch}/> */}
        {/* </div> */}

        <div className='filters-row'>
          
          {showFilters && (
            <>
            {/* Sort dropdown */}
            <div className="sort-filter">
              <label htmlFor="sortOrder">Sort: </label>
              <select id="sortOrder" value={sortOrder} onChange={handleSortChange}>
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Role filter dropdown */}
            <div className="sort-filter">
              <label htmlFor="roleFilter">Role: </label>
              <select id="roleFilter" value={roleFilter} onChange={handleRoleFilterChange}>
                <option value="all">All   ({countUsersByRole('all')})</option>
                <option value="Buyer">Buyer   ({countUsersByRole('Buyer')})</option>
                <option value="Seller">Seller   ({countUsersByRole('Seller')})</option>
                <option value="Tailor">Tailor   ({countUsersByRole('Tailor')})</option>
              </select>
            </div>

            {/* Status filter dropdown */}
            <div className="sort-filter">
              <label htmlFor="statusFilter">Status: </label>
              <select id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange}>
                <option value="all">All ({countUsersByStatus('all')})</option>
                <option value="active">Active ({countUsersByStatus('active')})</option>
                <option value="restricted">Restricted ({countUsersByStatus('restricted')})</option>
                <option value="banned">Banned ({countUsersByStatus('banned')})</option>
              </select>
            </div>

            {/* isVerified filter dropdown */}
            <div className="sort-filter">
              <label htmlFor="isVerifiedFilter">Verified: </label>
              <select id="isVerifiedFilter" value={isVerifiedFilter} onChange={handleIsVerifiedFilterChange}>
                <option value="all">All ({countUsersByVerification('all')})</option>
                <option value="true">Verified ({countUsersByVerification('true')})</option>
                <option value="false">Not Verified ({countUsersByVerification('false')})</option>
              </select>
            </div>

            </>
          )}
          <div className="filter-toggle" onClick={toggleFilters}>
            <FontAwesomeIcon icon={faFilter}  style={{ cursor: 'pointer', fontSize: '24px' }} />
            <label style={{cursor:'pointer'}}>Filters</label>
          </div>

        </div>

      </div>

      <div className="user-cards-container">
      {filteredUsers.length > 0 ? (
      filteredUsers.map((user) => (
        <div className="user-card" key={user._id}>
          <img
            src={user.profile.profilePicture ? `http://localhost:3001/uploads/${user.profile.profilePicture}` : 'path/to/placeholder-image.jpg'}
            alt={user.profile.profilePicture || 'N/A'}
            className="profile-pic-small"
          />
          <div className="user-info">
            <div className='d-flex'>
            <h3>{user.profile.name || 'N/A'}</h3>
            {user.isVerified ? (
              <span style={{ 
                color: 'green', 
                backgroundColor: '#d4edda', // Light green background
                padding: '5px',
                fontSize: '10pt',
                borderRadius: '5px',
                marginLeft: '10px'
              }}>
                Verified
              </span>
            ) : (
              <span style={{ 
                color: 'red', 
                backgroundColor: '#f8d7da', // Light red background
                padding: '5px 10px',
                fontSize: '10pt',
                borderRadius: '5px',
                marginLeft: '10px'
              }}>
                Unverified
              </span>
            )}
            </div>
            <p><FontAwesomeIcon icon={faEnvelope} /> {user.email || 'N/A'}</p>
            <p><FontAwesomeIcon icon={faPhone} /> {user.profile.phone || 'N/A'}</p>
            <p><FontAwesomeIcon icon={faUserGroup}/> {user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'N/A'}</p>
            <p><FontAwesomeIcon icon={faMapMarkerAlt} className='icon-address' /> 
              {user.profile.addresses.length > 0 ? (
                user.profile.addresses.map((address, index) => (
                  <span key={index}>
                    {address.street || 'N/A'}, {address.city || 'N/A'}, {address.postalcode || 'N/A'}
                    <br />
                  </span>
                ))
              ) : (
                'N/A'
              )}
            </p>
            
            {/* Display status icon next to the dropdown */}
            <div className="status-container">
              <p>Status {getStatusIcon(user.status)}</p>
              <select
                value={user.status || 'N/A'}
                onChange={(e) => handleStatusChange(user._id, e.target.value)}
              >
                <option value="active">Active</option>
                <option value="restricted">Restricted</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
          <div className="user-card-actions justify-content-center">
            <button className="action-button view-button" onClick={() => handleAction(user, 'view')}>View</button>
          </div>
        </div>
      ))
    ) : (
      <p>No users found for your search.</p> 
    )}

      </div>

      {selectedUser && actionType === 'view' && (
  <div className="modal">
    <div className="modal-content">
      <button className="cancel-button" onClick={handleCancel}>×</button> {/* Close button */}
      <div className="admin-details-container">
        <h2>User Details</h2>
        <div className="user-details-content">
          <img
            src={`http://localhost:3001/uploads/${selectedUser.profile.profilePicture}`}
            alt={selectedUser.profile.profilePicture}
            className="profile-pic-large"
          />
          <div className="user-info">
            <p><strong>Name:</strong> {selectedUser.profile.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Address:</strong></p>
            {selectedUser.profile.addresses.map((address, index) => (
              <span key={index}>
                {address.street}, {address.city}, {address.postalcode}
                <br />
              </span>
            ))}
            <p><strong>Phone:</strong> {selectedUser.profile.phone}</p>

            {/* Verified Checkbox */}
            <div className="verification-checkbox">
              <label><strong>Verified:</strong></label>
              <input
                type="checkbox"
                checked={selectedUser.isVerified}
                onChange={handleVerificationChange}
              />
            </div>
          </div>
        </div>

        {/* CNIC Details for Seller/Tailor */}
        {(selectedUser.role === 'Seller' || selectedUser.role === 'Tailor') && (
          <>
            <h3>CNIC Details</h3>
            <div className="cnic-images">
              <img
                src={`http://localhost:3001/uploads/${selectedUser.profile.cnicfront}`}
                alt={selectedUser.profile.cnicfront}
                className="cnic-pic-large"
              />
              <img
                src={`http://localhost:3001/uploads/${selectedUser.profile.cnicback}`}
                alt={selectedUser.profile.cnicback}
                className="cnic-pic-large"
              />
            </div>
          </>
        )}

        <div className="action-buttons">
          
          <button className="cancel-button" onClick={handleCancel}><FontAwesomeIcon icon={faMultiply}/></button>
        </div>
      </div>
    </div>
  </div>
)}

      {selectedUser && actionType !== 'view' && (
        <div className="modal">
          <div className="modal-content">
            <h2>{actionType.charAt(0).toUpperCase() + actionType.slice(1)} Confirmation</h2>
            <p>
              Are you sure you want to {actionType} the user{' '}
              <strong>{selectedUser.profile.name}</strong> (ID: {selectedUser._id})?
            </p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleConfirmAction}>Confirm</button>
              <button className="cancel-button" onClick={handleCancel}><FontAwesomeIcon icon={faMultiply}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adminusers;