import React from 'react';
import './stylesheet/AboutUs.css'; // Import the CSS for styling
import AboutImage from '../assests/AboutImage.jpg'; // Update the image path
import man1 from '../assests/man1.png'; // Image for the team members
import man2 from '../assests/man2.jpg'; // Another image for team members

const AboutUs = () => {
  return (
    <div className="rewear-aboutUs-container-xy123">
      {/* Header section with an overlay */}
      <div className="rewear-aboutUs-header-xy123">
        <div className="rewear-aboutUs-imageContainer-xy123">
          <img src={AboutImage} className="rewear-aboutUs-image-xy123" alt="About Us" />
          <div className="rewear-aboutUs-overlay-xy123">
            <div className="rewear-aboutUs-textOverlay-xy123">About Rewear</div>
          </div>
        </div>
      </div>

      {/* About Us Content */}
      <div className="rewear-aboutUs-contentContainer-xy123">
        <section className="rewear-aboutUs-section-xy123">
          <h2 className="rewear-aboutUs-heading-xy123">Our System</h2>
          <p>
            Rewaear is dedicated to providing a seamless and convenient tailoring, buying, and selling experience for users.
          </p>
        </section>

        <section className="rewear-aboutUs-missionSection-xy123">
          <h2 className="rewear-aboutUs-heading-xy123">Our Mission</h2>
          <p>
            ReWear is an innovative online platform that transforms the way people buy, sell, and tailor secondhand and new clothing, offering a seamless and sustainable shopping experience.
          </p>
        </section>

        <section className="rewear-aboutUs-visionSection-xy123">
          <h2 className="rewear-aboutUs-heading-xy123">Our Vision</h2>
          <p>
            ReWear envisions a future where sustainable fashion is the norm, empowering individuals to make stylish and eco-friendly choices with ease.
          </p>
        </section>

        {/* Team Section */}
        <section className="rewear-aboutUs-teamSection-xy123">
          <h2 className="rewear-aboutUs-heading-xy123">Meet Our Team</h2>
          <div className="rewear-aboutUs-teamMembers-xy123">
            <div className="rewear-aboutUs-teamMember-xy123">
              <img src={man1} alt="Team Member" className="rewear-aboutUs-teamMemberImage-xy123" />
              <h3>Sfwan Ali</h3>
              <p>CTO</p>
              <p>13408@students.riphah.edu.pk</p>
            </div>
            <div className="rewear-aboutUs-teamMember-xy123">
              <img src={man2} alt="Team Member" className="rewear-aboutUs-teamMemberImage-xy123" />
              <h3>Talha Masood</h3>
              <p>CEO</p>
              <p>29423@students.riphah.edu.pk</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
