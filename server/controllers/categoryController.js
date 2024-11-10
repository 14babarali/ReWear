const Category = require('../models/categories');
const User = require('../models/User');

const generateSlug = (name) => {
    return name
        .toLowerCase() // Convert to lowercase
        .trim() // Remove leading and trailing spaces
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
        .substring(0, 100); // Limit the slug length to 100 characters
};

// Create a category
exports.createCategory = async (req, res) => {
  const { name, description, parent } = req.body;
  const userId = req.user.id; // Assuming you're using middleware to attach user info

  try {

      const slug = generateSlug(name);

      const newCategory = new Category({
          name,
          slug,
          description,
          parent,
          userId,
      });

      await newCategory.save();
      res.status(201).json(newCategory);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

// Get all categories (for the user)
exports.getUserCategories = async (req, res) => {
  const userId = req.user.id;

  try {
    

    const categories = await Category.find({ isDeleted: false });

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No categories found." });
    }

    // Return the categories in the response
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories: categories
    });

//     const categories = await Category.find({
//       $or: [
//           { userId: userId, isDeleted: false }, // User-generated categories
//           { userId: null, isDeleted: false }    // System-generated categories
//       ]
//   });

      
//       res.status(200).json(categories);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};


// Get all categories (for the buyers menu)
exports.getBuyerCategories = async (req, res) => {
  try {
    // Set up a 10-second timeout
    const fetchCategories = new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout while fetching categories from database'));
      }, 10000); // 10 seconds

      try {
        const categories = await Category.find({});
        clearTimeout(timeout);
        resolve(categories);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });

    const categories = await fetchCategories;
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(400).json({ message: error.message });
  }
};

// Soft delete a category
exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  const userId = req.user.id;

  const user = await User.findById(userId);

  try {
    if(user.role === 'Admin' && categoryId){
              // Find the category by ID
      const category = await Category.findById(categoryId);

      if (!category) {
          return res.status(404).json({ message: "Category not found." });
      }

      // Check if the user is the owner of the category
      if (category.userId.toString() !== userId) {
          return res.status(403).json({ message: "You don't have permission to delete this category." });
      }

      // Mark the category as deleted
      category.isDeleted = true;
      await category.save();

      res.status(200).json({ message: "Category deleted successfully." });
    }
    else {
        // If userId or categoryId is missing, return a bad request response
        return res.status(400).json({ message: "User ID and Category ID are required." });
    }
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, slug, description, parent } = req.body;

  try {
      const updatedCategory = await Category.findByIdAndUpdate(
          categoryId,
          { name, slug, description, parent, updatedAt: Date.now() },
          { new: true }
      );

      if (!updatedCategory) {
          return res.status(404).json({ message: "Category not found." });
      }

      res.status(200).json(updatedCategory);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};