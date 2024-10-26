import React from "react";
import {
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";

export default function StaticFaqSection() {
  return (
    <MDBContainer>
      <section>
        <MDBTypography
          tag="h3"
          className="text-center mb-4 pb-2 text-primary fw-bold"
        >
          FAQ
        </MDBTypography>
        <p className="text-center mb-5">
          Find the answers for the most frequently asked questions below
        </p>

        <MDBRow>
          <MDBCol md="6" lg="4" className="mb-4">
            <MDBTypography tag="h6" className="mb-3 text-primary">
              <MDBIcon far icon="paper-plane text-primary pe-2" />What is Re-Wear?
            </MDBTypography>
            <p>
             
              Re-Wear is an innovative online platform that transforms how people buy and sell secondhand clothing and access tailoring services. It provides a unique space where buyers can find both pre-loved and new clothes, while sellers and tailors can create their own stores to offer products and services. Re-Wear promotes sustainability by encouraging the reuse of clothing and making fashion more accessible and eco-friendly.
            </p>
          </MDBCol>
          <MDBCol md="6" lg="4" className="mb-4">
            <MDBTypography tag="h6" className="mb-3 text-primary">
              <MDBIcon fas icon="pen-alt text-primary pe-2" /> Can I return or exchange items bought on Re-Wear?
            </MDBTypography>
            <p>
              <strong>
                <u>Yes, it is possible!</u>
              </strong>{" "}
              You can cancel your Order anytime in your account. Or if there 
              is any problem in your order you can return them back in 1 week
            </p>
          </MDBCol>
          <MDBCol md="6" lg="4" className="mb-4">
            <MDBTypography tag="h6" className="mb-3 text-primary">
              <MDBIcon fas icon="user text-primary pe-2" />Is Re-Wear available in my country?
            </MDBTypography>
            <p>
              Currently, we only offer Our Services in Pakistan!
            </p>
          </MDBCol>
          <MDBCol md="6" lg="4" className="mb-4">
            <MDBTypography tag="h6" className="mb-3 text-primary">
              <MDBIcon fas icon="rocket text-primary pe-2" /> Are the clothes on Re-Wear new or secondhand?     
            </MDBTypography>
            <p>
              It upto Seller and tailor. They can sell both second hand and new Product  
            </p>
          </MDBCol>
          <MDBCol md="6" lg="4" className="mb-4">
            <MDBTypography tag="h6" className="mb-3 text-primary">
              <MDBIcon fas icon="home text-primary pe-2" />What fees does Re-Wear charge for selling?
            </MDBTypography>
            <p>
              <strong>
                <u>Unfortunately no</u>.
              </strong>{" "}
              We do not charge for 1st month after that we allow user to buy membership and Feature their product to sell faster.
            </p>
          </MDBCol>
          <MDBCol md="6" lg="4" className="mb-4">
            <MDBTypography tag="h6" className="mb-3 text-primary">
              <MDBIcon fas icon="book-open text-primary pe-2" />How do I create an account on Re-Wear?
            </MDBTypography>
            <p>
              If u want to buy just register yourself. But if you want to sell anything complete your profile and then you will be able to sell
            </p>
          </MDBCol>
          <MDBCol md="6" lg="4" className="mb-4">
            <MDBTypography tag="h6" className="mb-3 text-primary">
              <MDBIcon fas icon="home text-primary pe-2" />What should I do if my order doesn’t arrive?
            </MDBTypography>
            <p>
              <strong>
                <u>Yes</u>.
              </strong>{" "}
             You can contact admin or email us your issue. we will look into to it and try to resolve the issue
            </p>
          </MDBCol> 
          <MDBCol md="6" lg="4" className="mb-4">
            <MDBTypography tag="h6" className="mb-3 text-primary">
              <MDBIcon fas icon="home text-primary pe-2" />How can I contact Re-Wear customer support?
            </MDBTypography>
            <p>
              <strong>
                <u>Yes</u>.
              </strong>{" "}
              You can email us your querry or you can use website support.
              13408@students.riphah.edu.pk
              29423@students.riphah.edu.pk

            </p>
          </MDBCol>
        </MDBRow>
      </section>
    </MDBContainer>
  );
}