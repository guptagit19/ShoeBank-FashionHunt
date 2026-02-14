import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, Clock, Check, Truck, ChefHat, Home } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { trackingApi, ordersApi } from '../services/api';

function TrackOrderPage() {
    const { orderNumber } = useParams();
    const [order, setOrder] = useState(null);
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [orderRes, trackingRes] = await Promise.all([
                ordersApi.getByNumber(orderNumber),
                trackingApi.get(orderNumber)
            ]);
            setOrder(orderRes.data.data);
            setTracking(trackingRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Poll for updates every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [orderNumber]);

    const statusSteps = [
        { key: 'ORDER_PLACED', label: 'Order Placed', icon: Package, description: 'Your order has been received' },
        { key: 'CONFIRMED', label: 'Confirmed', icon: Check, description: 'Order confirmed by restaurant' },
        { key: 'PREPARING', label: 'Preparing', icon: ChefHat, description: 'Your food is being prepared' },
        { key: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: Truck, description: 'Your order is out for delivery' },
        { key: 'DELIVERED', label: 'Delivered', icon: Home, description: 'Order delivered successfully' },
    ];

    const getCurrentStepIndex = () => {
        if (!tracking) return 0;
        const index = statusSteps.findIndex(step => step.key === tracking.status);
        return index >= 0 ? index : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                    <Link to="/" className="btn-primary">Go Home</Link>
                </div>
            </div>
        );
    }

    const currentStep = getCurrentStepIndex();
    const isCompleted = tracking?.status === 'DELIVERED';
    const isCancelled = tracking?.status === 'CANCELLED';

    return (
        <div className="pt-20 md:pt-24 min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500">Order Number</p>
                            <p className="text-xl font-bold text-primary-500">{orderNumber}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full ${isCompleted ? 'bg-green-100 text-green-700' :
                                isCancelled ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                            }`}>
                            {tracking?.statusDisplayName || 'Processing'}
                        </div>
                    </div>

                    {tracking?.statusMessage && (
                        <p className="text-gray-600 flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{tracking.statusMessage}</span>
                        </p>
                    )}
                </div>

                {/* Tracking Progress */}
                {!isCancelled && (
                    <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-8">Order Progress</h2>

                        <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            <div
                                className="absolute left-6 top-0 w-0.5 bg-primary-500 transition-all duration-500"
                                style={{ height: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                            ></div>

                            {/* Steps */}
                            <div className="space-y-8">
                                {statusSteps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isActive = index === currentStep;
                                    const isPast = index < currentStep;

                                    return (
                                        <div key={step.key} className="relative flex items-start space-x-4">
                                            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPast || isActive
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-gray-200 text-gray-500'
                                                } ${isActive ? 'ring-4 ring-primary-100 animate-pulse' : ''}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>

                                            <div className="pt-2">
                                                <p className={`font-semibold ${isPast || isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </p>
                                                <p className={`text-sm ${isPast || isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancelled Order */}
                {isCancelled && (
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">😔</span>
                        </div>
                        <h3 className="text-xl font-semibold text-red-700 mb-2">Order Cancelled</h3>
                        <p className="text-red-600">{tracking?.statusMessage}</p>
                    </div>
                )}

                {/* Delivery Person Info */}
                {tracking?.deliveryPersonName && !isCompleted && !isCancelled && (
                    <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Partner</h2>
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">🛵</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{tracking.deliveryPersonName}</p>
                                <p className="text-gray-500">{tracking.deliveryPersonPhone}</p>
                            </div>
                            {tracking.deliveryPersonPhone && (
                                <a
                                    href={`tel:${tracking.deliveryPersonPhone}`}
                                    className="ml-auto btn-primary py-2"
                                >
                                    Call
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Order Summary */}
                <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Package className="w-5 h-5 text-primary-500" />
                        <span>Order Summary</span>
                    </h2>

                    <div className="space-y-3">
                        {order.items?.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <img
                                    src={item.productImage || 'https://via.placeholder.com/50'}
                                    alt={item.productName}
                                    className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.productName}</p>
                                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-4 pt-4">
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="text-primary-500">Rs. {order.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-3xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-primary-500" />
                        <span>Delivery Address</span>
                    </h2>
                    <p className="text-gray-600">{order.deliveryAddress}</p>
                    {order.deliveryCity && (
                        <p className="text-gray-500">{order.deliveryCity}</p>
                    )}
                </div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <Link to="/" className="btn-outline">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default TrackOrderPage;
