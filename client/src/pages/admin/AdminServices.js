import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  // Fetch all services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:3001/services/all', {
        headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleEdit = (service) => {
    navigate('/admin/Services/modify', {
      state: { service }, // Send the entire service object
    });
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Are you sure you want to delete ${service.name}?`)) {
      try {
        await axios.delete(`http://localhost:3001/services/${service._id}`);
        fetchServices();
      } catch (error) {
        if(error===''){
            alert('Error deleting service:', error);
        }
        else{
            alert('Connection to server lost, Try again after sometime');
        }
        
      }
    }
  };


  return (
    <div className="container mt-2">
        <h1 className="mb-4">
            ReWear Service Management
        </h1>


      <div className='flex justify-start'>
      <Button variant="primary mb-3" onClick={()=>navigate('/admin/Services/modify')}>
        <FontAwesomeIcon icon={faAdd}/> Add Service
      </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Service Name</th>
            <th>Materials</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='text-left'>
          {services.map((service, index) => (
            <tr key={service._id}>
              <td>{index + 1}</td>
              <td>{service.name}</td>
              <td>{service.material.map(mat => mat.name).join(', ')}</td>
              <td className='text-center'>
                <Button variant="warning" onClick={() => handleEdit(service)}>
                  <FontAwesomeIcon icon={faPen}/> Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(service)} className="ml-2">
                  <FontAwesomeIcon icon={faTrashAlt}/> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminServices;
