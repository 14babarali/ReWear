import React, { useState, useEffect } from "react";
import TailorCard from "./TailorCard.js";
import axios from "axios";

const TailorSearch = () => {
  const token = localStorage.getItem("token");
  const url = "http://localhost:3001";
  const [gigs, setGigs] = useState();
  const [isloading, setIsLoading] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTailor();
  }, []);

  const fetchTailor = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${url}/gigs/allTailor`);
      if (response.status === 200 || response.status === 201) {
        setGigs(response.data);
      } else {
        alert(response.statusText);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };
  // const tailors = [
  //   {
  //     name: "Ahmed",
  //     tagline: "I will do urgent stiching and fitting",
  //     rating: 4.8,
  //     reviews: 20,
  //     experience: 10,
  //     location: "Rwp, Pakistan",
  //     price: "4,366",
  //     profilePicture: "https://via.placeholder.com/400x200", // Replace with actual image URL
  //     avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
  //   },
  //   {
  //     name: "Abdullah",
  //     tagline: "Expert in tailoring bespoke suits and dresses",
  //     rating: 4.5,
  //     reviews: 35,
  //     experience: 8,
  //     location: "Islamabad, Pakistan",
  //     price: "5,500",
  //     profilePicture: "https://via.placeholder.com/400x200", // Replace with actual image URL
  //     avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
  //   },
  //   {
  //     name: "Taimoor",
  //     tagline: "Specialist in wedding attire and formalwear",
  //     rating: 4.9,
  //     reviews: 50,
  //     experience: 12,
  //     location: "islamabad, Pakistan",
  //     price: "7,200",
  //     profilePicture: "https://via.placeholder.com/400x200", // Replace with actual image URL
  //     avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h2 className="text-center text-2xl font-semibold mb-6 tracking-wide">Tailor's Profile's</h2>
      
      <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
        {gigs && gigs.length > 0 ? (
          gigs.map((gig, index) => (
            <TailorCard key={index} gig={gig} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No Gigs Found</p>
        )}
      </div>
    </div>
  );
}  
export default TailorSearch;
