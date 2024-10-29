import React, { useEffect, useState } from 'react';
import { useLocation} from 'react-router-dom';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { getCategories } from '../../utility/seller/categoryApi'; // Assuming this is the correct import for your categories API
import {Button } from 'react-bootstrap';

const AddProduct = () => {
  const location = useLocation();
  let editproduct =location.state ?.product;
  
  if(editproduct.length === 0)
  {
    editproduct = location.state ?.product;
  }
  
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

  const { t } = useTranslation();
    
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (editproduct?.images) {
        const initialPreviews = editproduct.images.map((img) => `http://localhost:3001/uploads/${img}`);
        setPreviews(initialPreviews);
    }
  }, [editproduct]);

  // Initialize product state for either adding or editing
  const [product, setProduct] = useState({
    id: editproduct?._id || '',
    name: editproduct?.name || '',
    type: editproduct?.type || '',
    material: editproduct?.material || '',
    category: editproduct?.category.name || '', 
    subcategory: editproduct?.subcategory.name || '',
    subChildCategory: editproduct?.subChildCategory.name || '',
    size: editproduct?.size || '',
    description: editproduct?.description || '',
    price: editproduct?.price || '',
    qty: editproduct?.qty || '',
    condition: editproduct?.condition || '',
    images: editproduct?.images || [],
  });

  const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  const newImagesArray = files.map((file) => URL.createObjectURL(file));

  setPreviews((prevPreviews) => [...prevPreviews, ...newImagesArray]);
  setProduct((prevProduct) => ({
    ...prevProduct,
    images: [...prevProduct.images, ...files]
    }));
  };

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

          // Preselect categories if editing a product
          if (editproduct) {
            const selectedCategory = data.find(c => c._id === editproduct.category._id);
            if (selectedCategory) {
                setSelectedParent(selectedCategory._id);

                const filteredChildren = data.filter(c => c.parent === selectedCategory._id);
                setChildCategories(filteredChildren);

                const selectedSubcategory = filteredChildren.find(c => c._id === editproduct.subcategory._id);
                if (selectedSubcategory) {
                  setSelectedChild(selectedSubcategory._id);

                  const filteredSubChildren = data.filter(c => c.parent === selectedSubcategory._id);
                  setSubChildCategories(filteredSubChildren);

                  const selectedSubChildCategory = filteredSubChildren.find(c => c._id === editproduct.subChildCategory._id);
                  if (selectedSubChildCategory) {
                    setSelectedSubChild(selectedSubChildCategory._id);
                  }
                }
            }
        }
      }
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
  };

  fetchCategories();
  }, [token, editproduct]);
    
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
          toast.error(t('Only Numbers Allowed'));
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
    <>
    <Button className='bg-transparent text-black tracking-wider' style={{textDecoration: 'underline'}} onClick={() => {window.history.back()}}>{'<Back'}</Button>
    <div className='mb-5 m-0 w-full' style={styles.container}>
        <h2 style={styles.header}>{editproduct ? 'Edit Product' : 'Add Product'}</h2>
        {noCategoriesMessage && <p style={styles.noCategories}>{noCategoriesMessage}</p>}

        {/* Category Selection Section */}
        <div style={styles.categoryGroup}>
            <h3 style={styles.subHeader}>Category Selection</h3>
            <div style={styles.categorySelect}>
                <label style={styles.label}>Parent Category:</label>
                <select value={selectedParent} onChange={handleParentChange} style={styles.select}>
                    <option value="">Select Parent Category</option>
                    {categories.filter(c => !c.parent).map(category => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={styles.categorySelect}>
                <label style={styles.label}>Child Category:</label>
                <select value={selectedChild} onChange={handleChildChange} disabled={!selectedParent} style={styles.select}>
                    <option value="">Select Sub-Category</option>
                    {childCategories.map(category => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={styles.categorySelect}>
                <label style={styles.label}>Sub-Child Category:</label>
                <select value={selectedSubChild} onChange={(e) => setSelectedSubChild(e.target.value)} disabled={!selectedChild} style={styles.select}>
                    <option value="">Select Sub-Child Category</option>
                    {subChildCategories.map(category => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        {/* Product Details Section */}
        <form onSubmit={createProduct} style={styles.form}>
            <h3 style={styles.subHeader}>Product Details</h3>
            <div style={styles.section}>
                <label style={styles.label}>Product Name</label>
                <input type="text" name="name" value={product.name} onChange={handleChange} required style={styles.input} />
            </div>

            <div style={styles.section}>
                <label style={styles.label}>Product Type</label>
                <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                        <input type="radio" name="type" value="New" checked={product.type === "New"} onChange={handleChange} required />
                        &nbsp;New
                    </label>
                    <label style={styles.radioLabel}>
                        <input type="radio" name="type" value="Used" checked={product.type === "Used"} onChange={handleChange} required />
                        &nbsp;Used
                    </label>
                </div>
            </div>

            <div className='d-flex gap-x-5'>
              <div style={styles.section}>
                  <label style={styles.label}>Material</label>
                  <input type="text" name="material" value={product.material} onChange={handleChange} required style={styles.input} />
              </div>

              <div style={styles.section}>
                  <label style={styles.label}>Size</label>
                  <input type="text" name="size" value={product.size} onChange={handleChange} required style={styles.input} />
              </div>
            </div>

            <div style={styles.section}>
                <label style={styles.label}>Description</label>
                <textarea name="description" value={product.description} onChange={handleChange} required maxLength="160" style={styles.textarea} />
            </div>

            <div className='d-flex gap-x-5'>
              <div style={styles.section}>
                  <label style={styles.label}>Price</label>
                  <input type="number" name="price" value={product.price} onChange={handleChange} required style={styles.input} />
              </div>

              <div style={styles.section}>
                  <label style={styles.label}>Quantity</label>
                  <input type="number" name="qty" value={product.qty} onChange={handleChange} required style={styles.input} />
              </div>
            </div>

            {product.type === 'Used' && (
                <div style={styles.section}>
                    <label style={styles.label}>Condition</label>
                    <input type="number" name="condition" value={product.condition} onChange={handleChange} required style={styles.input} />
                </div>
            )}

            {/* Product Images Section */}
            <div style={styles.section}>
                <label style={styles.label}>Product Images</label>
                <input type="file" name="images" multiple onChange={handleImageChange} required={!editproduct} />
                {previews.length > 0 && (
                    <div className='m-2' style={styles.imagePreviewContainer}>
                        {previews.map((preview, index) => (
                            <img key={index} src={preview} alt={`Preview ${index + 1}`} style={styles.imagePreview} />
                        ))}
                    </div>
                )}
            </div>

            <button type="submit" style={styles.button}>{editproduct ? "Save Changes" : "Upload Product"}</button>
        </form>

        <ToastContainer transition={Bounce} />
    </div>
    </>
  );
}

  const styles = {
    container: {
        maxWidth: '600px', // Set a fixed max width for better readability
        margin: 'auto',
        marginTop: '15px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    header: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px',
    },
    subHeader: {
        fontSize: '20px',
        fontWeight: '500',
        color: '#555',
        marginBottom: '10px',
        borderBottom: '2px solid #007bff', // Optional bottom border for visual separation
        paddingBottom: '5px',
    },
    noCategories: {
        color: '#d9534f',
        fontSize: '16px',
        textAlign: 'center',
        marginBottom: '15px',
    },
    categoryGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '15px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
    },
    categorySelect: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    form: {
        display: 'grid',
        gap: '15px',
    },
    section: {
        gridColumn: 'span 1',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#333',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        color: '#333',
    },
    radioGroup: {
        display: 'flex',
        gap: '10px',
    },
    radioLabel: {
        fontSize: '14px',
        color: '#333',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '14px',
        resize: 'vertical',
        height: '80px',
    },
    button: {
        padding: '14px',
        fontSize: '16px',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#666',
        color:'#fff',
    },
    select: {
        width: '100%',
        padding: '10px',
        fontSize: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        color: '#333',
        transition: 'border-color 0.2s ease',
    },
    imagePreviewContainer: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
    },
    imagePreview: {
        width: '80px',
        height: '80px',
        borderRadius: '5px',
        objectFit: 'cover',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    },
    '@media screen and (max-width: 768px)': {
        form: {
            gridTemplateColumns: '1fr',
        },
        button: {
            gridColumn: '1 / span 1',
        },
    },
};

export default AddProduct;