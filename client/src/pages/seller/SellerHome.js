import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardContent from './DashboardContent';
import SellerStatistics from './SellerStatistics';
import './DashboardContent.css';
// import './sellerhome.css';
import { Bounce, ToastContainer } from 'react-toastify';

export default function SellerHome() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

       // Check if user exists and has a role
       if (user && user.role) {
            if (user.role === 'Tailor') {
                console.log('Tailor');
                navigate('/tailor');
            } else if (user.role === 'Buyer') {
                console.log('Buyer');
                navigate('/');
            }
        }
    }, [navigate]);

    return (
        <div className="content-area">
            <div className="container-fluid bg-white rounded-lg p-3">
                <ToastContainer
                    position='top-right'
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    theme='dark'
                    transition={Bounce}
                    limit={4}
                />
                <div className="m-0 width-full size-full bg-white rounded-lg justify-center">
                    <DashboardContent className="dashboard-content"/>
                    <SellerStatistics className="seller-statistics"/>
                </div>
            </div>
        </div>
    );
}
