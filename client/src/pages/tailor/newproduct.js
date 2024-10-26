import React, { useEffect, useState } from 'react';
import { useLocation} from 'react-router-dom';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { getCategories } from '../../utility/seller/categoryApi'; // Assuming this is the correct import for your categories API

const AddProduct = () => {
    const location = useLocation();
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    const { t } = useTranslation();

    // Get selected category from route state if available
    const initialCategory = location.state?.selectedCategory || null; 
    const [previews, setPreviews] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        type: '',
        material: '',
        category: '', 
        subcategory: '',
        subChildCategory: '',
        size: '',
        description: '',
        price: '',
        qty: '',
        condition: '',
        images: []
    });

    const [categories, setCategories] = useState([]);
    const [selectedParent, setSelectedParent] = useState('');
    const [childCategories, setChildCategories] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [subChildCategories, setSubChildCategories] = useState([]);
    const [selectedSubChild, setSelectedSubChild] = useState('');
    const [noCategoriesMessage, setNoCategoriesMessage] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories(token); // Fetch all categories
                setCategories(data);
                
                if (data.length === 0) {
                    setNoCategoriesMessage('No categories found. Please add a new category.');
                } else {
                    setNoCategoriesMessage('');
                    // Preselect categories if initialCategory exists
                if (initialCategory) {
                    const { category: selectedCategory, subcategory: selectedSubcategory } = initialCategory;

                    // Set parent category
                    if (selectedCategory?._id) {
                        setSelectedParent(selectedCategory._id);
                        
                        // Filter and set child categories based on the parent
                        const filteredChildren = data.filter(c => c.parent === selectedCategory._id);
                        setChildCategories(filteredChildren);

                        // Set subcategory if available
                        if (selectedSubcategory?._id) {
                            setSelectedChild(selectedSubcategory._id);
                            
                            // Filter and set sub-child categories based on the subcategory
                            const filteredSubChildren = data.filter(c => c.parent === selectedSubcategory._id);
                            setSubChildCategories(filteredSubChildren);
                        }
                    }
                }
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
    
        fetchCategories();
    }, [token,initialCategory]);
    
    // Handle selection of a parent category and update sub-categories
    const handleParentChange = (e) => {
        const parentId = e.target.value;
        setSelectedParent(parentId);
        
        // Filter to get sub-categories (categories that have the selected parent as their parent)
        const filteredChildren = categories.filter(category => category.parent === parentId);
        setChildCategories(filteredChildren);
        setSelectedChild('');  // Reset child selection
        setSubChildCategories([]);  // Reset sub-child categories
        setSelectedSubChild('');  // Reset sub-child selection
    };
    
    // Handle selection of a sub-category and update sub-child categories
    const handleChildChange = (e) => {
        const childId = e.target.value;
        setSelectedChild(childId);
        
        // Filter to get sub-child categories (categories that have the selected child as their parent)
        const filteredSubChildren = categories.filter(category => category.parent === childId);
        setSubChildCategories(filteredSubChildren);
        setSelectedSubChild('');  // Reset sub-child selection
    };
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const imagesArray = [];
        const previewsArray = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Check if file type is not image
            if (!file.type.startsWith('image/')) {
                toast.error(t('invalidFile', { fileName: file.name }));
                e.target.value = '';
                setPreviews([]);
                return;
            }

            imagesArray.push(file);
        }

        if (files.length > 5 || files.length < 1) {
            toast.error(t('imageLimit'));
            e.target.value = '';
            setPreviews([]);
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onloadend = () => {
                previewsArray.push(reader.result);
                if (previewsArray.length === files.length) {
                    setPreviews(previewsArray);
                }
            };
            reader.readAsDataURL(file);
        }

        setProduct({ ...product, images: imagesArray });
    };

    // Handle form submission
    const createProduct = async (e) => {
        e.preventDefault();
        console.log(product);
        
        // Basic form validation
        if (!product.name || !product.type || !product.material || !selectedParent || !selectedChild || !selectedSubChild || !product.size || !product.description || !product.price || !product.qty || !product.condition) {
            toast.error('Please fill in all required fields.');
            return;
        }
    
        if (!product.id) {
            if (!product.images[0]) {
                toast.error('Please add at least 1 picture for products.');
                return;
            }
        }
    
        // Ensure numeric validation for price, qty, and condition
        if (isNaN(product.price) || isNaN(product.qty) || isNaN(product.condition)) {
            toast.error(t('numericValues'));
            return;
        }
        
        // Ensure non-numeric validation for name, type, material, category, size, and description
        const containsNumberRegex = /\d/;
        const containsInvalidCharsRegex = /[^a-zA-Z0-9\s]/;
    
        if (containsNumberRegex.test(product.name) || containsInvalidCharsRegex.test(product.name)) {
            toast.warning('Please use alphabets in "Name" only.');
            return;
        }
        
        if (containsNumberRegex.test(product.material) || containsInvalidCharsRegex.test(product.material)) {
            toast.warning(t('alphabeticOnly', { fieldName: 'Material' }));
            return;
        }
        
        if (product.description.length > 160) {
            toast.warning(t('descriptionLimit'));
            return;
        }
    
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('type', product.type);
        formData.append('material', product.material);
        formData.append('category', selectedParent);
        formData.append('subcategory', selectedChild);
        if (selectedSubChild) {
            formData.append('subChildCategory', selectedSubChild);
        }
        formData.append('size', product.size);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('qty', product.qty);
        formData.append('condition', product.condition);
    
        product.images.forEach((image) => {
            formData.append('images', image);
        });
    
        try {
            let response;
    
            if (product.id) {
                // If the product has an id, we're editing an existing product
                response = await axios.put(`http://localhost:3001/api/editproduct/${product.id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Otherwise, we're adding a new product
                response = await axios.post('http://localhost:3001/api/uploadproduct', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
    
            if (response.status === 200 || response.status === 201) {
                setProduct(response.data) ;
                if (product.id) {
                    toast.success('Product edited successfully!');
                } else {
                    toast.success('Product added successfully!');
                }
    
                // Reset the form
                setProduct({
                    id: '',
                    name: '',
                    type: '',
                    material: '',
                    category: '', 
                    subcategory: '',
                    subChildCategory: '',
                    size: '',
                    description: '',
                    price: '',
                    qty: '',
                    condition: '',
                    images: []
                });
                setPreviews([]); // Clear the previews
            } else {
                console.error('Failed to save product');
                toast.error('Failed to save product');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while saving the product.');
        }
    };

    return (
        <div style={styles.container}>
          <h2 style={styles.header}>Add Product</h2>
          {noCategoriesMessage && <p>{noCategoriesMessage}</p>}
    
          <div>
            <label style={styles.label}>
              Parent Category:
              <select value={selectedParent} onChange={handleParentChange} style={styles.select}>
                <option value="">Select Parent Category</option>
                {categories.filter(c => !c.parent).map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
    
            <label style={styles.label}>
              Sub-Category:
              <select value={selectedChild} onChange={handleChildChange} disabled={!selectedParent} style={styles.select}>
                <option value="">Select Sub-Category</option>
                {childCategories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
    
            <label style={styles.label}>
              Sub-Child Category:
              <select value={selectedSubChild} onChange={(e) => setSelectedSubChild(e.target.value)} disabled={!selectedChild} style={styles.select}>
                <option value="">Select Sub-Child Category</option>
                {subChildCategories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
    
          <form onSubmit={createProduct}>
            <div>
              <label htmlFor="name" style={styles.label}>Product Name</label>
              <input 
                type="text" 
                name="name" 
                value={product.name} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
            </div>
    
            <div>
              <label htmlFor="type" style={styles.label}>Product Type</label>
              <input 
                type="text" 
                name="type" 
                value={product.type} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
            </div>
    
            <div>
              <label htmlFor="material" style={styles.label}>Material</label>
              <input 
                type="text" 
                name="material" 
                value={product.material} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
            </div>
    
            <div>
              <label htmlFor="size" style={styles.label}>Size</label>
              <input 
                type="text" 
                name="size" 
                value={product.size} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
            </div>
    
            <div>
              <label htmlFor="description" style={styles.label}>Description</label>
              <textarea 
                name="description" 
                value={product.description} 
                onChange={handleChange} 
                required 
                maxLength="160" 
                style={styles.textarea} 
              />
            </div>
    
            <div>
              <label htmlFor="price" style={styles.label}>Price</label>
              <input 
                type="number" 
                name="price" 
                value={product.price} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
            </div>
    
            <div>
              <label htmlFor="qty" style={styles.label}>Quantity</label>
              <input 
                type="number" 
                name="qty" 
                value={product.qty} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
            </div>
    
            <div>
              <label htmlFor="condition" style={styles.label}>Condition</label>
              <input 
                type="number" 
                name="condition" 
                value={product.condition} 
                onChange={handleChange} 
                required 
                style={styles.input} 
              />
            </div>
    
            <div>
              <label htmlFor="images" style={styles.label}>Images (up to 5)</label>
              <input 
                type="file" 
                name="images" 
                multiple 
                onChange={handleImageChange} 
                required 
              />
              <div style={styles.imagePreviewContainer}>
                {previews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Preview ${index + 1}`} style={styles.imagePreview} />
                ))}
              </div>
            </div>
    
            <button type="submit" style={styles.button}>Submit</button>
          </form>
    
          <ToastContainer transition={Bounce} />
        </div>
      );
};

const styles = {
    container: {
      maxWidth: '900px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
      textAlign: 'center',
    },
    form: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: '20px',
    },
    fullWidth: {
      gridColumn: '1 / span 2',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      marginBottom: '8px',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      transition: 'border-color 0.2s',
    },
    inputFocus: {
      borderColor: '#007bff',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      height: '100px',
      resize: 'none',
    },
    button: {
      gridColumn: '1 / span 2',
      padding: '12px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    categorySelect: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px',
    },
    select: {
      marginTop: '5px',
      padding: '8px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '5px',
    },
    imagePreviewContainer: {
      gridColumn: '1 / span 2',
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    imagePreview: {
      border: '1px solid #ddd',
      borderRadius: '5px',
      width: '100px',
      height: '100px',
      objectFit: 'cover',
    },
    '@media screen and (maxWidth: 768px)': {
      form: {
        gridTemplateColumns: '1fr',
      },
      button: {
        gridColumn: '1 / span 1',
      },
    },
  };
  

export default AddProduct;
