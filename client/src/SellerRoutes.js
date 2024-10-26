import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerHome from './pages/seller/SellerHome';
import Uploadproducts from './pages/seller/uploadproduct';
import SellerProfilePage from './pages/seller/sellerprofile';
import Navbar from './pages/seller/navbar';
import CataloguePage from './pages/seller/catalogue';
import BuyerReviews from './components/buyerReview';
import OrdersPage from './pages/seller/orders';
// import OTPinput from './routes/OTPinput';

function SellerRoutes() {
    return (
        <div className="seller-layout">
            <Navbar />
            <main >
                <Routes>
                    <Route path='/seller' element={<SellerHome />} />
                    <Route path= '/verify_otp' element={<OTPinput/>}/> OTP Verification page
                    {/* <Route path='/orders' element={<OrderDetail />} />  order details page */}
                    <Route path='/catalogue' element={<CataloguePage />} />
                    <Route path='/myproduct' element={<Uploadproducts />} />
                    <Route path='/sellerprofile' element={<SellerProfilePage />} />
                    <Route path='/Orders' element={<OrdersPage />} />
                    <Route path='*' element={<SellerHome />} />
                    <Route path='/reviews' element={<BuyerReviews />} />
                </Routes>
            </main>
        </div>
    );
}

export default SellerRoutes;
