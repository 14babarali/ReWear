import React, { useState } from "react";
import loader from "./Giff/loader.gif";
import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";

const GigPackage = ({ services }) => {
  const [selectedPackage, setSelectedPackage] = useState("Basic");
  const [isLoading, setIsLoading] = useState(false);
  // const [activeService, setActiveService] = useState(null);s
  const [activePlan, setActivePlan] = useState('Basic');
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/buyerOrderPage", { state: { selectedPackage } });
    }, 2000);
  };

  const toggleExpand = (serviceId) => {
    setExpanded((prev) => (prev === serviceId ? null : serviceId));
  };

  // const deleteService = async (serviceId) => {
  //   try {
  //     // Make a DELETE request to the backend to delete the service
  //     await axios.delete(`http://localhost:3001/gigs/services/delete/${serviceId}`, {
  //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //     });
  //     // Assuming a function fetchServices to update the services list
  //     fetchServices();
  //   } catch (error) {
  //     console.error("Error deleting service:", error);
  //     alert("Failed to delete the service. Please try again.");
  //   }
  // };

  return (
    <div>
      <div className="p-4 rounded-lg shadow-md bg-white">
        <h3 className="font-bold text-lg mb-4">Available Services</h3>

        <ul className="space-y-4 p-0">
          {services.map((service) => (
            <li key={service._id} className="w-full p-2 bg-white shadow rounded-lg border border-gray-200">
              <div className="flex flex-row p-1 justify-between cursor-pointer" onClick={() => toggleExpand(service._id)} >
                <div className="flex justify-between items-center m-0 w-full">
                  <h2 className="text-sm m-0 font-normal text-gray-800">{service.name}</h2>
                </div>

                {/* Expandable Plans Section */}
                <div className="flex">
                <button style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                  }} className="w-full bg-transparent text-left text-blue-600 text-sm font-normal">
                  {expanded === service._id ? "Hide Plans" : "View Plans"}
                </button>
                </div>
              </div>

              {expanded === service._id && (
                <div className="mt-3">
                  <div className="flex gap-4 border-b pb-2 mb-3">
                    {service.plans.map((plan) => (
                      <button
                        key={plan.name}
                        onClick={() => setActivePlan(plan.name)}
                        className={`py-1 bg-transparent text-sm font-medium ${
                          activePlan === plan.name ? 'text-blue-600 border-blue-600 border-b-2' : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        {plan.name}
                      </button>
                    ))}
                  </div>

                  {/* Active Plan Content */}
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    {service.plans.map((plan, idx) =>
                      activePlan === plan.name ? (
                        <div key={idx} className="text-sm text-gray-700 space-y-1">
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-medium">Rs {plan.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery:</span>
                            <span className="font-medium">{plan.deliveryDays} days</span>
                          </div>
                          {/* Continue Button */}
                          <button onClick={handleContinue} className="mt-6 bg-blue-500 text-white w-full py-2 rounded">
                            Continue
                          </button>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <img src={loader} alt="Loading" className="w-20 h-20" />
          </div>
        )}

        
      </div>
    </div>
  );
};

export default GigPackage;
