import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkedAlt, faPhone, faHandHoldingUsd } from '@fortawesome/free-solid-svg-icons';
import { faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#343a40',
        color: 'white',
        padding: '1.5rem 0',
        marginTop: '250px',
      }}
    >
      <div className="container">
        <div className="row">
          {/* Contact Section */}
          <div
            className="col-md-4"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
            }}
          >
            <h5>Contact Us</h5>
            <p>
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              13408@students.riphah.edu.pk
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} className="me-2" />
              +923471976826
            </p>
            <p style={{ width: '250px' }}>
              <FontAwesomeIcon icon={faMapMarkedAlt} className="me-2" />
              Riphah International University I-14/3, Islamabad.
            </p>
          </div>

          {/* Newsletter Section */}
          <div
            className="col-md-4"
            style={{
              backgroundColor: '#343a40',
              color: 'white',
            }}
          >
            <h5 style={{ marginLeft: '2.5rem' }}>Subscribe to our Newsletter</h5>
            <form
              action="#"
              method="POST"
              className="d-flex"
              style={{ justifyContent: 'flex-end' }}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="form-control me-2"
                style={{
                  outlineColor: 'black',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: 'goldenrod',
                  height: '45px',
                  border: 'none',
                }}
                className="btn btn-success"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Links Section */}
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul
              className="list-unstyled"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                marginLeft: '120px',
              }}
            >
              <li>
                <a href="AboutUs" style={{ color: 'white' }}>
                  About us
                </a>
              </li>
              <li>
                <a href="privacy-policy" style={{ color: 'white' }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="Faqs" style={{ color: 'white' }}>
                  FAQ's
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="row mt-4"
          style={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
          }}
        >
          <h5>We offer these payment methods</h5>
          <div
            className="d-flex justify-content-center"
            style={{
              display: 'flex',
              gap: '1rem',
            }}
          >
            <div className="me-4 text-center">
              <FontAwesomeIcon icon={faCcMastercard} size="2x" />
              <span style={{ display: 'block' }}>Mastercard</span>
            </div>
            <div className="text-center">
              <FontAwesomeIcon icon={faHandHoldingUsd} size="2x" />
              <span style={{ display: 'block' }}>Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="footer-bottom text-center"
        style={{
          padding: '1rem 0',
        }}
      >
        <p style={{ marginBottom: '0' }}>&copy; 2024 Re-Wear. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
