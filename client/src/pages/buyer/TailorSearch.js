import React from "react";
import TailorCard from "./TailorCard.js"; // Assuming TailorCard is in a separate file

const TailorSearch = () => {
  const tailors = [
    {
      name: "Ahmed",
      tagline: "I will do urgent stiching and fitting",
      rating: 4.8,
      reviews: 20,
      experience: 10,
      location: "Rwp, Pakistan",
      price: "4,366",
      profilePicture: "https://via.placeholder.com/400x200", // Replace with actual image URL
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
    {
      name: "Abdullah",
      tagline: "Expert in tailoring bespoke suits and dresses",
      rating: 4.5,
      reviews: 35,
      experience: 8,
      location: "Islamabad, Pakistan",
      price: "5,500",
      profilePicture: "https://via.placeholder.com/400x200", // Replace with actual image URL
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
    {
      name: "Taimoor",
      tagline: "Specialist in wedding attire and formalwear",
      rating: 4.9,
      reviews: 50,
      experience: 12,
      location: "islamabad, Pakistan",
      price: "7,200",
      profilePicture: "https://via.placeholder.com/400x200", // Replace with actual image URL
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-wrap justify-center py-10">
      {tailors.map((tailor, index) => (
        <TailorCard key={index} tailor={tailor} />
      ))}
    </div>
  );
};

export default TailorSearch;
