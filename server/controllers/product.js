const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/categories')


exports.upload = async (req, res) => {
    const userId = req.user.id;

    // Check if all required fields are provided
    const { name, type, material, category, subcategory,subChildCategory, size, description, price, qty, condition } = req.body;

    if (!name || !type || !material || !category ||!subcategory || !subChildCategory || !size || !description || !price || !qty || !condition) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Check if the specified category exists
    let categoryExists;
    try {
        categoryExists = await Category.findById(category); // Check if category exists
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error while checking category', error: error.message });
    }

    if (!categoryExists) {
        return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Get image file paths
    const imagePaths = req.files ? req.files.map(file => file.filename) : [];

    // Create a new product
    const newProduct = new Product({
        userId,
        name,
        type,
        material,
        category,
        subcategory,
        subChildCategory,
        size,
        description,
        price,
        qty,
        condition,
        images: imagePaths,
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, product: savedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


// exports.upload= async (req, res) => {
    
//     const userId = req.user.id;

//     // Check if all required fields are provided
//     const { name, type, material, category, size, description, price, qty, condition } = req.body;
    
//     if (!name || !type || !material || !category || !size || !description || !price || !qty || !condition) {
//         return res.status(400).json({ success: false, message: 'All fields are required.' });
//     }

//     // Get image file paths
//     const imagePaths = req.files ? req.files.map(file => file.filename) : [];


//     // Create a new product
//     const newProduct = new Product({
//         name,
//         type,
//         material,
//         category,
//         size,
//         description,
//         price,
//         qty,
//         condition,
//         images: imagePaths,
//         userId
//     });

//     try {
//         const savedProduct = await newProduct.save();
//         res.status(201).json(savedProduct);
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//     }
// };

exports.edit = async (req, res) => {
    const { id: productId } = req.params;

    // Fetch the product by ID
    let product;
    try {
        product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found for edit operation' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }

    const userId = req.user.id;

    // Check if all required fields are provided
    const { name, type, material, category, size, description, price, qty, condition } = req.body;

    if (!name || !type || !material || !category || !size || !description || !price || !qty || !condition) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Get image file paths
    const imagePaths = req.files ? req.files.map(file => file.filename) : [];

    // Update product fields
    product.name = name;
    product.type = type;
    product.material = material;
    product.category = category;
    product.size = size;
    product.description = description;
    product.price = price;
    product.qty = qty;
    product.condition = condition;

    // Append new images if any
    if (imagePaths.length > 0) {
        product.images = [...product.images, ...imagePaths];
    }

    // Save the updated product
    try {
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.fetch = async (req, res) => {
    const userId = req.user.id;
    try {
        const products = await Product.find({ userId: userId });
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(deletedProduct);
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};



//---------------------------------------------------------------------------


// Function to get products by category for Buyer
exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.body;
        let products;


        if (!req.user) {
        const filter = { category, qty: { $gt: 0 } };
            // User is not logged in, return products by category
            products = await Product.find(filter);
        } 
        else {
          const filter = { category, qty: { $gt: 0 } };
            // User is logged in, return products by category and user ID
            products = await Product.find({ ...filter, userId:{$ne: req.user.id} });
        }

        // console.log('Products Found:', products);
        
        if (products==='[]' || products.length === 0) {
            // console.log(products);
            return res.status(404).json({ message: 'No products found in this category' });
        }

        const transformedProducts = products.map(product => ({
            ...product.toObject(), // Convert Mongoose document to plain JavaScript object
            images: product.images.slice(0, 1) // Retain only the first image
        }));
        res.json(transformedProducts);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// // Fetch product by Id 
exports.getProductsById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getcartproductsById = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const userId = req.user.id;
        const user = await User.findById(userId).populate('cart');
        const cartItem = user.cart.items.find(item => item.product.toString() === req.params.id);

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        res.json({
            product,
            quantity: cartItem.quantity,
            size: cartItem.size
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch All Products, filter out current user's products if logged in
exports.fetchall = async (req, res) => {
    try {

        const filter = { qty: { $gt: 0 } };
         // Check if user is logged in
         if (!req.user || !req.user.id) {
            // If user is not logged in, return all products
            const products = await Product.find(filter);
            res.json(products);
        } else {
            // If user is logged in, filter out products added by current user
            const userId = req.user.id;
            const products = await Product.find({
                ...filter,
                userId: { $ne: userId }
            });
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch all Products according to category, this is for major categories
exports.fetchProductsByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      let query = { qty: { $gt: 0 } };
  
      switch (category) {
        case 'event-dresses':
          query = {
              $and: [
                  query,
                  {
                      $or: [
                          { category: /men\/event-dresses/ },
                          { category: /women\/event-dresses/ },
                          { category: /children\/event-dresses/ },
                      ],
                  },
              ],
          };
          break;

      case 'tailor-made':
          query = {
              $and: [
                  query,
                  {
                      $or: [
                          { category: /men\/tailor-made/ },
                          { category: /women\/tailor-made/ },
                          { category: /children\/tailor-made/ },
                      ],
                  },
              ],
          };
          break;

      case 'shoes':
          query = {
              $and: [
                  query,
                  {
                      $or: [
                          { category: /men\/shoes/ },
                          { category: /women\/shoes/ },
                          { category: /children\/shoes/ },
                      ],
                  },
              ],
          };
          break;

      case 'casual-clothing':
          query = {
              $and: [
                  query,
                  {
                      $or: [
                          { category: /men\/shirts/ },
                          { category: /men\/pants/ },
                          { category: /women\/casual/ },
                          { category: /children\/casual/ },
                      ],
                  },
              ],
          };
          break;
  
        default:
          return res.status(400).json({ message: 'Invalid category' });
      }
  
      let products;
      if (req.user) {
        const userId = req.user.id;
        products = await Product.find({
          $and: [
              query,
              { userId: { $ne: userId } },
          ],
          });
      } else {
          products = await Product.find(query);
      }

  
      // Check if products were found
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found in this category' });
      }
  
      res.json(products);
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  };

  exports.fetchShoes = async (req, res) => {
    try {
        let query = {
            qty: { $gt: 0 }, // Only include products with quantity > 0
            $or: [
                { category: /men\/shoes/ },
                { category: /women\/shoes/ },
                { category: /children\/shoes/ },
            ],
        };

        if (req.user) {
            // If user is logged in, fetch all shoes and exclude the ones added by the current user
            const userId = req.user.id;
            const shoes = await Product.find({
                $and: [
                    query,
                    { userId: { $ne: userId } },
                ],
            });
            res.json(shoes);
        } else {
            const shoes = await Product.find(query);
            res.json(shoes);
        }
    } catch (error) {
        console.error(`Error fetching shoes for user ${req.user && req.user.id}:`, error);
        res.status(500).json({ message: 'Error fetching shoes' });
    }
};



// After implementing the dynamic categories :
// these are the api for fetching products in buyer category menu app header

exports.categoryProducts = async (req, res) => {
    try {
        const { categoryId } = req.params; // Get the category ID (subChildCategory) from params
        console.log('Received category ID:', categoryId); // Log the received category ID

        // Define the filter
        const filter = { subChildCategory: categoryId, qty: { $gt: 0 } };
        console.log('Filter:', filter); // Log the filter

        // Fetch products from the database
        const products = await Product.find(filter);
        console.log('Products Found:', products); // Log the found products

        // Handle no products found
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found in this category' });
        }

        // Transform products to return only necessary fields
        const transformedProducts = products.map(product => ({
            ...product.toObject(),
            images: product.images.slice(0, 1), // Retain only the first image
        }));

        res.json(transformedProducts); // Send the transformed products back
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Server error', error: error.message }); // Include the error message in the response for debugging
    }
};
  
