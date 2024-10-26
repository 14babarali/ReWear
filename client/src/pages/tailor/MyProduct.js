import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button } from 'react-bootstrap';
import './addproduct.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NoProduct from '../../assests/error-404.png';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const MyProduct = () => {
    const { t } = useTranslation();

    const [productList, setProductList] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [product, setProduct] = useState({
        id: '',
        name: '',
        isNew: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        condition: '',
        size: '',
        images:[],
    });


    // Fetch products from backend when component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/fetchproducts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setProductList(response.data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };
    

    const handleCategorySelect = (e) => {
        setProduct({ ...product, category: e.target.value });
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
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!product.name || !product.type || !product.material || !product.category || !product.size || !product.description || !product.price || !product.qty || !product.condition) {
            toast.error('Please fill in all required fields.');
            return;
        }

        if(!product.id){

            if (!product.images[0]){
                toast.error('Please add atleast 1 picture for products.');
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
        // const containsInvalidCharsRegex = /[^a-zA-Z\s\d.!"#$%&'()*+,-:;<=>?@[\\\]^_`{|}~]/;
        const containsInvalidCharsRegex = /[^a-zA-Z0-9\s]/;

        if (containsNumberRegex.test(product.name) || containsInvalidCharsRegex.test(product.name)) {
            toast.warning('Please use alphabets in "Name" only.');
            return;
        }
        
        if (containsNumberRegex.test(product.material) || containsInvalidCharsRegex.test(product.material)) {
            toast.warning(t('alphabeticOnly', { fieldName: 'Name' }));
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
        formData.append('category', product.category);
        formData.append('size', product.size);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('qty', product.qty);
        formData.append('condition', product.condition);
    
        product.images.forEach((image, index) => {
            formData.append('images', image);
        });
    
        try {
            const token = localStorage.getItem('token');
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
                const newProduct = response.data;
                if (product.id) {
                    // Update the product list with the edited product
                    setProductList(productList.map(p => p._id === newProduct._id ? newProduct : p));
                    toast.success('Product edited successfully!');
                } else {
                    // Add the new product to the product list
                    setProductList([...productList, newProduct]);
                    toast.success('Product added successfully!');
                }
    
                setProduct({
                    id: '',
                    name: '',
                    type: '',
                    material: '',
                    category: '',
                    size: '',
                    description: '',
                    price: '',
                    qty: '',
                    condition: '',
                    images: []
                }); // Reset the form
                setPreviews([]); // Clear the previews
                setShow(false); // Close the modal
            } else {
                console.error('Failed to save product');
                toast.error('Failed to save product');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while saving the product.');
        }
    };


    const [show, setShow] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', price: '' });

    // Function to handle modal close
    const handleClose = () => {
        setShow(false);
        setCurrentProduct({ id: null, name: '', price: '' });
    };

     // Function to handle modal show
     const handleShow = (product) => {
        setCurrentProduct(product);
        setProduct({
            id: product._id || '', // Set the product id if it exists (for editing)
            name: product.name || '',
            type: product.type || '',
            material: product.material || '',
            category: product.category || '',
            size: product.size || '',
            description: product.description || '',
            price: product.price || '',
            qty: product.qty || '',
            condition: product.condition || '',
            images: [] // Clear the images array, as we will handle image uploads separately
        });
        setPreviews(product.images ? product.images.map(image => `http://localhost:3001/uploads/products/${image}`) : []);
        setShow(true);
    };
    

    // Confirmation modal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Function to show confirmation modal
    const showDeleteConfirmation = (product) => {
        setProductToDelete(product);
        setShowConfirmModal(true);
    };

    // Function to hide confirmation modal
    const hideDeleteConfirmation = () => {
        setProductToDelete(null);
        setShowConfirmModal(false);
    };

      
    
    const handleDelete = async (id) => {

    try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3001/api/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setProductList(productList.filter(product => product._id !== id));
                toast.success('Product deleted successfully!');
            } else {
                console.error('Failed to delete product');
                toast.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while deleting the product.');
        }finally {
            hideDeleteConfirmation(); // Close the confirmation modal regardless of the outcome
        }
    };

    return (
        <div className="container-fluid d-flex h-100 p-0">
            
            {/* Main Content Area */}
          <div className='main-section '>
            <ToastContainer 
                position='top-right'
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                theme='dark'
                transition={Bounce}
                limit={4}
            />
                <div className="profile-container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>{t('My Products')}</h2>
                        <Button variant="primary" onClick={() => handleShow({ id: null, name: '', price: '' })}>
                        {t('addProduct')}
                        </Button>
                    </div>

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>QTY</th>
                                <th>Price</th>
                                <th>Condition</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {productList.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img src={NoProduct} alt="No products" style={{ maxWidth: '150px', marginBottom: '10px' }} />
                                        <span>No Product Added Yet</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            productList.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="product-image-container">
                                            {product.images && product.images.length > 0 && (
                                            <>
                                                <img
                                                src={`http://localhost:3001/uploads/${product.images[0]}`}
                                                className="product-image"
                                                alt={product.name}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                />
                                                <div className="product-image-tooltip">
                                                <img
                                                    src={`http://localhost:3001/uploads/products/${product.images[0]}`}
                                                    alt={product.name}
                                                    style={{ width: '400px', height: '400px', objectFit: 'cover', padding:"5px"}}
                                                />
                                                </div>
                                            </>
                                            )}
                                        </div>
                                    </td>

                                    <td>{product.name}</td>
                                    <td>{product.type}</td>
                                    <td>{product.size}</td>
                                    <td>{product.qty}</td>
                                    <td>Rs:{product.price}</td>
                                    <td>{product.condition}</td>
                                    
                                    <td>
                                        <Button variant="warning" className="mr-2" onClick={() => handleShow(product)}>
                                            Edit <FontAwesomeIcon icon={faPen}/>
                                        </Button>

                                        <Button variant="danger" onClick={() => showDeleteConfirmation(product)} style={{marginLeft:"5px"}}>
                                            Delete <FontAwesomeIcon icon={faTrash}/>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                     {/* Modal for Delete Confirmation */}
                     <Modal show={showConfirmModal} onHide={hideDeleteConfirmation}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {productToDelete && (
                                <p>Are you sure you want to delete the product "{productToDelete.name}"?</p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={hideDeleteConfirmation}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(productToDelete._id)}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{currentProduct.name ? 'Edit Product' : 'Add Product'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div className="border rounded p-4 mb-5">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">{t('productName')} <span style={{color:"red"}}>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={product.name}
                                            onChange={handleChange}
                                            style={{ maxWidth: "100%", borderColor:"gray" }}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3 d-flex align-items-center">
                                        <div className="me-3">
                                        <label className="form-label"> {t('type')}<span style={{color:"red"}}>*</span></label>
                                        <div style={{ display: 'flex', alignItems: 'center', paddingRight:"15px" }}>
                                            <div style={{ marginRight: '10px' }}>
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="typeNew"
                                                name="type"
                                                value="new"
                                                checked={product.type === 'new'}
                                                onChange={handleChange}
                                            />
                                            &nbsp;
                                            <label htmlFor="typeNew" className="form-check-label">{t('new')}</label>
                                            </div>
                                            <div>
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="typeUsed"
                                                name="type"
                                                value="used"
                                                checked={product.type === 'used'}
                                                onChange={handleChange}
                                            />
                                            &nbsp;
                                            <label htmlFor="typeUsed" className="form-check-label">{t('used')}</label>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="d-flex flex-column" style={{marginLeft:"15px"}}>
                                        <label htmlFor="material" className="form-label">{t('productMaterial')}<span style={{color:"red"}}>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="material"
                                            name="material"
                                            value={product.material}
                                            onChange={handleChange}
                                            style={{ maxWidth: "150px",borderColor:"gray" }}
                                            required
                                        />
                                        </div>
                                    </div>

                                    <div className="mb-3" style={{ position: 'relative', zIndex: 1000 }}>
                                    <label htmlFor="category" className="form-label">{t('category')} <span style={{color:"red"}}>*</span></label>
                                    <select
                                        className="form-control"
                                        id="category"
                                        name="category"
                                        value={product.category}
                                        onChange={handleCategorySelect}
                                        style={{ maxWidth: "50%", borderColor:"gray" }}
                                        required
                                    >
                                        <option value="" disabled>{t('selectCategory')}</option>
                                        <optgroup label="Men's Clothing">
                                            <option value="men/shirts">{t('mensEventDresses')}</option>
                                            <option value="men/t-shirts">{t('mensShirts')}</option>
                                            <option value="men/pants">{t('mensPants')}</option>
                                            <option value="men/shoes">{t('mensShoes')}</option>
                                        </optgroup>
                                        <optgroup label="Women's Clothing">
                                            <option value="women/event-dresses">{t('womensEventDresses')}</option>
                                            <option value="women/casual-dresses">{t('womensCasualDresses')}</option>
                                            <option value="women/shoes">{t('womensShoes')}</option>
                                        </optgroup>
                                        <optgroup label="Children's Clothing">
                                            <option value="children/event-dresses">{t('childsEventDresses')}</option>
                                            <option value="children/shirts">{t('childsShirts')}</option>
                                            <option value="children/pants">{t('childsPants')}</option>
                                            <option value="children/shoes">{t('childsShoes')}</option>
                                        </optgroup>
                                    </select>
                                </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="size" className="form-label">{t('size')} <span style={{color:"red"}}>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="size"
                                                name="size"
                                                value={product.size}
                                                onChange={handleChange}
                                                style={{ maxWidth: "100%", borderColor:"gray" }}
                                                required
                                            />
                                        </div>
                                        
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">{t('description')} <span style={{color:"red"}}>*</span></label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={product.description}
                                            onChange={handleChange}
                                            minLength={20}
                                            maxLength={150}
                                            style={{ maxWidth: "100%", borderColor:"gray" }}
                                        />
                                    </div>
                                
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="images" className="form-label">{t('images')} <span style={{color:"red"}}>*</span></label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="images"
                                            name="images"
                                            accept="image/png, image/jpeg"
                                            multiple
                                            onChange={handleImageChange}
                                            style={{ maxWidth: "60%", borderColor:"gray"  }}
                                        />
                                        {previews.length > 0 && (
                                            <div className="image-preview-container mt-3" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {previews.map((preview, index) => (
                                                    <div key={index} className="image-preview" style={{ width: '60px', height: '60px', marginRight: '10px', marginBottom: '10px', overflow: 'hidden' }}>
                                                        <img src={preview} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3 d-flex" style={{justifyContent:"left"}}>
                                        <div style={{ maxWidth: "30%" }}>
                                            <label htmlFor="price" className="form-label">{t('price')} <span style={{color:"red"}}>*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="price"
                                                name="price"
                                                value={product.price}
                                                onChange={handleChange}
                                                style={{borderColor:"gray" }}
                                                required
                                            />
                                        </div>
                                        <div className="ms-md-1" style={{ maxWidth: "30%" }}>
                                            <label htmlFor="qty" className="form-label" style={{marginLeft:"15px"}}>{t('qtyFull')} <span style={{color:"red"}}>*</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="qty"
                                                name="qty"
                                                value={product.qty}
                                                onChange={handleChange}
                                                min="1"
                                                style={{borderColor:"gray",marginLeft:"15px" }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="condition" className="form-label">{t('condition')} <span style={{color:"red"}}>*</span> (out of 10)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="condition"
                                            name="condition"
                                            value={product.condition}
                                            onChange={handleChange}
                                            style={{ maxWidth: "30%",borderColor:"gray"  }}
                                            min="1"
                                            max="10"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-2 mb-5">{t('submit')}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default MyProduct;
