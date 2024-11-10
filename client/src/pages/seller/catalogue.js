import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, createCategory, deleteCategory } from '../../utility/seller/categoryApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoProduct from '../../assests/error-404.png';
import { faPlusCircle, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Modal } from 'react-bootstrap';
// import { Model } from 'mongoose';

// import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const categoryModel = ({ isOpen, onClose, onSubmit, category, setCategory, parentCategories, categories }) => {
  if (!isOpen) return null;

  const handleParentChange = (e) => {
      const selectedParent = e.target.value;
      setCategory((prev) => ({
          ...prev,
          parent: selectedParent,
          child: '', // Reset child category selection
      }));
  };

  const availableChildCategories = categories.filter(cat => cat.parent === category.parent);

  return (
      <div style={styles.modalOverlay}>
          <div style={styles.modal}>
              <h3 style={styles.modalTitle}>{category ? "Edit Category" : "Add New Category"}</h3>
              <input
                  type="text"
                  placeholder="Category Name"
                  value={category?.name}
                  onChange={(e) => setCategory({ ...category, name: e.target.value })}
                  style={styles.input}
              />
              <textarea
                  placeholder="Description"
                  value={category?.description}
                  onChange={(e) => setCategory({ ...category, description: e.target.value })}
                  style={styles.textarea}
              />
              <label htmlFor="parentSelect" style={styles.label}>Select Parent Category:</label>
              <select
                  id="parentSelect"
                  value={category?.parent}
                  onChange={handleParentChange}
                  style={styles.select}
              >
                  <option value="">Select Parent Category</option>
                  {parentCategories?.map(parent => (
                      <option key={parent._id} value={parent._id}>
                          {parent.name}
                      </option>
                  ))}
              </select>
              {/* Only show child categories if a parent is selected */}
              {category.parent && (
                  <>
                      <label htmlFor="childSelect" style={styles.label}>Select Child Category:</label>
                      <select
                          id="childSelect"
                          value={category?.child}
                          onChange={(e) => setCategory({ ...category, child: e.target.value })}
                          style={styles.select}
                      >
                          <option value="">Select Child Category</option>
                          {availableChildCategories.map(child => (
                              <option key={child._id} value={child._id}>
                                  {child.name}
                              </option>
                          ))}
                      </select>
                  </>
              )}
              <div style={styles.buttonContainer}>
                  <button onClick={() => onSubmit(category)} style={styles.submitButton}>Submit</button>
                  <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
              </div>
          </div>
      </div>
  );
};

const Catalogue = () => {
    const [categories, setCategories] = useState([]);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', parent: '', child: '', subChild: '' });
    const [selectedCategory, setSelectedCategory] = useState({
        category: null,
        parent: null,
        grandParent: null
    });
    
    const navigate  = useNavigate();

    const [noCategoriesMessage, setNoCategoriesMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const parentCategories = categories.filter(cat => !cat.parent);
    
    
    const [token] = useState(localStorage.getItem('token'));
    const [expandedCategories, setExpandedCategories] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories(token);
            setCategories(data);
            if (data.length === 0) {
                setNoCategoriesMessage('No categories found. Please add a new category.');
            } else {
                setNoCategoriesMessage('');
            }
        };

        fetchCategories();
    }, []);


    const [productList, setProductList] = useState([]);
    const [reviews, setReviews] = useState([]);

    // Fetch products from backend when component mounts
    useEffect(() => {
        fetchProducts();
        fetchReviews();
    }, []);

    // Fetching reviews data from the server
    const fetchReviews = async () => {
        try {
          const response = await axios.get('http://localhost:3001/reviews/getall', {
  
            headers: {
              'Authorization': `Bearer ${token}`
          }
  
          } ); // Replace with your API endpoint
          setReviews([]);
          setReviews(response.data); // Add static review to the fetched reviews
          setLoading(false);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          // setReviews([staticReview]);
          setLoading(false);
        }
      };

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

     // Function to filter products based on the selected category (parent/child/subchild)
     const filteredProducts = productList.filter((product) => {
        if (selectedCategory.category) {
            if (selectedCategory.category._id === product.subChildCategory._id) {
                return true;
            }
            if (selectedCategory.category._id === product.subcategory._id) {
                return true;
            }
            if (selectedCategory.category._id === product.category._id) {
                return true;
            }
        }
        return false;
    });


    // Function to show confirmation modal
    // const showDeleteConfirmation = (product) => {
    //     const confirmDelete = window.confirm(`Are you sure you want to delete "${product.name}" ?`);
    //     if(confirmDelete){
    //         handleDelete(product._id);
    //     }

    // };
    
    const handleDeleteProduct = async () => {
        console.log("Deleting product:", productToDelete); // Debugging log
        if (productToDelete) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(`http://localhost:3001/api/products/${productToDelete._id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
    
                if (response.status === 200) {
                    setProductList((prevList) => prevList.filter(product => product._id !== productToDelete._id));
                    toast.success('Product deleted successfully!');
                } else {
                    toast.error('Failed to delete product');
                }
            } catch (error) {
                toast.error('An error occurred while deleting the product.');
            } finally {
                setShowConfirmModal(false); // Close the modal
                setProductToDelete(null); // Clear the selected product
            }
        }
    };
    

    const handleAddCategory = async (categoryData) => {
        try {
          const categoryToCreate = {
            ...categoryData,
            parent: categoryData.child ? categoryData.child : categoryData.parent || null,
          };

          const createdCategory = await createCategory(token, categoryToCreate);
          setCategories([...categories, createdCategory]);
          setNewCategory({ name: '', description: '', parent: '', child: '' }); // Reset state
          setModalOpen(false);

        } catch (error) {
            console.error('Error adding category:', error);
            alert(`Failed to add category: ${error.response?.data?.message || error.message}`);
        }
    };

    // Handle category deletion
    const handleDeleteCategory = async (categoryId) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this category?');
  
      if (confirmDelete) {
        try {
          setLoading(true);
          
          // Call the API to delete the category and await the response
            const response = await deleteCategory(token, categoryId);  

            if (response.status === 200) {
                // Remove the deleted category from local state
                setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== categoryId)
                );
                alert('Category deleted successfully.');
            }

        } catch (error) {
             // Check for permission or not found error
             if (error.message.includes("You don't have permission to delete it.")) {
                alert("You don't have permission to delete it.");
            } else {
                alert('Error deleting category. Please try again.');
            }
        }
        finally {
            setLoading(false);
        }
      }
    };

    const handleOpenModal = () => {
        setModalOpen(true);
        setNewCategory({ name: '', description: '', parent: '', child: '', subChild: '' });
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    }

    const toggleExpand = (categoryId) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const handleSelectCategory = (category) => {
        const parentCategory = categories.find(cat => cat._id === category.parent);
        const grandParentCategory = parentCategory ? categories.find(cat => cat._id === parentCategory.parent) : null;
    
        setSelectedCategory({
            category: category,
            parent: parentCategory || null,
            grandParent: grandParentCategory || null
        });
    };
    
    const handleAddProductRedirect = () => {
        if (selectedCategory && selectedCategory.category) {
            navigate('/seller/product/add', { state: { selectedCategory } });
        } else {
            // If no category is selected, still navigate but without category info
            navigate('/seller/product/add');
        }
    };
    
    // Confirmation modal state
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Function to show confirmation modal
    const showDeleteConfirmation = (product) => {
        console.log("Opening delete confirmation for:", product);
        setProductToDelete(product);
        setShowConfirmModal(true);
    };

    // Function to hide confirmation modal
    // const hideDeleteConfirmation = () => {
    //     setProductToDelete(null);
    //     setShowConfirmModal(false);
    // };

    // Add hover effect on the card
    const handleMouseEnter = (e) => {
        e.currentTarget.style.transform = styles.sellerProductCardHover.transform;
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'none';
    };

    // ProductCard component
    const ProductCard = ({ product }) => (
        <div
            className="seller-product-card"
            style={styles.sellerProductCard}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="seller-product-card-image p-0" style={styles.sellerProductCardImage}>
                {product.images && product.images.length > 0 && (
                    <img
                        src={`http://localhost:3001/uploads/${product.images[0]}`}
                        alt={product.name}
                        className="seller-product-image"
                        style={styles.sellerProductImage}
                    />
                )}
            </div>
            <div className="seller-product-card-details" style={styles.sellerProductCardDetails}>
                <div style={styles.titleContainer}>
                    <h5 style={styles.productTitle} title={product.name}>
                        {product.name.length > 20 ? `${product.name.substring(0, 20)}...` : product.name}
                    </h5>
                    <div className="seller-product-card-actions" style={styles.sellerProductCardActions}>
                        <Button variant="warning" onClick={() => navigate('/seller/product/add', { state: { product } })} style={styles.editButton}>
                            <FontAwesomeIcon icon={faPen} />
                        </Button>
                        <Button variant="danger" onClick={() => showDeleteConfirmation(product)} style={styles.deleteBtn}>
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </div>
                </div>
                <p>
                    Type: {product.type} {product.type === 'Used' && `(${product.condition}/10)`}
                </p>
                {product.sizes?.length > 0 ?
                (
                    <div className='d-flex flex-col mb-2'>
                        <div>
                            <span>
                                Size: 
                            </span>
                            <span>
                                {product.sizes?.map((item) => item.size).filter(size => size).join(', ') || 'No sizes available.'}
                            </span>
                        </div>
                    
                        <div className='mt-2 '>
                            <span>
                                Qty: 
                            </span>
                            <span>
                                {product.sizes?.map((item) => item.qty).filter(qty => qty).join(', ') || 'No qty available.'}
                            </span>
                        </div>

                    </div>
                ):
                (
                    <>
                    <p>Size: 'Not Added'</p>
                    <p>QTY: 'Not Added'</p>
                    </>
                )
                }
                <p>Price: Rs {product.price}</p>
                <span className='w-full p-2 rounded text-center bg-orange-500 text-white cursor-pointer'>
                    Reviews({})
                </span>
            </div>
        </div>
    );

    return (
        <>
            {/* <Button className='bg-transparent text-black tracking-wider' style={{textDecoration: 'underline'}} onClick={() => {window.history.back()}}>{'<Back'}</Button> */}
        <div className='mt-3' style={styles.container}>
            {/* Modal for Delete Confirmation */}
            <Modal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                style={{ zIndex: 1050 }} // Ensure modal is above other elements
                backdropStyle={{ zIndex: 1040 }} // Ensure backdrop is behind modal
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {productToDelete && (
                <p style={{ color: 'black' }}>
                    Are you sure you want to delete the product "{productToDelete.name}"?
                </p>
            )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteProduct}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>


           <div style={styles.sidebar}>
                <div style={styles.headerContainer}>
                    <h2 style={styles.header}>Category</h2>
                    <button onClick={handleOpenModal} style={styles.addButton}>
                        <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '8px' }} />
                    </button>
                    {categoryModel({
                        isOpen: modalOpen,
                        onClose: handleCloseModal,
                        onSubmit: handleAddCategory,
                        category: selectedCategory,
                        setCategory: setSelectedCategory,
                        parentCategories: parentCategories,
                        categories: categories
                    })}
                </div>
                {noCategoriesMessage && <p>{noCategoriesMessage}</p>}

                <div style={styles.categoryContainer}>
                    {categories.filter(category => !category.parent).map(parent => (
                        <div key={parent._id} style={styles.parentCategory}>
                            <div onClick={() => toggleExpand(parent._id)} style={styles.parentHeader}>
                                {parent.name} {expandedCategories[parent._id] ? '−' : '+'}
                            </div>
                            {expandedCategories[parent._id] && (
                                <div style={styles.childCategories}>
                                    {categories.filter(child => child.parent === parent._id).map(child => (
                                        <div
                                            key={child._id}
                                            style={{
                                                ...styles.childCategory,
                                                ...(selectedCategory === child._id ? styles.childHeaderSelected : {}),
                                            }}
                                            onMouseEnter={() => setHoveredCategory(child._id)}
                                            onMouseLeave={() => setHoveredCategory(null)}
                                        >
                                            <div
                                                onClick={() => toggleExpand(child._id)}
                                                style={styles.childHeader}
                                            >
                                                {child.name} {expandedCategories[child._id] ? '−' : '+'}
                                                
                                                {/* Show delete button for child category */}
                                                {hoveredCategory === child._id && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteCategory(child._id);
                                                        }}
                                                        style={{
                                                            ...styles.deleteButton,
                                                            display: 'inline-block',  // Always show button on hover
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.color = '#dc3545'}
                                                        onMouseLeave={(e) => e.target.style.color = 'grey'}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                )}
                                            </div>

                                            {expandedCategories[child._id] && (
                                                <div style={styles.subChildCategories}>
                                                    {categories.filter(subChild => subChild.parent === child._id).map(subChild => (
                                                        <div
                                                            key={subChild._id}
                                                            style={{
                                                                ...styles.subChildCategory,
                                                                ...(selectedCategory === subChild._id ? styles.subChildHeaderSelected : {}),
                                                            }}
                                                            onMouseEnter={() => setHoveredCategory(subChild._id)}
                                                            onMouseLeave={() => setHoveredCategory(null)}
                                                            onClick={() => handleSelectCategory(subChild)}
                                                        >
                                                            <div style={styles.subChildHeader}>
                                                                {subChild.name}
                                                                
                                                                {/* Show delete button for sub-child category */}
                                                                {hoveredCategory === subChild._id && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteCategory(subChild._id);
                                                                        }}
                                                                        style={{
                                                                            ...styles.deleteButton,
                                                                            display: 'inline-block',  // Always show button on hover
                                                                        }}
                                                                        onMouseEnter={(e) => e.target.style.color = '#dc3545'}
                                                                        onMouseLeave={(e) => e.target.style.color = 'grey'}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

                {/* Content Area */}
                <div style={styles.contentArea}>
                    <div className='text-center' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Products</h2>
                        <button onClick={() => handleAddProductRedirect()} style={styles.addProductButton}>
                            <FontAwesomeIcon icon={faPlusCircle} /> New Product
                        </button>
                    </div>
                    
                    {selectedCategory.category ? (
                        <>
                            {/* <h3>{selectedCategory.category.name}-{selectedCategory.parent.name}</h3> */}
                            <p>
                                {selectedCategory.grandParent ? `${selectedCategory.grandParent.name} / ` : ''}
                                {selectedCategory.parent ? `${selectedCategory.parent.name} / ` : ''}
                                {selectedCategory.category.name}
                                <a style={{cursor:'pointer', color:'red', marginLeft:'10px'}} onClick={()=>{setSelectedCategory('')}}>All categories</a>
                            </p>

                            {/* Display Products */}
                            <div className="seller-product-list">
                                {filteredProducts.length === 0 ? (
                                    // Check if there are products in the product list    
                                    <div className="d-flex flex-col justify-center">
                                        <img src={NoProduct} alt="No products" style={{ maxWidth: '200px', marginBottom: '10px' }} />
                                        <span>No Products Found in your selected Category</span>
                                    </div>                            
                                ) : (
                                    <div className="seller-product-grid" style={styles.sellerProductGrid}>
                                        {filteredProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="seller-product-grid" style={styles.sellerProductGrid}>
                            {productList.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    
            </div>
        {/* Modal Component */}
        {/* <Model
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleAddCategory}
            category={newCategory}
            setCategory={setNewCategory}
            parentCategories={categories.filter(cat => !cat.parent)}
            categories={categories}
        /> */}
        </div>
        </>
    );    
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        // padding: '20px',
        backgroundColor: '#f4f4f4',
        margin: '10px',
        marginTop: '0px'
    },
    sidebar: {
        width: '300px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginRight: '20px',
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',  // Space between heading and button
        alignItems: 'center',  // Center align vertically
        marginBottom: '20px',  // Add space below the header
    },
    header: {
        margin: 0,  // Remove default margin for h2
    },
    addButton: { 
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '5px',  // You can adjust this for more rounded corners if desired
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',  // Change this to space-between for even spacing
        padding: '10px 15px',  // Adjust padding for a rectangular shape
    },    
    
    contentArea: {
        flex: 1,
        height:'100%',
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    categoryContainer: {
        marginTop: '20px',
    },
    parentCategory: {
        marginBottom: '10px',
    },
    parentHeader: {
        fontWeight: 'bold',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#e9ecef',
        transition: 'background-color 0.3s, padding-left 0.3s',
        paddingLeft: '10px',  // Add padding for hierarchy effect
    },
    childCategories: {
        marginLeft: '15px',  // Increased for better indentation
        marginTop: '5px',
    },
    childCategory: {
        marginBottom: '5px',
        position: 'relative',
    },
    childHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold',
        padding: '8px 10px',
        borderLeft: '2px solid transparent',
        borderRadius: '0 5px 5px 0',
        cursor: 'pointer',
        backgroundColor: '#f9f9f9', 
        transition: 'background-color 0.3s, border-left 0.3s, padding-left 0.3s',
        paddingLeft: '15px',
        position: 'relative',
    },
    childHeaderSelected: {
        borderLeft: '2px solid #333',  // Different border color for selection
    },
    subChildCategory: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px 10px',
        borderLeft: '2px solid transparent',
        borderRadius: '0 5px 5px 0',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        transition: 'background-color 0.3s, border-left 0.3s, padding-left 0.3s',
        paddingLeft: '20px',  // Additional padding for hierarchy effect
    },
    deleteButton: { 
        marginLeft: '8px',  // Add margin for spacing
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '0',
        fontSize: '16px',
        transition: 'color 0.3s',
        color: 'grey',
    },
    subChildHeader: {
        display: 'flex',  // Ensure it's a flex container
        justifyContent: 'space-between',  // Space between name and button
        alignItems: 'center',  // Center align vertically
        padding: '5px 10px',
        borderLeft: '2px solid transparent',
        borderRadius: '0 5px 5px 0',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        transition: 'background-color 0.3s, border-left 0.3s, padding-left 0.3s',
        paddingLeft: '20px',  // Additional padding for hierarchy effect
    },
    subChildHeaderSelected: {
        borderLeft: '2px solid green',
    },

    sellerProductGrid: {
        display: 'flex',
        flexWrap: 'wrap', // Allow cards to wrap onto the next line
        justifyContent: 'left', // Space out the cards
        gap: '20px', // Space between cards
    },
    sellerProductCard: {
        flex: '0 1 calc(30% - 10px)', // More compact width calculation
        maxWidth: 'calc(30% - 10px)',
        marginBottom: '10px',
        borderRadius: '5px',
        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.15)', // Slightly deeper shadow for card definition
        transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: '#fff',
        overflow: 'hidden',
        padding: '5px', // Adjusted padding for content breathing space
        height: '300px',
    },
    sellerProductCardImage: {
        height: '130px', // Reduced image height for a compact look
        overflow: 'hidden',
        borderRadius: '6px',
        marginBottom: '10px', // Spacing below image
    },
    sellerProductImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.2s ease-in-out', // Smooth zoom on hover
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px',
    },
    productTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        overflow: 'hidden', // Prevents overflow text
        whiteSpace: 'nowrap', // Keeps title in one line
        textOverflow: 'ellipsis', // Adds ellipsis for long titles
    },
    sellerProductCardDetails: {
        padding: '5px',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '14px',
        color: '#555',
        lineHeight: '0.5',
    },
    sellerProductCardActions: {
        display: 'flex',
        gap: '5px', // Adds spacing between buttons
    },
    editButton: {
        fontSize: '12px',
        padding: '4px 8px',
        borderRadius: '4px',
    },
    deleteBtn: {
        fontSize: '12px',
        padding: '4px 8px',
        borderRadius: '4px',
    },
    sellerProductCardHover: {
        transform: 'scale(1.02)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },

    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '400px',
    },
    modalTitle: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        height: '60px',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    select: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    submitButton: {
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    cancelButton: {
        padding: '10px 15px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    addProductButton: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default Catalogue;