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
        <>
            <div className="content-area mt-5 w-full">
                <div className="container-fluid">
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
                    <div className="profile-container">
                        <DashboardContent className="dashboard-content"/>
                        <SellerStatistics className="seller-statistics"/>
                    </div>
                </div>
            </div>
        </>
    );
}
