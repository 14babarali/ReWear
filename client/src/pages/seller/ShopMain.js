import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";
import Shopi from "./Giff/Shopi.png"
import './ShopMain.css';

const ShopMain = () => {
  const { t } = useTranslation();

  return (
    <div className="shop-main-profile-container">
     <img
          src={Shopi} 
          alt="Cover"
          className="shop-main-head-image"
          style={{marginTop:"10px"}}
        />
      <div className="shop-main-top-background">
        <img
          src="https://via.placeholder.com/1000x300" // Replace with the actual image URL
          alt="Cover"
          className="shop-main-background-image"
        />
      </div>

      {/* Content Wrap - contains profile, services, collections */}
      <div className="shop-main-content-wrap">
        <div className="shop-main-profile-section">
          <div className="shop-main-profile-picture">
            <img src="https://via.placeholder.com/100" alt="Profile" />
          </div>
          <div className="shop-main-profile-details">
            <h2>Dress Maker</h2>
            <p><strong>{t("Working Hours")}:</strong> 8 Hours</p>
            <p><strong>{t("Desc")}</strong> Lovely Bridal Dresses that can make life happy</p>
          </div>
        </div>

        <div className="shop-main-content-section">
          {/* Services Section */}
          <div className="shop-main-services-section">
            <h3>{t("Services")}</h3>
            <ul>
              <li>
                Bridal Dresses 
                <FontAwesomeIcon icon={faTrashAlt} className="shop-main-delete-icon" />
              </li>
              <li>
                Quick Service
                <FontAwesomeIcon icon={faTrashAlt} className="shop-main-delete-icon" />
              </li>
              <li>
                Unique design
                <FontAwesomeIcon icon={faTrashAlt} className="shop-main-delete-icon" />
              </li>
            </ul>
            <button className="shop-main-add-service-btn">
              <FontAwesomeIcon icon={faPlus} /> {t("Add")}
            </button>
          </div>

          {/* Collections Section */}
          <div className="shop-main-collections-section">
            <div className="shop-main-add-collection">
              <div className="shop-main-add-collection-circle">
                <FontAwesomeIcon icon={faPlus} className="shop-main-add-icon" />
              </div>
              <p>{t("Add Collection")}</p>
            </div>
            <div className="shop-main-content-buttons">
              <button className="shop-main-content-tab active">{t("Products")}</button>
              <button className="shop-main-content-tab">{t("Collections")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopMain;
