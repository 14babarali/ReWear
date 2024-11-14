import React, { useState } from "react";
import "./ShopCreate.css"; // Custom CSS file for styling
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
import loaderAnimation from "./Giff/loader_complete.json"; // Path to your loader JSON file
import axios from "axios"; // Import axios for API requests
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ShopCreate = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [shopImage, setShopImage] = useState(null);
  const [services, setServices] = useState([]); // Array for multiple services
  const [newService, setNewService] = useState(""); // State to hold new service input

  const [loading, setLoading] = useState(false); // Loader state
  const [errorMessage, setErrorMessage] = useState(""); // Error message for validation
  const [successMessage, setSuccessMessage] = useState(""); // Success message for shop creation

  // Form field states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workingHours, setworkingHours] = useState();

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
    if (services.length === 0) {
      // Check if services array is empty
      setErrorMessage(t("At least one service type is required."));
      return;
    }
    if (isNaN(workingHours) || workingHours < 5) {
      setErrorMessage(t("Minimum 5 Working Hours Required"));
      return;
    }

    if (!shopImage) {
      setErrorMessage(t("Please upload a shop picture."));
      return;
    }

    setLoading(true); // Show loader

    // Create FormData for the API request
    const formData = new FormData();
    formData.append("shopImage", shopImage);
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "services",
      JSON.stringify(services.map((service) => ({ name: service })))
    );
    formData.append("experience", workingHours);

    try {
      await axios.post("", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setLoading(false); // Hide loader
      setSuccessMessage(t("Your shop has been successfully created!"));

      // Clear form fields
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      setLoading(false); // Hide loader
      setErrorMessage(
        t(
          error.response?.data?.error ||
            "Failed to create the shop. Please try again."
        )
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/jfif",
      "image/avif",
    ];
    if (!validImageTypes.includes(file.type)) {
      setErrorMessage(
        t("Please upload a valid image file (jpg, jpeg, png, jfif, avif).")
      );
      setShopImage(null);
      return;
    }

    setShopImage(file); // Store the main shop image for uploading
    setErrorMessage(""); // Clear any previous error
  };

  const addService = (index = services.length) => {
    if (newService.trim() === "") {
      setErrorMessage(t("Service cannot be empty."));
      return;
    }

    // Update services array by directly assigning the value at the specified index
    const updatedServices = [...services];
    updatedServices[index] = newService;
    setServices(updatedServices);

    setNewService(""); // Clear input field
    setErrorMessage(""); // Clear error
  };

  const removeService = (index) => {
    // Remove the service at the specified index
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  return (
    <div className="max-w-4xl mt-3 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl text-center font-semibold mb-4">
        {t("Shop Details")}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("Shop Title")}: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter shop title"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Shop Image Upload */}
        <div className="mb-6">
          <label
            htmlFor="shopImage"
            className="block text-sm font-medium text-gray-700"
          >
            {t("Upload your Shop Picture")}:{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="shopImage"
            accept="image/jpeg,image/png,image/jpg,image/avif, image/jfif"
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
          {shopImage && (
            <img
              src={URL.createObjectURL(shopImage)}
              alt="Shop preview"
              className="mt-4 w-full h-40 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("Description")} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter shop description"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows="4"
          />
        </div>

        {/* Service Selection */}
        <div className="d-flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            {t("Service Type")}: <span className="text-red-500">*</span>
          </label>
          <div className="flex" style={{ alignItems: "center" }}>
            <input
              type="text"
              value={newService} // Bind to newService state
              onChange={(e) => setNewService(e.target.value)} // Update newService state
              className="mt-1 mb-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <button
              type="button"
              onClick={() => addService()} // Call addService to add/replace at the next available position
              className="add-button mt-1 text-white bg-blue-500 p-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              {t("Add")}
            </button>
          </div>

          {/* Display added services */}
          <ul className="mt-4">
            {services.map((service, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b border-gray-300"
              >
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
        </div>

        {/* Experience Years */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t("Working hours")}: <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={workingHours}
            onChange={(e) => setworkingHours(e.target.value)}
            placeholder={t("Working hours")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Lottie
                  options={defaultOptions}
                  height={50}
                  width={50}
                  isStopped={false}
                  isPaused={false}
                />
                <span className="ml-2">{t("Creating...")}</span>
              </div>
            ) : (
              <span>{t("Create Shop")}</span>
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

export default ShopCreate;
