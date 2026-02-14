import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import useCartStore from '../store/cartStore';
import { ordersApi } from '../services/api';

function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, fetchCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        deliveryAddress: '',
        deliveryCity: '',
        deliveryNotes: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        if (cart && cart.items?.length === 0) {
            toast.error('Your cart is empty');
            navigate('/cart');
        }
    }, [cart, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Name is required';
        }

        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = 'Phone is required';
        } else if (!/^[0-9]{10}$/.test(formData.customerPhone)) {
            newErrors.customerPhone = 'Enter valid 10-digit phone number';
        }

        if (!formData.deliveryAddress.trim()) {
            newErrors.deliveryAddress = 'Address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);

        try {
            const sessionId = localStorage.getItem('sessionId');
            const response = await ordersApi.create({
                ...formData,
                sessionId
            });

            if (response.data.success) {
                const orderNumber = response.data.data.orderNumber;
                toast.success('Order placed successfully!');
                navigate(`/order-confirmation/${orderNumber}`);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (!cart) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    const deliveryCharge = cart.subtotal >= 1000 ? 0 : 100;
    const total = (cart.subtotal || 0) + deliveryCharge;

    return (
        <div className="pt-16 md:pt-24 min-h-screen bg-gray-50 page-bottom">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900">Checkout</h1>
                        <p className="text-gray-500 text-sm md:text-base mt-0.5 md:mt-1">Complete your order</p>
                    </div>
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex items-center space-x-1 md:space-x-2 text-gray-600 hover:text-gray-900 touch-target text-sm"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden md:inline">Back to Cart</span>
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Delivery Information */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                                    <MapPin className="w-5 h-5 text-primary-500" />
                                    <span>Delivery Information</span>
                                </h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleChange}
                                                className={`input pl-12 ${errors.customerName ? 'border-red-500' : ''}`}
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        {errors.customerName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="customerPhone"
                                                value={formData.customerPhone}
                                                onChange={handleChange}
                                                className={`input pl-12 ${errors.customerPhone ? 'border-red-500' : ''}`}
                                                placeholder="9800000000"
                                            />
                                        </div>
                                        {errors.customerPhone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email (Optional)
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="customerEmail"
                                                value={formData.customerEmail}
                                                onChange={handleChange}
                                                className="input pl-12"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Delivery Address *
                                        </label>
                                        <textarea
                                            name="deliveryAddress"
                                            value={formData.deliveryAddress}
                                            onChange={handleChange}
                                            rows={3}
                                            className={`input ${errors.deliveryAddress ? 'border-red-500' : ''}`}
                                            placeholder="Enter your full address with landmarks"
                                        />
                                        {errors.deliveryAddress && (
                                            <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="deliveryCity"
                                            value={formData.deliveryCity}
                                            onChange={handleChange}
                                            className="input"
                                            placeholder="e.g., Kathmandu"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Delivery Notes (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="deliveryNotes"
                                            value={formData.deliveryNotes}
                                            onChange={handleChange}
                                            className="input"
                                            placeholder="Any special instructions"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                                    <CreditCard className="w-5 h-5 text-primary-500" />
                                    <span>Payment Method</span>
                                </h2>

                                <div className="border-2 border-primary-500 rounded-xl p-4 bg-primary-50">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                            <span className="text-2xl font-bold text-green-600">e</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">eSewa</p>
                                            <p className="text-sm text-gray-500">Pay securely with eSewa</p>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mt-4">
                                    * For now, Cash on Delivery will be used. eSewa integration coming soon!
                                </p>
                            </div>

                            {/* Mobile Summary & Button (visible on md and below) */}
                            <div className="lg:hidden">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <>
                                            <span>Place Order - Rs. {total.toLocaleString()}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary (Desktop) */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                            {/* Items Preview */}
                            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                                {cart.items?.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        <img
                                            src={item.productImage || 'https://via.placeholder.com/50'}
                                            alt={item.productName}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-medium">Rs. {item.subtotal?.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium">Rs. {cart.subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Delivery</span>
                                    <span className="font-medium text-secondary-500">
                                        {deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge}`}
                                    </span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span className="text-primary-500">Rs. {total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-primary w-full mt-6 py-4 flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <LoadingSpinner size="sm" />
                                ) : (
                                    <span>Place Order</span>
                                )}
                            </button>

                            <p className="text-sm text-center text-gray-500 mt-4">
                                🔒 Your payment information is secure
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
