import { useState } from "react";
import axios from "axios";
import "./stylesheet/register.css";
import logo from "../assests/login.png";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectUser, setSelectUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate();

  const handleAgreeTermsChange = (e) => {
    setAgreeTerms(e.target.checked);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if all fields are filled
    if (!name || !email || !selectUser || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      toast.warning("Please check the terms first");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
//validation
    try {
      const response = await axios.post("http://localhost:3001/api/register", {
        name,
        email,
        selectUser,
        password,
      });

      if (response.status === 201) {
        // alert("Registration Successful...");
        setAgreeTerms(false);
        // Redirect to OTP page and pass email as state
        navigate("/OTPinput", { state: { email } });
      } // If user already exists but is not verified
      else if (response.status === 200 && response.data.msg.includes("OTP sent")) {
        toast.info("User already exists, OTP sent.");
        // Redirect to OTP page
        navigate("/OTPinput", { state: { email } });
      } 
      // Handle other responses
      else {
        setErrorMessage(response.data.msg);
      }
    } catch (error) {
      console.error("Error registering user:", error.message);
      if (error.response) {
        toast.error(
          error.response.data.msg || "Error registering user. Please try again."
        );
      } else if (error.request) {
        console.log("Request:", error.request);
      } else {
        console.log("Error message:", error.message);
      }
      setErrorMessage(error.response.data.msg);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  //display Password
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container container-fluid vh-95 d-flex align-items-center justify-content-center mb-1">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="dark"
        transition={Bounce}
        limit={4}
      />
      <div className="register-row row " style={{ width: "100%" }}>
        <div
          className="register-logo col-md-6 d-none d-md-block"
          style={{
            position: "relative",
            backgroundImage: `url(${logo})`,
            backgroundSize: "contain", // Fit the image within the container
            backgroundRepeat: "no-repeat", // Prevents tiling of the image
            backgroundPosition: "center",
            height: "500px",
          }}
        ></div>
        <div className="register-form col-md-6 d-flex align-items-center justify-content-center">
          <div
            className="register-card custom-card border-0 shadow-lg  "
            style={{
              maxWidth: "400px",
              maxHeight: "550px",
              borderRadius: "5px",
            }}
          >
            <div className="card-body p-5 " style={{ height: "600px" }}>
              <h1 className="register-title text-center mb-4">Re Wear</h1>
              <form onSubmit={handleRegister}>
                <div className="register-input mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your Name"
                    required
                  />
                </div>
                <div className="register-input mb-3">
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    required
                  />
                </div>
                <div className="register-input mb-3">
                  <select
                    className="form-control"
                    value={selectUser}
                    onChange={(e) => setSelectUser(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select User Type
                    </option>
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                    <option value="Tailor">Tailor</option>
                  </select>
                </div>
                <div className="register-input-password mb-3">
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
                <div className="register-input-password mb-3">
                  <div className="input-group-password">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your Password"
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
                      onClick={handleShowConfirmPassword}
                    >
                      {showPassword ? <FontAwesomeIcon icon={faEyeSlash}/> : <FontAwesomeIcon icon={faEye}/>}
                    </button>
                  </div>
                </div>
                {errorMessage && (
                  <div
                    className="register-error-message"
                    style={{ color: "red" }}
                  >
                    {errorMessage}
                  </div>
                )}
                <div className="register-terms mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="agreeTermsCheckbox"
                    checked={agreeTerms}
                    onChange={handleAgreeTermsChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="agreeTermsCheckbox"
                  >
                    I agree to the{" "}
                    <a href="/privacy&policy">Terms and Conditions</a>
                  </label>
                </div>
                <div className="register-submit mb-3 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={loading}
                  >
                    {loading ? (
                      <ClipLoader size={20} color={"#fff"} />
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
                <div className="register-login-link mb-3 text-center">
                  <p>
                    Already Registered? <Link to="/login">Login</Link>
                  </p>
                </div>
              </form>
              {/* <div className="register-google text-center" style={{ marginTop: "-10px" }}>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "#db2525", border: "none" }}
                >
                  <FontAwesomeIcon
                    icon={faGoogle}
                    className="mr-2"
                    style={{ color: "white" }}
                  />
                  Register with Google
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
