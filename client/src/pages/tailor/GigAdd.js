import React, { useState, useEffect } from "react";
import "./GigAdd.css"; // Custom CSS file for styling
import Lottie from "react-lottie";
import loaderAnimation from "./Giff/loader_complete.json"; // Path to your loader JSON file
import axios from "axios"; // Import axios for API requests

const GigAdd = () => {
  const [gigImage, setGigImage] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false); // Loader state
  const [errorMessage, setErrorMessage] = useState(""); // Error message for validation
  const [successMessage, setSuccessMessage] = useState(""); // Success message for gig creation

  // Form field states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [basicPrice, setBasicPrice] = useState("");
  const [premiumPrice, setPremiumPrice] = useState("");
  const [basicDeliveryDays, setBasicDeliveryDays] = useState("");
  const [premiumDeliveryDays, setPremiumDeliveryDays] = useState("");
  const [measurementInstructions, setMeasurementInstructions] = useState(
    "Provide measurements in Inches."
  );

  // Lottie animation settings
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Fetch services and materials
  useEffect(() => {
    const fetchServicesAndMaterials = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:3001/services/all", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token if using authentication
          },
        });
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        setErrorMessage("Failed to fetch services.");
      }
    };

    fetchServicesAndMaterials();
  }, []);

  // Update materials when the selected service changes
  const handleServiceChange = (event) => {
    const serviceId = event.target.value;
    setSelectedService(serviceId);
    const selectedServiceData = services.find(
      (service) => service._id === serviceId
    );
    if (selectedServiceData) {
      setMaterials(selectedServiceData.material);
      setSelectedMaterials([]);
    } else {
      setMaterials([]);
      setSelectedMaterials([]);
    }
  };

  // Function to toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle checkbox change
  const handleMaterialChange = (materialId) => {
    setSelectedMaterials((prevSelected) => {
      if (prevSelected.includes(materialId)) {
        return prevSelected.filter((id) => id !== materialId);
      } else {
        return [...prevSelected, materialId];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!title) {
      setErrorMessage("Title is required.");
      return;
    }
    if (description.length < 5) {
      setErrorMessage("Description must be more than 5 words.");
      return;
    }
    if (!selectedService) {
      setErrorMessage("Service type is required.");
      return;
    }
    if (selectedMaterials.length === 0) {
      setErrorMessage("At least one material must be selected.");
      return;
    }
    if (isNaN(experienceYears) || experienceYears < 2) {
      setErrorMessage("Minimum 2 Years Experience Required");
      return;
    }
    if (basicPrice < 1000) {
      setErrorMessage("Basic price must be at least 1000 PKR.");
      return;
    }
    if (premiumPrice < 3000 || premiumPrice <= basicPrice) {
      setErrorMessage(
        "Premium price must be at least 3000 PKR and higher than basic price."
      );
      return;
    }
    if (basicDeliveryDays < 0 || basicDeliveryDays > 20) {
      setErrorMessage("Basic delivery days must be between 0 and 20.");
      return;
    }
    if (premiumDeliveryDays < 5 || premiumDeliveryDays > 30) {
      setErrorMessage("Premium delivery days must be between 5 and 30.");
      return;
    }
    if (!gigImage) {
      setErrorMessage("Please upload a gig picture.");
      return;
    }

    setLoading(true); // Show loader

    // Create FormData for the API request
    const formData = new FormData();
    formData.append("gigImage", gigImage);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("serviceType", selectedService);
    formData.append("fabricType", selectedMaterials);
    formData.append("experienceYears", experienceYears);
    formData.append("measurementInstructions", measurementInstructions);
    formData.append("basicPrice", basicPrice);
    formData.append("premiumPrice", premiumPrice);
    formData.append("basicDeliveryDays", basicDeliveryDays);
    formData.append("premiumDeliveryDays", premiumDeliveryDays);

    try {
      await axios.post("http://localhost:3001/gigs/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setLoading(false); // Hide loader
      setSuccessMessage("Your gig has been successfully created!");

      // Clear form fields
      setTitle("");
      setDescription("");
      setExperienceYears("");
      setBasicPrice("");
      setPremiumPrice("");
      setBasicDeliveryDays("");
      setPremiumDeliveryDays("");
      setMeasurementInstructions("Provide measurements in Inches.");
      setGigImage(null);
      setSelectedMaterials([]);
    } catch (error) {
      setLoading(false); // Hide loader
      setErrorMessage(
        error.response?.data?.error ||
          "Failed to create the gig. Please try again."
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validImageTypes.includes(file.type)) {
      setErrorMessage("Please upload a valid image file (jpg, jpeg, png).");
      setGigImage(null);
      return;
    }

    setGigImage(file); // Store the main gig image for uploading
    setErrorMessage(""); // Clear any previous error
  };

  return (
    <div className="max-w-4xl mt-3 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl text-center font-semibold mb-4">
        Portfolio Details
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gig Title: <span className="text-red-500">*</span>
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
            Upload your Gig Picture: <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="gigImage"
            accept="image/jpeg,image/png,image/jpg"
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
            Description: <span className="text-red-500">*</span>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service Type: <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedService}
            onChange={handleServiceChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Materials Selection */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Material: <span className="text-red-500">*</span>
          </label>

          <div className="mt-1">
            <button
              type="button"
              onClick={toggleDropdown}
              className="p-2 block w-full border bg-white text-gray-500 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-left"
            >
              {selectedMaterials.length > 0
                ? selectedMaterials
                    .map((id) => materials.find((m) => m._id === id).name)
                    .join(", ")
                : "Select Materials"}
            </button>

            {isOpen && (
              <div className="absolute z-10 mt-1 w-full border border-gray-300 rounded-md bg-white shadow-lg">
                {materials.length === 0 ? (
                  <div className="p-2 text-gray-500">
                    No materials available.
                  </div>
                ) : (
                  materials.map((material) => (
                    <label
                      key={material.name}
                      className="flex bg-white items-center p-2 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material.name)}
                        onChange={() => handleMaterialChange(material.name)}
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">
                        {material.name}
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Experience Years */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Experience Years: <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            placeholder="Enter years of experience"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Basic Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Basic Price (PKR): <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={basicPrice}
            onChange={(e) => setBasicPrice(e.target.value)}
            placeholder="Enter basic price"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Premium Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Premium Price (PKR): <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={premiumPrice}
            onChange={(e) => setPremiumPrice(e.target.value)}
            placeholder="Enter premium price"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Basic Delivery Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Basic Delivery Days: <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={basicDeliveryDays}
            onChange={(e) => setBasicDeliveryDays(e.target.value)}
            placeholder="Enter basic delivery days"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Premium Delivery Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Premium Delivery Days: <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={premiumDeliveryDays}
            onChange={(e) => setPremiumDeliveryDays(e.target.value)}
            placeholder="Enter premium delivery days"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Measurement Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Measurement Instructions:
          </label>
          <textarea
            value={measurementInstructions}
            onChange={(e) => setMeasurementInstructions(e.target.value)}
            placeholder="Provide measurement instructions"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows="2"
          />
        </div>

        {/* Error and Success Messages */}
        {errorMessage && (
          <div className="mt-4 text-red-500">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mt-4 text-green-500">{successMessage}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full bg-gray-950 hover:bg-gray-700 text-white rounded-md shadow "
        >
          {loading ? (
            <Lottie options={defaultOptions} height={50} width={50} />
          ) : (
            "Add Gig"
          )}
        </button>
      </form>
    </div>
  );
};

export default GigAdd;
