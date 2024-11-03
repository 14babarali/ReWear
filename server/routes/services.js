const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const Service = require('../models/Service');

// Create a new service
router.post('/add', authMiddleware.verifyToken, async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'Admin') {
            return res.status(403).json({ message: 'Restricted Route, No Privileges' });
        }

        if (!name || !description || typeof description !== 'string' || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Validation Error: Name & Description are required and must be non-empty strings.' });
        }

        const service = new Service({ name, description });
        await service.save();
        return res.status(201).json({ message: 'New Service Saved Successfully', service });
    } catch (error) {
        console.error('Error adding service:', error);
        return res.status(500).json({ message: 'Error adding service' });
    }
});

// Fetch all services
router.get('/all', authMiddleware.verifyToken, async (req, res) => {
    try {
        const services = await Service.find();
        return res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return res.status(500).json({ message: 'Error fetching services' });
    }
});

// Fetch a single service by ID
router.get('/single/:id', authMiddleware.verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        return res.json(service);
    } catch (error) {
        console.error('Error fetching service:', error);
        return res.status(500).json({ message: 'Error fetching service' });
    }
});

// Update a service by ID
router.put('/update/:id', authMiddleware.verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'Admin') {
            return res.status(403).json({ message: 'Restricted Route, No Privileges' });
        }

        if (!name || !description || typeof description !== 'string' || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Validation Error: Name & Description are required and must be non-empty strings.' });
        }

        const service = await Service.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        return res.json({ message: 'Service updated successfully', service });
    } catch (error) {
        console.error('Error updating service:', error);
        return res.status(500).json({ message: 'Error updating service' });
    }
});

// Delete a service by ID
router.delete('/:id', authMiddleware.verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'Admin') {
            return res.status(403).json({ message: 'Restricted Route, No Privileges' });
        }

        const service = await Service.findByIdAndDelete(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        return res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        return res.status(500).json({ message: 'Error deleting service' });
    }
});

module.exports = router;
