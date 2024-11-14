import React, { useState, useEffect } from "react";
import "./GigAdd.css"; // Custom CSS file for styling
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import loaderAnimation from "./Giff/loader_complete.json"; // Path to your loader JSON file
import axios from "axios"; // Import axios for API requests
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const GigAdd = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  // const [gigs, setGigs] = useState([]);
  // const [user, setUser] = useState(() => {
  //   // Attempt to retrieve the user data from localStorage
  //   const savedUser = localStorage.getItem('user');
    
  //   // Parse the JSON data if it exists, otherwise default to null
  //   return savedUser ? JSON.parse(savedUser) : null;
  // });
  const [gigImage, setGigImage] = useState(null);
  // const [services, setServices] = useState([]); // Change to an array for multiple services
  // const [newService, setNewService] = useState(""); // State to hold new service input

  const [loading, setLoading] = useState(false); // Loader state
  const [errorMessage, setErrorMessage] = useState(""); // Error message for validation
  const [successMessage, setSuccessMessage] = useState(""); // Success message for gig creation

  // Form field states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [experienceYears, setExperienceYears] = useState();

  // useEffect(() => {
  //   fetchGig();
  //   if (user) {
  //     if (!gigs) {
  //       navigate('/tailor/Gigs');
  //     }
  //   }
  // }, [navigate]);


  // const fetchGig = async () => {
  //   const token = localStorage.getItem('token');
  //   try {
  //     const response = await axios.get('http://localhost:3001/gigs/myGig', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setGigs(response.data);
  //   } catch (error) {
  //     console.error('Error fetching gig:', error);
  //   }
  // }

  // Lottie animation settings
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!title) {
      setErrorMessage(t("Title is required."));
      return;
    }
    if (description.length < 5) {
      setErrorMessage(t("Description must be more than 5 words."));
      return;
    }
    // if (services.length === 0) { // Check if services array is empty
    //   setErrorMessage("At least one service type is required.");
    //   return;
    // }
    if (isNaN(experienceYears) || experienceYears < 2) {
      setErrorMessage(t("Minimum 2 Years Experience Required"));
      return;
    }
    
    if (!gigImage) {
      setErrorMessage(t("Please upload a gig picture:"));
      return;
    }

    setLoading(true); // Show loader

    // Create FormData for the API request
    const formData = new FormData();
    formData.append("gigImage", gigImage);
    formData.append("title", title);
    formData.append("description", description);
    // formData.append("services", JSON.stringify(services.map(service => ({ name: service }))));
    formData.append("experience", experienceYears);

    try {
      await axios.post("http://localhost:3001/gigs/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setLoading(false); // Hide loader
      setSuccessMessage(t("Your gig has been successfully created!"));

      // Clear form fields
      setTimeout(() => {
        navigate(-1);        
      }, 1500);

    } catch (error) {
      setLoading(false); // Hide loader
      setErrorMessage(
        error.response?.data?.error ||
        (t("Failed to create the gig. Please try again."))
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/jfif", "image/avif"];
    if (!validImageTypes.includes(file.type)) {
      setErrorMessage(t("Please upload a valid image file (jpg, jpeg, png, jfif, avif)."));
      setGigImage(null);
      return;
    }

    setGigImage(file); // Store the main gig image for uploading
    setErrorMessage(""); // Clear any previous error
  };

  // const addService = (index = services.length) => {
  //   if (newService.trim() === "") {
  //     setErrorMessage("Service cannot be empty.");
  //     return;
  //   }
    
  //   // Update services array by directly assigning the value at the specified index
  //   const updatedServices = [...services];
  //   updatedServices[index] = newService;
  //   setServices(updatedServices);

  //   setNewService(""); // Clear input field
  //   setErrorMessage(""); // Clear error
  // };

  // const removeService = (index) => {
  //   // Remove the service at the specified index
  //   const updatedServices = services.filter((_, i) => i !== index);
  //   setServices(updatedServices);
  // };

  return (
    <div className="max-w-4xl mt-3 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl text-center font-semibold mb-4">
       {t( "Portfolio Details")}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
          {t( "Gig Title:")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter gig title"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Gig Image Upload */}
        <div className="mb-6">
          <label
            htmlFor="gigImage"
            className="block text-sm font-medium text-gray-700"
          >
             {t(" Please upload a gig picture")}<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="gigImage"
            accept="image/jpeg,image/png,image/jpg,image/avif, image/jfif"
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
          {gigImage && (
            <img
              src={URL.createObjectURL(gigImage)}
              alt="Gig preview"
              className="mt-4 w-full h-40 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
          {('Description:')}<span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter gig description"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows="4"
          />
        </div>

        {/* Service Selection */}
        {/* <div className="d-flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            Service Type: <span className="text-red-500">*</span>
          </label>
          <div className="flex" style={{ alignItems: 'center' }}>
            <input
              type="text"
              value={newService} // Bind to newService state
              onChange={(e) => setNewService(e.target.value)} // Update newService state
              className="mt-1 mb-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <button
              type="button"
              onClick={() => addService()} // Call addService to add/replace at the next available position
              className="mt-1 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              Add
            </button>
          </div>

          <ul className="mt-4">
            {services.map((service, index) => (
              <li key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                {service}
                <button
                  type="button"
                  onClick={() => removeService(index)} // Remove service by index
                  className="bg-transparent border-1 rounded text-gray-500 hover:text-red-300"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Experience Years */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
          {t( "Experience Years:")}  <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            placeholder="Enter years of experience"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {loading ? (
              <Lottie
                options={defaultOptions}
                height={50}
                width={50}
                isStopped={false}
                isPaused={false}
              />
            ) : (
              (t( "Create Gig"))
            )}
          </button>
        </div>
      </form>

      {/* Display error or success message */}
      {errorMessage && (
        <div className="mt-4 text-red-500 text-sm">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="mt-4 text-green-500 text-sm">{successMessage}</div>
      )}
    </div>
  );
};

export default GigAdd;
