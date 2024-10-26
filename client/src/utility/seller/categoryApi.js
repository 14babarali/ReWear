import axios from 'axios';

// const API_URL = 'http://localhost:3001/category';

// Get categories
export const getCategories = async (token) => {
    try {
        const response = await axios.get('http://localhost:3001/category/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.status === 200) {
          return response.data.categories;
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
        throw error; // You can decide how to handle this in your UI
      }
};


// Get all categories for buyers menu
export const getBuyerCategories = async () => {
    try {
        const response = await axios.get('http://localhost:3001/category/buyers');
        return response.data; // Return the fetched categories
    } catch (error) {
        console.error('Error fetching buyer categories:', error);
        throw error; // Re-throw the error for handling in calling code
    }
};


// Create category
export const createCategory = async (token, categoryData) => {
    const response = await axios.post('http://localhost:3001/category/create_new', categoryData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Delete category
export const deleteCategory = async (token, categoryId) => {
    try{
    const response = await axios.delete(`http://localhost:3001/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
        return response; 
    }
    catch(error){
        // Check if error response exists
        if (error.response) {
            if (error.response.status === 400 || error.response.status === 403) {
                // Specific message for 404 and 403
                throw new Error("You don't have permission to delete it.");  
            }
        }
        throw error;
    }
};

// Update category
export const updateCategory = async (token, categoryId, categoryData) => {
    const response = await axios.put(`http://localhost:3001/category/${categoryId}`, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
