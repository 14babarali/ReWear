import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./checkout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import CheckoutModal from "../../components/CheckoutModal";
import axios from "axios";

const Checkout = () => {
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [orderstatus, setOrderStatus] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { product, selectedSize, quantity } = location.state || {};

  useEffect(() => {
    if (location.state && location.state.products) {
      setSelectedItems(location.state.products);
    } else if (!product) {
      toast.error("No products available for checkout.");
      navigate("/buyer/cart");
    }
  }, [location.state, navigate, product]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  const calculateSubtotal = () => {
    if (product) {
      return product.price * quantity;
    }

    return selectedItems.reduce((subtotal, item) => {
      return subtotal + item.product.price * item.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal(); // Adding delivery fee
  };

  const handlePayment = async () => {
    const products = product
      ? [
          {
            product_id: product._id,
            quantity,
            size: selectedSize,
            price: product.price,
          },
        ]
      : selectedItems.map((item) => ({
          product_id: item.product._id,
          quantity: item.quantity,
          size: item.size,
          price: item.product.price,
        }));

    if (!isLoggedIn) {
      toast.warning("Please log in to proceed with the payment.");
      navigate("/login");
      return;
    }

    if (!selectedAddress) {
      toast.warning("Please select an address.");
      return;
    }

    if (!paymentMethod) {
      toast.warning("Please select a payment method.");
      return;
    }

    const selectedAddressDetails = user.profile.addresses.find(
      (address) => address._id === selectedAddress
    );

    const orderData = {
      buyer_id: user._id,
      products,
      type: paymentMethod === "card" ? "Card" : "COD",
      address: {
        street: selectedAddressDetails.street,
        city: selectedAddressDetails.city,
        postalcode: selectedAddressDetails.postalcode,
      },
      phone: user.profile.phone,
    };

    try {
      if (paymentMethod === "card") {
        const { data } = await axios.post(
          "http://localhost:3001/payment/card-payment",
          {
            amount: calculateTotal(),
            currency: "PKR",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        navigate("/buyer/card-payment", {
          state: { clientSecret: data.clientSecret, orderData },
        });
      } else {
        const response = await axios.post(
          "http://localhost:3001/api/orderplace",
          orderData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          toast.success("Order placed successfully!");
          setOrderStatus(true);
          setIsModalOpen(true);
        } else {
          toast.error("Failed to place the order. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error occurred while placing the order.");
    }
  };

  const handleAddressSelection = (addressId) => setSelectedAddress(addressId);


  return (
    <div className="checkout-container">
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => navigate("/buyer/buyers_orders")}
        isplaced={orderstatus}
      />
      <ToastContainer />
      <div className="checkout-head">
        <h1>Checking out</h1>
        <FontAwesomeIcon icon={faCartShopping} className="checkout-head-logo" />
      </div>
      <div className="checkout-content">
        <div className="left-section">
          {isLoggedIn ? (
            <>
              <div className="account-details">
                <h2>Personal Info & Addresses</h2>
                <div className="mt-4">
                  <p>
                    <strong>Name:</strong> {user.profile.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.profile.phone}
                  </p>
                  <p>
                    <strong>Addresses:</strong> (Select Address){" "}
                    <a
                      onClick={() => navigate("/buyer/profile")}
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: "blue",
                      }}
                    >
                      {" "}
                      Add New address
                    </a>
                  </p>
                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                      {(user.profile.addresses || []).map((address, index) => (
                        <li key={index} className="flex mt-3">
                          <input
                            type="radio"
                            id={`address-${index}`}
                            name="address"
                            value={address._id} // Use a unique identifier if available
                            checked={selectedAddress === address._id}
                            onChange={() => handleAddressSelection(address._id)}
                          />
                          &nbsp;
                          <label
                            className="m-0 text-base font-normal"
                            id={`address-${index}`}
                            htmlFor={`address-${index}`}

                          >
                            {address.street}, {address.city},{" "}
                            {address.postalcode}
                          </label>
                        </li>
                      ))}
                    </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="account-details">
                <h2>Account Details</h2>
                <p>
                  Already have an account? <a href="/login">Log in</a>
                </p>
                <input type="email" placeholder="Email address" />
                <div className="checkbox">
                  <input type="checkbox" id="email-offers" />
                  <label htmlFor="email-offers">
                    Email me about new products and offers
                  </label>
                </div>
              </div>
              <>
                <div className="shipping-address">
                  <h2>Personal & Address Info</h2>
                  <input type="text" id="name" placeholder="Name" />
                  <ReactPhoneInput
                    inputExtraProps={{
                      name: "phone",
                      id: "phone",
                      className: "form-control",
                    }}
                    country={"pk"}
                    value={phoneNumber}
                    onChange={(phone) => setPhoneNumber(phone)}
                  />
                  <input
                    type="text"
                    placeholder="Street"
                    className="full-width"
                  />
                  <div className="address-details">
                    <input type="text" placeholder="City" />
                    <input type="text" placeholder="Postal Code" />
                  </div>
                  <input type="text" placeholder="Landmark (Optional)" />
                  <input type="text" placeholder="Alternate Phone (Optional)" />
                </div>
              </>
            </>
          )}

          <div className="payment-section">
            <h2>Payment Method</h2>
            <div className="flex payment-method h-full">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <label className="m-0 text-base font-normal" htmlFor="cod">
                &nbsp;Cash on Delivery (COD)
              </label>
            </div>
            <div className=" flex items-center  payment-method h-full">
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <label className="m-0 text-base font-normal" htmlFor="card">
                &nbsp;Credit/Debit Card
              </label>
            </div>
            <div className="order-process">
              <button className="continue-button" onClick={handlePayment}>
                {paymentMethod === "cod" ? "Checkout" : "Continue to Payments"}
              </button>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="order-summary">
            <h2>Order Summary</h2>
            {product ? (
              <>
                <div
                  key={product._id}
                  className="order-item"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src={`http://localhost:3001/uploads/${product.images[0]}`}
                    alt={product.images[0]}
                    className="product-image"
                    style={{
                      width: "150px",
                      height: "auto",
                      borderRadius: "8px",
                      marginRight: "20px",
                    }}
                  />
                  <div
                    className="product-details"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    <p
                      style={{
                        color: "#666",
                        textDecoration: "underline",
                        fontSize: "12px",
                        margin: "0 0 5px",
                      }}
                    >
                      {product._id}
                    </p>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        margin: "5px 0",
                        color: "#333",
                      }}
                    >
                      {product.name}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        margin: "5px 0",
                        color: "#555",
                      }}
                    >
                      <strong>QTY:</strong> {quantity}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        margin: "5px 0",
                        color: "#555",
                      }}
                    >
                      <strong>Size:</strong> {selectedSize}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        margin: "5px 0",
                        color: "#555",
                      }}
                    >
                      <strong>Price:</strong> Rs {product.price}
                    </p>
                  </div>

                  <hr />
                </div>
              </>
            ) : (
              <>
                {selectedItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="order-item"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "20px",
                    }}
                  >
                    <img
                      src={`http://localhost:3001/uploads/${item.product.images[0]}`}
                      alt={item.product.images[0]}
                      className="product-image"
                      style={{
                        width: "150px",
                        height: "auto",
                        borderRadius: "8px",
                        marginRight: "20px",
                      }}
                    />
                    <div
                      className="product-details"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      <p
                        style={{
                          color: "#666",
                          textDecoration: "underline",
                          fontSize: "12px",
                          margin: "0 0 5px",
                        }}
                      >
                        {item.product._id}
                      </p>
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          margin: "5px 0",
                          color: "#333",
                        }}
                      >
                        {item.product.name}
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          margin: "5px 0",
                          color: "#555",
                        }}
                      >
                        <strong>QTY:</strong> {item.quantity}
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          margin: "5px 0",
                          color: "#555",
                        }}
                      >
                        <strong>Size:</strong> {item.size}
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          margin: "5px 0",
                          color: "#555",
                        }}
                      >
                        <strong>Price:</strong> Rs {item.product.price}
                      </p>
                    </div>

                    <hr />
                  </div>
                ))}
              </>
            )}
            <div
              className="discount-code m-0 gap-2"
              style={{ alignItems: "center" }}
            >
              <input type="text" className="m-0" placeholder="Discount code" />
              <button className="apply-button">Apply</button>
            </div>
            <div className="total">
              <p>Subtotal: Rs {calculateSubtotal().toFixed(2)}</p>
              <p>Delivery: Rs 200</p>
              <p>Taxes: Rs 0</p>
              <p>Discount: 0%</p>
              <h3>Total: Rs {(calculateTotal() + 200).toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="shipping-policy">
          <h3>Shipping</h3>
          <p>
            We ship all over the world. For that matter, we have partnered with
            major courier services such as DHL, FedEx, etc. Read more in{" "}
            <a href="/buyer/privacy-policy">shipping policy</a>
          </p>
        </div>
        <div className="return-policy">
          <h3>Return Policy</h3>
          <p>
            Returns not applicable for this product. If a damaged product was
            delivered and you have video proof, you are applicable for a full
            refund. <a href="./routes/AboutUs">Contact us to avail refund</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
