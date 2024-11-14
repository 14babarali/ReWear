import React, { useState } from "react";
import ProfileBackground from "./GigHead";
import GigDes from "./GigDes";
import GigPackage from "./GigPackage";
import { useLocation } from "react-router-dom";

const ShowCase = () => {
  const location = useLocation();
  // const navigate = useNavigate();
  const backendUrl = 'http://localhost:3001';
  const gig = location.state?.gig;

  if (!gig) {
    return <p>Loading...</p>;
  }

  const tailor = {
    name: gig.user.profile?.name || "Unknown Tailor",
    image: gig.user.profile?.profilePicture || 'no-image.jpg',
    location: `${gig.user.profile?.addresses[0]?.city || "Unknown city"}`,
    languages: "Urdu | English", // Replace with dynamic data if available
    phone:gig.user.profile.phone,
    ordersCompleted: gig.user.ordersCompleted || 0,
    rating: gig.user.rating || 4.5, // Assume average rating if missing
    reviews: gig.user.reviews || 5, // Assume some reviews if missing
    avatar: gig.user.profile?.profilePicture ? `${backendUrl}/uploads/${gig.user.profile.profilePicture}` : "https://via.placeholder.com/150",
    background: gig.gigImage ? `${backendUrl}/uploads/${gig.gigImage}` : "https://via.placeholder.com/400x200",
    description: gig.description,
    collections: gig.collections,
    tags: gig.services || [],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 shadow-lg rounded-lg overflow-hidden">
        <ProfileBackground tailor={tailor} gig={gig} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white p-6 shadow-lg rounded-lg">
          <GigDes description={tailor.description} collections={tailor.collections} user={gig?.user}/>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-lg">
          <GigPackage services={tailor.tags} gigId={gig._id} />
        </div>
      </div>
    </div>
  );
};

export default ShowCase;
