import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingDollar, faSackDollar, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function DashboardContent() {
  const { t } = useTranslation();

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="dashboard-card text-white bg-primary h-100">
            <div className="dashboard-card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="dashboard-card-title">{t('weeklySales')}</h5>
                  <h2 className="dashboard-card-text">Rs 15,000</h2>
                  <p className="dashboard-card-subtext">{t('increased')}</p>
                </div>
                <div className="circle-image text-primary">
                  <FontAwesomeIcon icon={faSackDollar} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="dashboard-card text-white bg-danger h-100">
            <div className="dashboard-card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="dashboard-card-title">{t('weeklyOrders')}</h5>
                  <h2 className="dashboard-card-text">45,634</h2>
                  <p className="dashboard-card-subtext">{t('decreased')}</p>
                </div>
                <div className="circle-image text-danger">
                  <FontAwesomeIcon icon={faHandHoldingDollar} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 mb-4">
          <div className="dashboard-card text-white bg-success h-100">
            <div className="dashboard-card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="dashboard-card-title">{t('totalOrders')}</h5>
                  <h2 className="dashboard-card-text">1000</h2>
                  <p className="dashboard-card-subtext">{t('since')}</p>
                </div>
                <div className="circle-image text-success">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;
