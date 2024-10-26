import React, { useState } from "react";
import ProfileBackground from "./GigHead.js";
import GigDes from "./GigDes.js";
import GigPackage from "./GigPackage.js";
import { useNavigate } from "react-router-dom";

const ShowCase = () => {
  const navigate = useNavigate();
  
  const tailor = {
    name: "Abdullah",
    location: "i8, Islamabad",
    languages: "Urdu | English",
    ordersCompleted: 45,
    rating: 4.8,
    reviews: 20,
    avatar: "https://via.placeholder.com/150",
    background: "https://via.placeholder.com/400x200",
    description:
      "I am Muslim, a professional tailor. I specialize in stitching traditional and custom dresses with the finest finishing.",
    tags: ["Traditional dresses", "Custom stitching", "Wedding outfits"],
  };

  const packages = {
    basic: {
      price: "2,000",
      description: "I will stitch simple dresses like shalwar kameez or basic outfits within 7 days.",
      features: [
        "7-day delivery",
        "Basic dress stitching",
        "Simple design",
        "Ironing and finishing",
      ],
    },
    premium: {
      price: "10,000",
      description: "Premium tailoring for special occasions, weddings, or fully customized designs.",
      features: [
        "15-day delivery",
        "Bespoke tailoring consultation",
        "Wedding and formal dress stitching",
        "High-quality materials and custom design",
        "Final fitting and adjustments",
      ],
    },
  };

  const [selectedPackage, setSelectedPackage] = useState(null);

  // Handle package selection and navigate to BuyerOrderPage
  const handleSubmit = (pkg) => {
    setSelectedPackage(pkg);
    navigate("/buyerOrderPage", {
      state: {
        tailor,
        package: pkg, // Pass the selected package (Basic or Premium)
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Profile Header */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div
          className="bg-cover h-48"
          style={{
            backgroundImage: `url('${tailor.background}')`,
          }}
        ></div>
        <ProfileBackground tailor={tailor} />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white p-6 shadow-lg rounded-lg">
          <GigDes description={tailor.description} tags={tailor.tags} />
        </div>

        {/* Packages */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <GigPackage
            packages={packages}
            onSelectPackage={handleSubmit} // Pass the selected package
          />
        </div>
      </div>
    </div>
  );
};

export default ShowCase;
