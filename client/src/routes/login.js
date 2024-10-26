import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import logo from '../assests/login.png';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import './stylesheet/login.css';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // const clientId = '136629782296-knhugn43lrdhlgtbqpahb3rqv3t2o5hf.apps.googleusercontent.com';

  const handleSubmit = async (e) => {
    setErrorMessage('');  // Clear previous error messages
    const token = localStorage.getItem('token');
  
    // Check if the user is already logged in
    if(token){
      navigate('/buyer');  // Redirect to buyer page if logged in
    } else {
      e.preventDefault();  // Prevent default form behavior
      setLoading(true);    // Start loading state
  
      try {
        // Make login request to the backend
        const response = await axios.post('http://localhost:3001/api/login', { email, password });
        const { user, token, message } = response.data; // Destructure the response
  
        // Save token and user details to local storage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
  
        // Handle user roles and statuses
        if (response.status === 200) {
          // Redirect based on user role
          if (user.role === 'Seller') {
            navigate('/seller');
          } else if (user.role === 'Buyer') {
            navigate('/buyer');
          } else if (user.role === 'Admin') {
            navigate('/admin');
          } else if (user.role === 'Tailor') {
            navigate('/tailor');
          } else {
            setErrorMessage('Undefined Role, please contact administration.');
          }
        }
  
        // Handle unverified users (403)
        if (response.status === 403) {
          navigate("/OTPinput", { state: { email } });
        }
  
      } catch (error) {
        let errorMsg = 'An unexpected error occurred.';
  
        // Check for specific error responses
        if (error.response) {
          // Account banned (400) or invalid email/password (401)
          if (error.response.status === 400) {
            errorMsg = 'Your account is banned. Please contact support.';
          } else if (error.response.status === 401) {
            errorMsg = 'Invalid email or password.';
          }
          // Account not verified (403)
          else if (error.response.status === 403) {
            navigate("/OTPinput", { state: { email } });
          } else {
            errorMsg = error.response.data.message;
          }
        } else if (error.request) {
          errorMsg = 'Network error. Please try again later.';
        }
  
        // Set error message for the user
        setErrorMessage(errorMsg);
      } finally {
        setLoading(false);  // Stop loading
      }
    }
  };
  

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container container-fluid d-flex align-items-center justify-content-center">
      <div className="login-row row" style={{ width: "100%" }}>
        <div
          className="login-logo col-md-6 d-none d-md-block"
          style={{
            position: 'relative',
            backgroundImage: `url(${logo})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "500px",
          }}
        >
        </div>
        <div className="login-form col-md-6 d-flex align-items-center justify-content-center">
          <div
            className="login-card custom-card border-0 shadow-lg"
            style={{
              maxWidth: "400px",
              maxHeight: "550px",
              borderRadius: "5px",
            }}
          >
            <div className="card-body p-5" style={{ height: '500px' }}>
              <h1 className="login-title text-center mb-4">Re Wear</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <div className="login-input mb-3">
                      <input
                        type='email'
                        className="form-control"
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter your Email'
                        required
                      />
                  </div>
                </div>
                <div className="login-input-password mb-3">
                  <div className="input-group-password">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your Password"
                      required
                      onCopy={(e) => {
                        e.preventDefault();
                        toast.warn("Please don't copy/paste the password.");
                      }}
                      onPaste={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                    />
                    <button
                      className="toggle-password-btn"
                      type="button"
                      onClick={handleShowPassword}
                    >
                      {showPassword ? <FontAwesomeIcon icon={faEyeSlash}/> : <FontAwesomeIcon icon={faEye}/>}
                    </button>
                  </div>
              </div>
                {errorMessage && 
                  <div className="login-error-message" style={{ color: "red" }}>
                    {errorMessage}
                  </div>
                }
                <div className="mb-3 text-left">
                  <a href='/forgotpassword' alt="forgot_password">Forgot Password?</a>
                </div>
                <div className="login-submit mb-3 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={loading}
                  >
                    {loading ? (
                      <ClipLoader size={20} color={"#fff"} />
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
                <div className="mb-3 text-center">
                  <p>Don't have an account? <Link to='/register'>Register</Link></p>
                </div>
              </form>
              <div className="text-center">
                <button className="btn btn-primary me-2" style={{ backgroundColor: '#db2525', border: 'none' }}>
                <FontAwesomeIcon icon={faGoogle} className="mr-2" style={{ color: 'white' }} />
                </button>
                <button className='btn btn-primary ' style={{backgroundColor: 'db2525', borer:'none'}}>
                    <FontAwesomeIcon icon={faFacebook} style={{color:'white', fontWeight:"bold"}}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;