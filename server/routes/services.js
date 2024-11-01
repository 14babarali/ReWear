const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const Service = require('../models/Service'); // Adjust the path as necessary

// Middleware for admin check
const checkAdmin = async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.role !== 'Admin') {
    return res.status(403).json({ message: 'Restricted Route, Only for Admins' });
  }

  next();
};

// Create a new service with material types
router.post('/add',authMiddleware.verifyToken, async (req, res) => {
  const { name, material } = req.body; // Changed from materialTypes to material
  
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if(user.role === 'Admin'){
      // Validate the request body
      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          message: 'Validation Error: Name is required and must be a non-empty string.',
        });
      }

      if (!Array.isArray(material) || material.length === 0) { 
        return res.status(400).json({
          message: 'Validation Error: material must be a non-empty array.',
        });
      }

      // Create and save the service
      const service = new Service({ name, material });
      await service.save();

      return res.status(201).json({ message: 'New Service, Saved Successfully', service });
    }
    else{
      return res.status(403).json({message: 'Restricted Route, No Privileges'});
    }
  } catch (error) {
    console.error('Error adding service:', error);
    return res.status(500).json({ message: 'Error adding service', error });
  }
});

// Fetch all services
router.get('/all',authMiddleware.verifyToken, async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({ message: 'Error fetching services', error });
  }
});

// Fetch a single service by ID
router.get('/single/:id',authMiddleware.verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return res.status(500).json({ message: 'Error fetching service', error });
  }
});

// Update a service by ID
router.put('/update/:id',authMiddleware.verifyToken, checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, material } = req.body;

  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if(user.role === 'Admin'){
    // Validate the request body
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        message: 'Validation Error: Name is required and must be a non-empty string.',
      });
    }

    if (!Array.isArray(material) || material.length === 0) { 
      return res.status(400).json({
        message: 'Validation Error: material must be a non-empty array.',
      });
    }

    const service = await Service.findByIdAndUpdate(id, { name, material }, { new: true, runValidators: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service updated successfully', service });
    }
    else{
      return res.status(403).json({message: 'Restricted Route, No Privileges'});
    }
  } catch (error) {
    console.error('Error updating service:', error);
    return res.status(500).json({ message: 'Error updating service', error });
  }
});

// Delete a service by ID
router.delete('/:id',authMiddleware.verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
  if(user.role === 'Admin'){
    
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    return res.json({ message: 'Service deleted successfully' });
  }
  else{
    return res.status(403).json({message: 'Restricted Route, No Privileges'});
  }

  } catch (error) {
    console.error('Error deleting service:', error);
    return res.status(500).json({ message: 'Error deleting service', error });
  }
});

module.exports = router;
