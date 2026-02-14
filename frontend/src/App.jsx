import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import FloatingCart from './components/FloatingCart';
import HomePage from './pages/HomePage';
import ShoeShopPage from './pages/shop/ShoeShopPage';
import ClothingShopPage from './pages/shop/ClothingShopPage';
import FoodShopPage from './pages/shop/FoodShopPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';

function App() {
    return (
        <Router>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 2500,
                    style: {
                        background: '#1a1a1a',
                        color: '#fff',
                        borderRadius: '12px',
                        fontSize: '14px',
                        padding: '12px 16px',
                    },
                }}
            />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                    <>
                        <Navbar />
                        <HomePage />
                        <Footer />
                        <FloatingCart />
                        <BottomNav />
                    </>
                } />

                {/* Specialized Shop Routes */}
                <Route path="/products/shoes" element={
                    <>
                        <Navbar />
                        <ShoeShopPage />
                        <Footer />
                        <FloatingCart />
                        <BottomNav />
                    </>
                } />
                <Route path="/products/clothes" element={
                    <>
                        <Navbar />
                        <ClothingShopPage />
                        <Footer />
                        <FloatingCart />
                        <BottomNav />
                    </>
                } />
                <Route path="/products/fashion" element={
                    <>
                        <Navbar />
                        <ClothingShopPage />
                        <Footer />
                        <FloatingCart />
                        <BottomNav />
                    </>
                } />
                <Route path="/products/food" element={
                    <>
                        <Navbar />
                        <FoodShopPage />
                        <Footer />
                        <FloatingCart />
                        <BottomNav />
                    </>
                } />

                {/* Generic Fallback Route */}
                <Route path="/products/:category" element={
                    <>
                        <Navbar />
                        <ProductsPage />
                        <Footer />
                        <FloatingCart />
                        <BottomNav />
                    </>
                } />
                <Route path="/product/:id" element={
                    <>
                        <Navbar />
                        <ProductDetailPage />
                        <Footer />
                        <FloatingCart />
                        <BottomNav />
                    </>
                } />
                <Route path="/cart" element={
                    <>
                        <Navbar />
                        <CartPage />
                        <Footer />
                        <BottomNav />
                    </>
                } />
                <Route path="/checkout" element={
                    <>
                        <Navbar />
                        <CheckoutPage />
                        <Footer />
                        <BottomNav />
                    </>
                } />
                <Route path="/order-confirmation/:orderNumber" element={
                    <>
                        <Navbar />
                        <OrderConfirmationPage />
                        <Footer />
                        <BottomNav />
                    </>
                } />
                <Route path="/track/:orderNumber" element={
                    <>
                        <Navbar />
                        <TrackOrderPage />
                        <Footer />
                        <BottomNav />
                    </>
                } />

                {/* Admin Routes — no BottomNav or FloatingCart */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="categories" element={<AdminCategories />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
