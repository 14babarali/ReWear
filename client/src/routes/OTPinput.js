import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import client from '../components/client';
import './stylesheet/OTP.css';

function OTPinput({ numberOfDigits = 6 }) {
  const { state } = useLocation();
  const email = state?.email;
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState(null);
  const otpBoxReference = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    otpBoxReference.current[0].focus();
  }, []);

  function handleChange(value, index) {
    if (/[^0-9]/.test(value)) return;

    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  useEffect(() => {
    setOtpError(null);
  }, [otp]);

  async function handleSubmit() {
    console.log('Submit button clicked');
    console.log('Entered OTP:', otp.join(""));

    try {
      await client.post('/verify_otp', {
        email: email,
        otp: otp.join(""),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert("User verified");
      console.log('OTP is correct, navigating to login');
      navigate('/login');
    } catch (error) {
      const { response } = error;
      console.error('Error verifying OTP:', error);
      setOtpError(response?.data.message || 'An error occurred. Please try again.');
    }
  }

  return (
    <div className="otp-container">
      <h2>OTP Code</h2>
      <p>We have sent an email to your account</p>
      <div className="otp-input-group">
        {otp.map((digit, index) => (
          <input
            key={index}
            value={digit}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
            ref={(reference) => (otpBoxReference.current[index] = reference)}
            className={`otp-input ${(otpError !== null && otpError !== undefined) ? 'otp-error' : ''}`}
          />
        ))}
      </div>
      {otpError && (
        <p className="otp-error-message">{otpError}</p>
      )}
      <button className="Otp_Button" onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default OTPinput;