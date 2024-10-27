import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardTailor from './DashboardTailor';
import TailorStatistics from './TailorStatistics';
import './DashboardTailor.css';
// import './Tailorhome.css';
import { Bounce, ToastContainer } from 'react-toastify';

export default function TailorHome() {
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
        {/* <Sidebar/> */}
            <div className="content-area">
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
                        <DashboardTailor className="dashboard-Tailor"/>
                        <TailorStatistics className="Tailor-statistics"/>
                    </div>
                </div>
            </div>
        </>
    );
}
