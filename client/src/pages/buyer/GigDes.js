import React, { useState } from "react";

const GigDes = ({ description, collections, user }) => {
  const [selectedCollection, setSelectedCollection] = useState(collections[0]);
  const url = "http://localhost:3001/uploads/";
  const [selectedMedia, setSelectedMedia] = useState(null);
  const openMediaModal = (item) => setSelectedMedia(item);
  const closeMediaModal = () => setSelectedMedia(null);




  const handleCollectionSelect = (collection) => {
    setSelectedCollection(collection);
  };

  const renderCollection = (collection, index) => (
    <div key={collection._id} className="d-flex flex-col">
      <div
        className="bg-white shadow-md mx-2 rounded-full w-20 h-20 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => handleCollectionSelect(collection)}
      >
        <img
          src={collection.image ? `${url}${collection.image}` : `${url}no-image.png`}
          alt={collection.title}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <h3 className="text-center text-sm m-0 mt-1">{collection.title}</h3>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">About</h2>
      <div className="flex flex-col lg:flex-row items-start">
        <p className="text-gray-600 mb-0">{description}</p>
      </div>

      {/* Collections Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Collections</h3>
        {collections && collections.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {collections.map((collection, index) => renderCollection(collection, index))}
          </div>
        ) : (
          <p className="text-gray-500">No Collections Added By Tailor Yet.</p>
        )}
      </div>

      {/* Render Collection Content */}
      {selectedCollection && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">{selectedCollection.name}</h3>
          {renderCollectionContent(selectedCollection, user, openMediaModal)}
        </div>
      )}

      {selectedMedia && (
        <div className="modal">
          <div className="modal-content bg-gray-900s">
            {/\.(mp4|mov|avi|webm|mkv)$/.test(selectedMedia.url) ? (
              <video
                controls
                className="w-full h-auto rounded-lg"
                src={selectedMedia.url}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={selectedMedia.url}
                alt="Selected"
                className="object-contain w-full h-[500px] rounded-lg"
              />
            )}
            <button
              onClick={closeMediaModal}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Render Collection Content
const renderCollectionContent = (collection, user, openMediaModal) => {
  const url = "http://localhost:3001/uploads/";

  return (
    <div className="mt-10 space-y-12 bg-gray-100 p-4 rounded-lg">
      <div className="flex flex-col items-center space-y-12">
        {collection?.items && collection.items.length > 0 ? (
          collection.items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-lg w-full p-4 border border-gray-200 md:w-5/6 lg:w-4/5 xl:w-3/4 2xl:w-2/3 mt-8"
            >
              {/* Header */}
              <div className="flex items-center mb-8">
                <img
                  src={user?.profile?.profilePicture ? `${url}${user.profile.profilePicture}` : `${url}no-image.jpg`}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-800 mb-0 text-sm">{user?.profile?.name || "User"}</p>
                  <p className="text-xs text-gray-500 mb-0">Posted on {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Item Content */}
              <p className="mb-2 text-sm">{item.comment}</p>
              <div className="rounded-lg bg-gray-900 overflow-hidden mb-8 w-full max-w-5xl mx-auto h-[400px]">
                {/\.(mp4|mov|avi|webm|mkv)$/.test(item.url) ? (
                  <video controls className="w-full h-full object-cover">
                    <source src={item.url} type="video/mp4"
                     />
                    
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={item.url} alt="Image item" onClick={() => openMediaModal(item)} className="w-full h-full object-contain" />
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex justify-around text-gray-600 text-xs mt-4">
                <button className="text-gray-900 bg-transparent hover:text-red-500 transition flex items-center gap-1">
                  <span className="material-icons">favorite</span> Like
                </button>
                <button className="text-gray-900 bg-transparent hover:text-red-500 transition flex items-center gap-1">
                  <span className="material-icons">heart_broken</span> Dislike
                </button>
                <button className="text-gray-900 bg-transparent hover:text-red-500 transition flex items-center gap-1">
                  <span className="material-icons">ios_share</span> Share
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-sm">No items to display</p>
        )}
      </div>
    </div>
  );
};

export default GigDes;
