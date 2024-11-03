import React, { useState, useEffect } from "react";

const Cookie = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner if user hasn't accepted or declined cookies
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 text-center">
      <p>
        We use cookies to enhance your experience. By continuing to visit this
        site, you agree to our use of cookies.{" "}
        <a href="/privacy-policy" className="underline">
          Learn more
        </a>
      </p>
      <div className="flex justify-center mt-2 space-x-4">
        <button
          onClick={handleAccept}
          className="bg-green-500 px-4 py-2 rounded text-white"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="bg-red-500 px-4 py-2 rounded text-white"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default Cookie;
