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
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories(token);
            setCategories(data);
            if (data.length === 0) {
                setNoCategoriesMessage('No categories found. Please add a new category.');
            } else {
                setNoCategoriesMessage('');
            }
        } catch (error) {
            console.error('Error fetching categories:', error); // Log the error for debugging purposes
            if (error.response && error.response.status === 404) {
                setNoCategoriesMessage('No categories found');
            } else {
                setNoCategoriesMessage('An error occurred while fetching categories. Please try again later.');
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
          alert('Category Created Successfully');

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
                fetchCategories();
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
    return (
        <>
        <Button className='bg-transparent text-black tracking-wider' style={{textDecoration: 'underline'}} onClick={() => {window.history.back()}}>{'<Back'}</Button>
        <div style={styles.container}>
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
                        <div key={parent._id} style={styles.parentCategory}
                        >
                            <div onClick={() => toggleExpand(parent._id)} 
                                style={styles.parentHeader}
                                onMouseEnter={() => setHoveredCategory(parent._id)}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                {parent.name} {expandedCategories[parent._id] ? '−' : '+'}
                                {/* Show delete button for parent category */}
                                {hoveredCategory === parent._id && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCategory(parent._id);
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
            <div className="text-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Categorical View</h2>
            </div>

            {selectedCategory.category ? (
                <>
                <p>
                    {/* Build the hierarchical path */}
                    {selectedCategory.grandParent && (
                    <>
                        {selectedCategory.grandParent.name} /{' '}
                    </>
                    )}
                    {selectedCategory.parent && (
                    <>
                        {selectedCategory.parent.name} /{' '}
                    </>
                    )}
                    {selectedCategory.category.name}
                    
                    {/* Reset link to clear the selected category */}
                    <a
                    style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}
                    onClick={() => setSelectedCategory('')}
                    >
                    Reset
                    </a>
                </p>

                {/* Products or other category-specific content can go here */}
                </>
            ) : (
                <p>No Category Selected</p>
            )}
            </div>

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
        display: 'flex',
        justifyContent: 'space-between',
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
    subsubChildCategories: {
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