import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TailorRequestForm = () => {
  const navigate = useNavigate();

  const gigId = localStorage.getItem("gigId") || "Not Selected";
  const selectedService = JSON.parse(localStorage.getItem("selectedService")) || "Not Selected";
  const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan")) || "Not Selected";

  const [shirt, setShirt] = useState({});
  const [trouser, setTrouser] = useState({});
  const [picture, setPicture] = useState();
  const [confirmedShirt, setConfirmedShirt] = useState(false);
  const [confirmedTrouser, setConfirmedTrouser] = useState(false);
  const [userCategory, setUserCategory] = useState("male");
  const [fitType, setFitType] = useState("slim fit");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShirtChange = (e) => {
    const { name, value } = e.target;
    setShirt({ ...shirt, [name]: parseFloat(value) || "" });
  };

  
  const handleTrouserChange = (e) => {
    const { name, value } = e.target;
    setTrouser({ ...trouser, [name]: parseFloat(value) || "" });
  };

  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const resetForm = () => {
    setShirt({});
    setTrouser({});
    setConfirmedShirt(false);
    setConfirmedTrouser(false);
    setFitType("slim fit");
    setDescription("");
    setErrorMessage("");
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setPicture(file);
      setErrorMessage("");
    } else {
      setPicture(null);
      setErrorMessage("Only .png or .jpeg files are allowed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    const userData = JSON.parse(storedUser);

    if (!userData) {
      alert("Please login first.");
      return;
    }

    if (description.trim().split(/\s+/).length < 5) {
      alert("Description must be at least 5 words.");
      return;
    }

    if (!picture) {
      alert("Please upload a valid picture.");
      return;
    }

    try {
      const formData = new FormData();
    formData.append("buyerId", userData._id);
    formData.append("gigId", gigId);
    formData.append("userCategory", userCategory);
    formData.append("fitType", fitType);
    formData.append("description", description);
    formData.append("measurements", JSON.stringify({
      shirt: {
        type: "shirt",
        takensize: shirt,
        confirmed: confirmedShirt,
      },
      trouser: {
        type: "trouser",
        takensize: trouser,
        confirmed: confirmedTrouser,
      },
    }));
    formData.append("picture", picture);

      const response = await axios.post("http://localhost:3001/api/tailor-request", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        alert("Tailor request created successfully!");
        navigate("/buyer/RequestView", { state: { request: response.data.data } });
      } else {
        alert(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating tailor request:", error);
      alert("An error occurred while submitting the request. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mb-5 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Measurements</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-5" style={{ alignItems: "center" }}>
          <div className="flex gap-2" style={{ alignItems: "center" }}>
            <label className="block text-base mb-0 font-normal text-gray-700">User:</label>
            <select
              value={userCategory}
              disabled
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
            >
              <option value="male">Male</option>
            </select>
          </div>
          <div className="flex" style={{ alignItems: "center" }}>
            <label className="text-base font-normal text-center mb-0 text-gray-700 w-full">Fitting Type:</label>
            <select
              value={fitType}
              onChange={(e) => setFitType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="classic fit">Classic Fit</option>
              <option value="slim fit">Slim Fit</option>
              <option value="extreme slim fit">Extreme Slim Fit</option>
            </select>
          </div>
        </div>
        <div>
          <span className="text-sm font-normal">
            <p>Selected Service: {selectedService.name}</p>
            <p>Plan: {selectedPlan.name}</p>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="border-1 p-2 rounded">
            <h5 className="text-lg text-center font-medium mb-3 text-gray-700">Shirt Measurements</h5>
            {["neck", "shoulderWidth", "chestBust", "waist", "sleeveLength", "bicep", "wrist", "shirtLength"].map(
              (field) => (
                <label key={field} className="block mb-4 text-sm font-normal text-gray-700">
                  {field.replace(/([A-Z])/g, " $1")}:
                  <input
                    type="number"
                    name={field}
                    value={shirt[field] || ""}
                    onChange={handleShirtChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                  />
                </label>
              )
            )}
          </div>
          <div className="border-1 p-2 rounded">
            <h5 className="text-lg text-center font-medium mb-3 text-gray-700">Trouser Measurements</h5>
            {["hip", "inseam", "outseam", "thigh", "knee", "frontRise", "backRise", "legOpening"].map((field) => (
              <label key={field} className="block mb-4 text-sm font-normal text-gray-700">
                {field.replace(/([A-Z])/g, " $1")}:
                <input
                  type="number"
                  name={field}
                  value={trouser[field] || ""}
                  onChange={handleTrouserChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                />
              </label>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-lg font-medium mb-2 text-gray-700">Description</h5>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Write a description (at least 5 words)"
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <h5 className="text-lg font-medium mb-2 text-gray-700">Upload Design</h5>
          <input
            type="file"
            accept=".png, .jpeg"
            onChange={handlePictureChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          />
          {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
            Submit
          </button>
          <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-400 text-white rounded-md text-sm font-medium">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default TailorRequestForm;
