import React, { useState, useEffect } from "react";
// import Slider from 'react-slick';
// import 'material-icons/iconfont/material-icons.css';
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Gigs.css";
import EditGigModal from "./EditGig.js";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faTimes,
  faSquarePlus,
  faEdit,
  faEllipsisV,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const Gigs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // Attempt to retrieve the user data from localStorage
    const savedUser = localStorage.getItem("user");

    // Parse the JSON data if it exists, otherwise default to null
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [gigs, setGigs] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const token = localStorage.getItem("token");
  
  const [expandedService, setExpandedService] = useState({});
  const [activePlan, setActivePlan] = useState({});

  const toggleExpand = (serviceIndex) => {
    setExpandedService((prevExpanded) => {
      const isCurrentlyExpanded = prevExpanded[serviceIndex];

      // If expanding a new service, set its active plan to 'Basic'
      if (!isCurrentlyExpanded) {
        setActivePlan((prevActivePlan) => ({
          ...prevActivePlan,
          [serviceIndex]: "Basic",
        }));
      }

      return {
        ...prevExpanded,
        [serviceIndex]: !isCurrentlyExpanded,
      };
    });
  };

  const handlePlanSelection = (serviceIndex, planName) => {
    setActivePlan((prevActivePlan) => ({
      ...prevActivePlan,
      [serviceIndex]: planName,
    }));
  };

  const [newCollectionTitle, setNewCollectionTitle] = useState("");
  const [newCollectionImage, setNewCollectionImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState();

  const [comment, setComment] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const [newItemFile, setNewItemFile] = useState([]);
  const [showAddContent, setShowAddContent] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const url = "http://localhost:3001/uploads/";
  const backendUrl = "http://localhost:3001/";
  const openMediaModal = (item) => setSelectedMedia(item);
  const closeMediaModal = () => setSelectedMedia(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  // const imageUrl = "http://localhost:3001/uploads/cover.jfif";

  const handleEditToggle = () => {
    setShowEditModal(!showEditModal);
  };

  useEffect(() => {
    fetchGig();
    // console.log(gigs[0]?.services);
    if (user) {
      if (!gigs) {
        navigate("/tailor/Gigs/add");
      }
    }
  }, [navigate]);

  const fetchGig = async () => {
    try {
      const response = await axios.get("http://localhost:3001/gigs/myGig", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGigs(response.data);
    } catch (error) {
      console.error("Error fetching gig:", error);
    }
  };

  const deleteCollection = async () => {
    const confirmDelete = window.confirm(
      `Deleting Collection "${gigs[0].collections[selectedCollection].title}"`
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(
        `http://localhost:3001/gigs/${gigs[0]._id}/collections/${gigs[0].collections[selectedCollection]._id}`
      );

      fetchGig();
    } catch (error) {
      console.error("Error deleting collection:", error);
      alert("Failed to delete the collection. Please try again.");
    }
  };

  const deleteService = async (serviceId) => {
    if(!gigs[0]){
      return;
    }
    // Confirm with the user before proceeding with deletion
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this service?`
    );

    if (!isConfirmed) {
      return; // If the user cancels, exit the function
    }

    

    try {
      // Make a DELETE request to the backend to delete the service
      await axios.delete(
        `http://localhost:3001/gigs/services/delete/${gigs[0]._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
          data: { Id: serviceId }, // Include the service name in the request body
        }
      );

      fetchGig();
    } catch (error) {
      console.error("Error deleting service:", error);

      // Check if the error response exists and handle specific status codes
      if (error.response) {
        if (error.response.status === 404) {
          alert("Error: Gig not found.");
        } else if (error.response.status === 400) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert("There was an error deleting the service.");
        }
      } else {
        alert("Network error. Please try again.");
      }
    }
  };

  const addCollection = async () => {
    if (newCollectionTitle && newCollectionImage) {
      try {
        // Prepare FormData for backend request
        const formData = new FormData();
        formData.append("title", newCollectionTitle);
        formData.append("image", newCollectionImage);

        // Send POST request to backend
        await axios.post(
          `http://localhost:3001/gigs/collections/add/${gigs[0]._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        fetchGig();
        // Reset form and close modal
        setNewCollectionTitle("");
        setNewCollectionImage(null);
        setShowModal(false);
      } catch (error) {
        console.error("Error creating collection:", error);
        // Optionally, display an error message to the user
      }
    }
  };

  const handleCollectionSelect = (index) => {
    setSelectedCollection(index);
  };

  const addItemToCollection = async () => {
    if (!gigs[0].collections[selectedCollection]) {
      alert("Please select a collection");
      return;
    }

    if (!comment || !newItemFile || newItemFile.length !== 1) {
      alert("Please provide a comment and upload exactly one image or video.");
      return;
    }

    // Validate that the comment does not contain dangerous characters
    const safeCommentPattern = /^[a-zA-Z0-9\s.,!%&|?'-]*$/;
    if (!safeCommentPattern.test(comment)) {
      alert(
        "Comment contains invalid characters. Only letters, numbers, and basic punctuation are allowed."
      );
      return;
    }

    // Validate the file size (limit to 10MB)
    const file = newItemFile[0];
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxFileSize) {
      alert("File size should not exceed 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("comment", comment); // Optional: Add a comment if needed
    formData.append("file", file); // Append the single file

    try {
      await axios.post(
        `${backendUrl}gigs/${gigs[0]._id}/collections/${gigs[0].collections[selectedCollection]._id}/items`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchGig();

      setNewItemFile([]);
      setComment("");
      setShowAddContent(false);
      alert("item Added Successfully");
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item to collection. Please try again.");
    }
  };

  // Function to render collections with unique keys and onClick handling
  const renderCollection = (collection, index) => (
    <div key={collection._id} className="d-flex flex-col">
      <div
        className="bg-white shadow-md mx-2 rounded-full w-20 h-20 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => handleCollectionSelect(index)}
      >
        <img
          src={
            collection.image
              ? `${url}${collection.image}`
              : `${url}no-image.png`
          }
          alt={collection.title}
          className="w-full h-full object-cover rounded-full"
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

  const renderCollectionContent = (collection) => {
    // Toggle options for a specific post
    const handleToggleOptions = (index) => {
      setShowOptions(showOptions === index ? null : index);
    };

    const handleDeletePost = async (itemId) => {
      if (itemId) {
        const token = localStorage.getItem("token");
        const route = `${backendUrl}gigs/${gigs[0]._id}/collections/${gigs[0].collections[selectedCollection]._id}/items/${itemId}`;

        if (token) {
          try {
            const response = await axios.delete(route, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.status === 200 || response.status === 201) {
              // Update the gigs state by removing the deleted item
              setGigs((prevGigs) => {
                const updatedGigs = [...prevGigs];
                const collection =
                  updatedGigs[0].collections[selectedCollection];

                // Remove the item with the specified itemId from the items array
                collection.items = collection.items.filter(
                  (item) => item._id !== itemId
                );

                return updatedGigs;
              });
            } else {
              alert(response.statusText);
            }
          } catch (error) {
            alert("An error occurred: " + error);
          }
        }
      } else {
        alert("Item does not exist or has been deleted already.");
      }
    };

    return (
      <>
        <h3 className="text-xl font-semibold text-center">
          {gigs[0]?.collections[selectedCollection]?.title || ""}
        </h3>

        <div className="m-0 flex gap-2 justify-end bg-gray-100">
          <button
            onClick={() => setShowAddContent(!showAddContent)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            <FontAwesomeIcon icon={faAdd} /> Post
          </button>
          <button
            className="text-white mr-2 bg-red-500 p-2 rounded"
            onClick={deleteCollection}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>

        {/* Show content input only if 'showAddContent' is true */}
        {showAddContent && (
          <div className="flex flex-col bg-gray-100 m-4 p-1 border-1 rounded gap-2 justify-between">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Message"
              className="p-2 border rounded"
              minLength={5}
              maxLength={50}
              required
            />
            {comment.trim().length > 0 &&
              (() => {
                const wordCount = comment
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean).length;
                return wordCount < 5 || wordCount > 50 ? (
                  <p className="text-red-500 text-sm">
                    Message must be between 5 and 50 words.
                  </p>
                ) : null;
              })()}
            <div className="flex justify-center">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setNewItemFile(e.target.files)}
                className="my-2"
              />
              <button
                onClick={addItemToCollection}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add Item
              </button>
            </div>
          </div>
        )}

        <div className="mb-5 space-y-12 bg-gray-100">
          <div className="flex flex-col items-center space-y-12">
            {collection?.items && collection.items.length > 0 ? (
              collection.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-lg w-full p-4 border border-gray-200 md:w-5/6 lg:w-4/5 xl:w-3/4 2xl:w-2/3 mt-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <img
                        src={
                          user.profile.profilePicture
                            ? `${url}${user.profile.profilePicture}`
                            : `${url}no-image.jpg`
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 mb-0 text-sm">
                          {user.profile.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 mb-0">
                          Posted on{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => handleToggleOptions(idx)}
                        className="bg-transparent text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>

                      {showOptions === idx && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 p-0">
                          <ul className="p-0">
                            <li
                              onClick={() => handleDeletePost(item._id)}
                              className="block px-4 py-2 mt-1 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600 cursor-pointer"
                            >
                              Delete Post
                            </li>
                            <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                              Edit Post
                            </li>
                            <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                              Report Post
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mb-2 text-sm">{item.comment}</p>

                  <div className="rounded-lg bg-gray-900 overflow-hidden mb-8 w-full max-w-5xl mx-auto h-[400px]">
                    {/\.(mp4|mov|avi|webm|mkv)$/.test(item.url) ? (
                      <video
                        controls
                        className="w-full h-full object-cover"
                      >
                        <source src={item.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={
                          item.url
                            ? item.url
                            : `${backendUrl}uploads/no-image.jpg`
                        }
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={() => openMediaModal(item)}
                      />
                    )}
                  </div>

                  <div className="flex justify-around text-gray-600 text-xs mt-4">
                    <button className="text-gray-900 bg-transparent hover:text-red-500 transition flex items-center gap-1">
                      <span className="material-icons">favorite</span> Like
                    </button>
                    <button className="text-gray-900 bg-transparent hover:text-red-500 transition flex items-center gap-1">
                      <span className="material-icons">heart_broken</span>{" "}
                      Dislike
                    </button>
                    <button className="text-gray-900 bg-transparent hover:text-red-500 transition flex items-center gap-1">
                      <span className="material-icons">ios_share</span> Share
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center text-sm">
                No items to display
              </p>
            )}
          </div>
        </div>
      </>
    );
  };

  const ServiceModal = ({ onClose, gigs, setGigs }) => {
    const [serviceName, setServiceName] = useState("");
    const [plans, setPlans] = useState({
      Basic: { price: "", deliveryDays: "" },
      Premium: { price: "", deliveryDays: "" },
    });
  
    const token = localStorage.getItem("token");
  
    const handlePlanChange = (planName, field, value) => {
      setPlans((prevPlans) => ({
        ...prevPlans,
        [planName]: { ...prevPlans[planName], [field]: value },
      }));
    };
  
    const handleSave = async () => {
      if (!serviceName.trim()) {
        alert("Service name cannot be empty");
        return;
      }
  
      const newService = {
        name: serviceName,
        plans: Object.entries(plans).map(([name, details]) => ({
          name,
          price: parseFloat(details.price),
          deliveryDays: parseInt(details.deliveryDays, 10),
        })),
      };
  
      try {
        const response = await axios.post(
          `http://localhost:3001/gigs/services/${gigs[0]._id}`,
          newService,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.status === 200 || response.status === 201) {
          setGigs((prevGigs) => {
            const updatedGigs = [...prevGigs];
            updatedGigs[0].services.push(newService);
            return updatedGigs;
          });
        }
        onClose();
      } catch (error) {
        console.error("Error adding service:", error);
        alert("There was an error adding the service.");
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
        <div className="m-5 bg-white p-4 rounded-lg shadow-lg max-w-lg w-full max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add New Service</h2>
            <button onClick={onClose} className="bg-transparent text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
  
          <label className="block">
            <span className="text-sm font-semibold">Service Name:</span>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Enter service name"
              className="w-full p-2 m-0 border rounded"
            />
          </label>  
          <div className="grid grid-cols-1 gap-4 ">
            {["Basic", "Premium"].map((planName) => (
              <div key={planName} className="flex flex-col border p-2 rounded-lg shadow-sm">
                <h4 className="text-md font-semibold text-gray-700 m-0">{planName} Plan</h4>
                <div className="flex gap-2">
                  <label className="block mb-0">
                    <span className="text-sm font-medium">Price:</span>
                    <input
                      type="number"
                      value={plans[planName].price}
                      onChange={(e) => handlePlanChange(planName, "price", e.target.value)}
                      className="w-full p-2 m-0 border rounded"
                      placeholder="Enter price"
                    />
                  </label>
                  <label className="block mb-0">
                    <span className="text-sm font-medium">Delivery Days:</span>
                    <input
                      type="number"
                      value={plans[planName].deliveryDays}
                      onChange={(e) => handlePlanChange(planName, "deliveryDays", e.target.value)}
                      className="w-full p-2 m-0 border rounded"
                      placeholder="Enter delivery days"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
  
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Service
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  

  return (
    <div
      className="flex flex-col items-start p-4 max-w-screen-lg mx-auto bg-gray-100 rounded"
      style={{ alignItems: "center" }}
    >
      {gigs[0] ? ( 
        <>
          <section className="flex bg-gray-100 rounded-lg shadow-md mb-3 w-full bg-white">
            {gigs.map((gig, index) => (
              <div
                key={index}
                className="w-full bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 shadow-lg rounded-lg overflow-hidden">
                {/* Gig Image */}
                <div className="relative">
                <img
                  src={
                    gig.gigImage
                      ? `${url}${gig.gigImage}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Gig"
                  className="w-32 h-32 bg-gray-800 rounded-full ml-3 mr-4"
                />
                </div>

                <div className="flex-1 text-white ml-2 mt-2">
                  {/* Gig Title */}
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold mb-1">
                      {gig.title || "N/A"}
                    </h1>
                    <button
                      onClick={handleEditToggle}
                      className="ml-2 bg-transparent text-white underlined"
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                      />
                      Edit
                    </button>
                  </div>

                  {/* Gig Experience */}
                  <div className="flex items-center">
                    
                      <p>
                        <strong>Experience:</strong>{" "}
                        {`${gig.experience} years` || "N/A"}
                      </p>
                    
                  </div>

                  {/* Gig Description */}
                  <div className="flex items-center">
                    
                      <p>
                        <strong>Bio:</strong> {gig.description || "N/A"}
                      </p>
                    
                  </div>
                </div>
              </div>
            ))}
          </section>
          <div className="flex w-full">
            <aside className="bg-gray-100 p-3 bg-white shadow-md rounded-lg w-2/5 mr-4">              
              <div>
                <div
                  className="d-flex w-full gap-1 mb-2"
                  style={{ justifyContent: "end", alignItems: "center" }}
                >
                  <h2 className="text-lg w-full font-bold mb-0">Services</h2>
                  <span
                    className="flex gap-1 text-sm cursor-pointer"
                    style={{ alignItems: "center" }}
                    onClick={() => setShowServiceModal(true)}
                  >
                    <FontAwesomeIcon icon={faSquarePlus} /> Add
                  </span>
                </div>
                <ul className="space-y-4 p-2 flex flex-col w-full border rounded bg-gray-50">
                  {gigs.length > 0 ? (
                    gigs[0].services && gigs[0].services.length > 0 ? (
                      gigs[0].services.map((service, index) => (
                        <li key={index} className="w-full">
                          <div className="w-full p-2 bg-white shadow rounded-lg border border-gray-200 mb-0">
                            <div className="flex flex-col p-1 cursor-pointer"
                              onClick={() => toggleExpand(index)} >
                              <div className="flex justify-between items-center m-0">
                                <h2 className="text-sm m-0 font-normal text-gray-800">{service.name}</h2>
                                <button onClick={() => deleteService(service._id)}  className="bg-transparent text-gray-500 hover:text-red-500">
                                  <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                              </div>

                              {/* Expandable Plans Section */}
                              <button className="w-full bg-transparent text-left text-blue-600 text-sm font-medium">
                                {expandedService[index] ? "Hide Plans" : "View Plans"}
                              </button>
                            </div>

                            {expandedService[index] && (
                              <div className="mt-3">
                                <div className="flex gap-4 border-b pb-2 mb-3">
                                  {service.plans.map((plan) => (
                                    <button
                                      key={plan.name}
                                      onClick={() => handlePlanSelection(index, plan.name)}
                                      className={`py-1 bg-transparent text-sm font-medium ${
                                        activePlan[index] === plan.name ? 'text-blue-600 border-blue-600 border-b-2' : 'text-gray-500 hover:text-blue-600'
                                      }`}
                                    >
                                      {plan.name}
                                    </button>
                                  ))}
                                </div>

                                {/* Active Plan Content */}
                                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                  {service.plans.map((plan, idx) =>
                                    activePlan[index] === plan.name ? (
                                      <div key={idx} className="text-sm text-gray-700 space-y-1">
                                        <div className="flex justify-between">
                                          <span>Price:</span>
                                          <span className="font-medium">Rs {plan.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Delivery:</span>
                                          <span className="font-medium">{plan.deliveryDays} days</span>
                                        </div>
                                      </div>
                                    ) : null
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 text-base justify-between bg-white p-4 rounded-lg italic">
                        No services added yet
                      </li>
                    )
                  ) : (
                    <li className="text-gray-500 text-base justify-between bg-white p-4 rounded-lg italic">
                      Gig data is unavailable.
                    </li>
                  )}
                </ul>

              </div>
            </aside>

            <main className="flex flex-col bg-white p-2 rounded-lg shadow-md w-full">
              <section className="w-full border-1 rounded bg-gray-100">
                <div className="flex overflow-x-auto overflow-y-auto mb-2 gap-3 p-2 bg-white">
                  <div className="d-flex flex-col">
                    {renderAddCollectionButton()}
                    <p className="text-center text-sm m-0 mt-1">
                      Add Collection
                    </p>
                  </div>
                  {gigs[0]?.collections.length > 0 &&
                    gigs[0]?.collections.map((collection, index) =>
                      renderCollection(collection, index)
                    )}
                </div>

                {selectedCollection !== null ? (
                  <>
                    {/* Render Content for Selected Collection */}
                    {renderCollectionContent(
                      gigs[0].collections[selectedCollection]
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-center">
                    Please select a collection to view its details.
                  </p>
                )}
              </section>

              {/* Edit Modal */}
              {showEditModal && (
                <EditGigModal
                  gig={gigs[0]}
                  onClose={handleEditToggle}
                  fetchGig={fetchGig}
                />
              )}
            </main>
          </div>
        </>
      ) : (
        <div
          className="d-flex w-full flex-col mt-20 gap-5 justify-center"
          style={{ alignItems: "center" }}
        >
          <p className="text-2xl font-semibold text-center">
            You Don't have Professional Tailor Portfolio Yet, Want to create
          </p>
          <span
            className="p-2 text-white cursor-pointer text-center bg-gray-950 hover:bg-gray-500 rounded"
            onClick={() => {
              navigate("/tailor/Gigs/add");
            }}
          >
            create
          </span>
        </div>
      )}

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
              accept=".png, .jpeg, .jpg, .jfif"
              onChange={(e) => setNewCollectionImage(e.target.files[0])}
            />
            <button
              onClick={addCollection}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal for media preview */}
      {selectedMedia && (
        <div className="modal">
          <div className="modal-content bg-gray-900s">
            {/\.(mp4|mov|avi|webm|mkv)$/.test(selectedMedia.url) ? (
              <video
                controls
                className="w-full h-auto rounded-lg"
                src={selectedMedia.url}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={selectedMedia.url}
                alt="Selected"
                className="object-contain w-full h-[500px] rounded-lg"
              />
            )}
            <button
              onClick={closeMediaModal}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Adding Services */}
      {showServiceModal && (
        <ServiceModal
          onClose={() => setShowServiceModal(false)}
          gigs={gigs}
          setGigs={setGigs}
        />
      )}

    </div>
  );
};

export default Gigs;
