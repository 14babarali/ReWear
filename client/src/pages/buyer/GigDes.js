import React from "react";

const GigDes = ({ description, tags, gigImage }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">About this Gig</h2>
      <div className="flex flex-col lg:flex-row items-start">
        <img
          src={gigImage}
          alt="Gig Showcase"
          className="w-full lg:w-1/3 h-auto rounded-lg shadow-lg mb-4 lg:mb-0 lg:mr-6"
        />
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GigDes;
