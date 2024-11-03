const Gig = require('../models/Gig');

// Create a Collection
exports.createCollection = async (req, res) => {
  const { id } = req.params; // Gig ID from request params
  const { title, image, items } = req.body; // Extract collection data from request body

  try {
    // Find the gig to which the collection will be added
    const gig = await Gig.findById(id);

    // Ensure the gig exists
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Create the new collection
    const newCollection = {
      title,
      image,
      items: JSON.parse(items), // Ensure items are parsed from JSON
    };

    // Add the collection to the gig
    gig.collections.push(newCollection);

    // Save the updated gig
    await gig.save();

    res.status(201).json(newCollection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Error creating collection' });
  }
};

// Update a Collection
exports.updateCollection = async (req, res) => {
  const { gigId, collectionId } = req.params; // Gig ID and Collection ID from request params
  const { title, image, items } = req.body; // Extract new data for collection

  try {
    // Find the gig
    const gig = await Gig.findById(gigId);

    // Ensure the gig exists
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Find the collection to update
    const collection = gig.collections.id(collectionId);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Update collection details
    collection.title = title || collection.title;
    collection.image = image || collection.image;
    collection.items = items ? JSON.parse(items) : collection.items; // Update items if provided

    // Save the updated gig
    await gig.save();

    res.status(200).json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Error updating collection' });
  }
};

// Delete a Collection
exports.deleteCollection = async (req, res) => {
  const { gigId, collectionId } = req.params; // Gig ID and Collection ID from request params

  try {
    // Find the gig
    const gig = await Gig.findById(gigId);

    // Ensure the gig exists
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Find the collection to delete
    const collection = gig.collections.id(collectionId);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Remove the collection
    collection.remove();

    // Save the updated gig
    await gig.save();

    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Error deleting collection' });
  }
};