import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Gigs.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [user, setUser] = useState();
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('collections');
  const [collections, setCollections] = useState([]);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [newCollectionImage, setNewCollectionImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [newItemFile, setNewItemFile] = useState([]);
  const [itemType, setItemType] = useState('image');
  const [activeContentTab, setActiveContentTab] = useState('images'); 
  const [showAddContent, setShowAddContent] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const url = 'http://localhost:3001/uploads/';
  const backendUrl = 'http://localhost:3001';
  const openMediaModal = (item) => setSelectedMedia(item);
  const closeMediaModal = () => setSelectedMedia(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, [token])

  const [services, setServices] = useState([]); // Change to fetch services
  const [plans, setPlans] = useState({
      basic: { active: false, price: '', deliveryTime: '' },
      premium: { active: false, price: '', deliveryTime: '' },
  });
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
    fetchGig();
  }, [token]);

  const fetchGig = async () => {
    try {
      const response = await axios.get('http://localhost:3001/gigs/myGig', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGigs(response.data);
    } catch (error) {
      console.error('Error fetching gig:', error);
    }
  }


// Toggle the plan’s active status and clear selectedPlan if deactivated
const handlePlanToggle = (planName) => {
    setPlans(prevPlans => {
        const updatedPlans = {
            ...prevPlans,
            [planName]: { ...prevPlans[planName], active: !prevPlans[planName].active }
        };
        
        // Clear selectedPlan if the toggled plan is being deactivated
        if (!updatedPlans[planName].active && selectedPlan === planName) {
            setSelectedPlan(null);
        }

        return updatedPlans;
    });
};

// Set selected plan only if it’s active
const handlePlanClick = (planName) => {
    if (plans[planName].active) {
        setSelectedPlan(planName);
    }
};

// Handle input changes for price and deliveryTime fields
const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Ensure selectedPlan is set before updating
    if (selectedPlan) {
        setPlans(prevPlans => ({
            ...prevPlans,
            [selectedPlan]: { ...prevPlans[selectedPlan], [name]: value }
        }));
    }
};

// Handle save operation
const handleSave = () => {
    // Optionally perform validation or other actions
    setSelectedPlan(null); // Close edit form or modal after saving
};

  

const addCollection = async () => {
  if (newCollectionTitle && newCollectionImage) {
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      try {
        // Prepare data for backend request
        const newCollection = {
          title: newCollectionTitle,
          image: reader.result, // Base64 encoded image data
          items: [] // Assuming empty items array for a new collection
        };

        // Send POST request to backend
        const response = await axios.post('http://localhost:3001/gigs/collections', newCollection);
        
        // Update local collections state with the new collection from the response
        setCollections([...collections, response.data]);
        
        // Reset form and close modal
        setNewCollectionTitle('');
        setNewCollectionImage(null);
        setShowModal(false);
      } catch (error) {
        console.error("Error creating collection:", error);
        // Optionally, display an error message to the user
      }
    };

    reader.readAsDataURL(newCollectionImage);
  }
};

const handleCollectionSelect = (index) => setSelectedCollection(index);

const addItemToCollection = () => {
  if (selectedCollection !== null && newItemFile.length > 0) {
    const updatedCollections = [...collections];
    const collection = updatedCollections[selectedCollection];

    const readFiles = Array.from(newItemFile).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ type: itemType, url: reader.result });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readFiles).then((itemsToAdd) => {
      collection.items = [...collection.items, ...itemsToAdd];
      setCollections(updatedCollections);
      setNewItemFile([]); 
      setShowAddContent(false);
    });
  }
};


const renderCollection = (collection, index) => (
  <div className='d-flex flex-col'>
    <div 
      key={index} 
      className="bg-white shadow-md mx-2 rounded-full w-20 h-20 flex flex-col items-center justify-center mx-2 cursor-pointer overflow-hidden" 
      onClick={() => handleCollectionSelect(index)}
    >
      <img 
        src={collection.image} 
        alt={collection.title} 
        className="w-full h-full object-cover" 
        style={{ borderRadius: '50%' }} 
      />
    </div>
    <h3 className="text-center text-sm m-0 mt-1">{collection.title}</h3>
  </div>
);

const renderAddCollectionButton = () => (
  <div 
    className="bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-2 cursor-pointer" 
    onClick={() => setShowModal(true)}
  >
    <span className="text-white text-2xl">+</span>
  </div>
);

const renderCollectionContent = (collection) => (
  <div className="mt-2">
    <div className="flex mb-4">
      <button 
        className={`px-4 py-2 rounded ${activeContentTab === 'images' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`} 
        onClick={() => setActiveContentTab('images')}
      >
        Images
      </button>
      <button 
        className={`px-4 py-2 rounded ${activeContentTab === 'videos' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} ml-2`} 
        onClick={() => setActiveContentTab('videos')}
      >
        Videos
      </button>
    </div>

    {activeContentTab === 'images' && (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collection.items.filter(item => item.type === 'image').map((item, idx) => (
          <div key={idx} className="rounded-lg overflow-hidden shadow">
            <img 
              src={item.url} 
              alt={`Image ${idx}`} 
              className="w-full h-56 object-cover"
              onClick={() => openMediaModal(item)}
            />
          </div>
        ))}
      </div>
    )}

    {activeContentTab === 'videos' && (
      <Slider {...sliderSettings}>
        {collection.items.filter(item => item.type === 'video').map((item, idx) => (
          <div key={idx} className="slide">
            <video controls className="w-full rounded-lg" onClick={() => openMediaModal(item)}>
              <source src={item.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </Slider>
    )}
  </div>
);

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

  return (
    <div className="flex flex-col items-start p-4 max-w-screen-lg mx-auto bg-white rounded">
        {gigs.map((gig, index) => (
  <section key={index} className="flex bg-gray-100 rounded-lg shadow-md p-4 mb-3 w-full" style={{ alignItems: 'center' }}>
    <img 
      src={gig.gigImage ? (url + gig.gigImage) : "https://via.placeholder.com/150"}
      alt="Gig Image" 
      className="rounded-full w-32 h-32 mr-4"
    />
    <div className="flex-1">
      <h1 className="text-2xl font-bold mb-1">{gig.title || 'Untitled Gig'}</h1>
      <p><strong>Bio:</strong> {gig.description || 'No Bio available'}</p>
    </div>
  </section>
))}


      <div className="flex w-full bg-white ">
        <aside className="bg-gray-100 p-3 place-items-center shadow-md rounded-lg w-2/5 mr-4">
          <div className='d-flex gap-2' style={{alignItems:'center'}} >
          <h2 className="text-lg w-full font-bold mb-1">Services Offering</h2>
          <span className='cursor-pointer' onClick={()=>{alert('edit service button clicked')}}>
            <FontAwesomeIcon icon={faEdit}/>
          </span>
          </div>
          <ul className="space-y-2 p-0">
          {services.map((service, index) => (
            <li key={index} className="bg-white p-2 rounded shadow">{service}</li>
          ))}
          </ul>

          <h2 className="text-lg text-center w-full font-bold mt-4 mb-2">Plans</h2>
          <ul className="space-y-2 p-0">
              {Object.entries(plans).map(([planName, planDetails]) => (
                  <li key={planName} className={`p-2 rounded shadow ${planDetails.active ? 'bg-green-100' : 'bg-gray-200'}`}>
                      <label className="flex items-center space-x-2">
                          <input
                              type="checkbox"
                              checked={planDetails.active}
                              onChange={() => handlePlanToggle(planName)}
                          />
                          <span className="font-semibold cursor-pointer" >
                              {planName.charAt(0).toUpperCase() + planName.slice(1)} Plan
                          </span>
                      </label>
                      {planDetails.active && (
                          <span onClick={() => handlePlanClick(planName)} className="text-sm cursor-pointer">Click to edit plan details</span>
                      )}
                  </li>
              ))}
          </ul>

        {/* Editable Form for Selected Plan */}
        {selectedPlan && (
            <div className="bg-white p-4 rounded shadow mt-4">
                <h3 className="font-bold text-lg mb-2">Edit {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan</h3>
                <label className="block mb-2">
                    <span>Price:</span>
                    <input
                        type="number"
                        name="price"
                        value={plans[selectedPlan].price}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter price"
                    />
                </label>
                <label className="block mb-2">
                    <span>Delivery Time (days):</span>
                    <input
                        type="number"
                        name="deliveryTime"
                        value={plans[selectedPlan].deliveryTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter delivery time"
                    />
                </label>
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                </button>
            </div>
        )}

        </aside>

        <main className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md w-full">
          {activeTab === 'collections' && (
            <section className="w-full">
              <div className="flex overflow-x-auto overflow-y-auto mb-2">
                <div className='d-flex flex-col'>
                  {renderAddCollectionButton()}
                  <p className="text-center text-sm m-0 mt-1">Add Collection</p>
                </div>
                {collections.length !== 0 && collections.map((collection, index) => renderCollection(collection, index))}
              </div>

              {selectedCollection !== null && (
                <div className="mb-4 mt-6">
                  <h3 className="text-xl font-semibold text-center">{collections[selectedCollection].title}</h3>
                  <button 
                    onClick={() => setShowAddContent(!showAddContent)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    <FontAwesomeIcon icon={faAdd} /> New Content
                  </button>
                </div>
              )}

              {selectedCollection !== null && showAddContent && (
                <div className="flex my-4 p-1 border-1 rounded gap-2 justify-between">
                  <input type="file" multiple onChange={(e) => setNewItemFile(e.target.files)} className="my-2" />
                  <select value={itemType} onChange={(e) => setItemType(e.target.value)} className="my-2 bg-gray-100 border-1 rounded">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <button onClick={addItemToCollection} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add Item
                  </button>
                </div>
              )}

            {/* Render Content for Selected Collection */}
            {selectedCollection !== null && renderCollectionContent(collections[selectedCollection])}

            </section>
          )}
        </main>

      </div>

      {/* Modal for adding new collection */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Collection</h2>
            <input 
              type="text" 
              value={newCollectionTitle} 
              onChange={(e) => setNewCollectionTitle(e.target.value)} 
              placeholder="Collection Title" 
            />
            <input 
              type="file" 
              onChange={(e) => setNewCollectionImage(e.target.files[0])} 
            />
            <button onClick={addCollection} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
            <button onClick={() => setShowModal(false)} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}

      {/* Modal for media preview */}
      {selectedMedia && (
        <div className="modal">
          <div className="modal-content">
            {selectedMedia.type === 'image' ? (
              <img src={selectedMedia.url} alt="Selected" />
            ) : (
              <video controls src={selectedMedia.url} />
            )}
            <button onClick={closeMediaModal} className="bg-red-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gigs;
