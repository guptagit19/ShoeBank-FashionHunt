import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Phone, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { ordersApi } from '../services/api';

function OrderConfirmationPage() {
    const { orderNumber } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await ordersApi.getByNumber(orderNumber);
                setOrder(response.data.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderNumber]);

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

    return (
        <div className="pt-20 md:pt-24 min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Message */}
                <div className="bg-white rounded-3xl shadow-sm p-8 text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
                    <p className="text-gray-500 text-lg mb-4">Your order has been placed successfully</p>

                    <div className="inline-block bg-gray-100 rounded-xl px-6 py-3">
                        <p className="text-sm text-gray-500 mb-1">Order Number</p>
                        <p className="text-xl font-bold text-primary-500">{order.orderNumber}</p>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                        <Package className="w-5 h-5 text-primary-500" />
                        <span>Order Details</span>
                    </h2>

                    <div className="space-y-4">
                        {order.items?.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 py-3 border-b last:border-0">
                                <img
                                    src={item.productImage || 'https://via.placeholder.com/60'}
                                    alt={item.productName}
                                    className="w-16 h-16 object-cover rounded-xl"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.productName}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <span className="font-semibold">Rs. {item.subtotal?.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span>Rs. {order.subtotal?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Delivery</span>
                            <span>Rs. {order.deliveryCharge?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total</span>
                            <span className="text-primary-500">Rs. {order.totalAmount?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-primary-500" />
                        <span>Delivery Information</span>
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">👤</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{order.customerName}</p>
                                <p className="text-gray-500">{order.customerPhone}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">📍</span>
                            </div>
                            <div>
                                <p className="text-gray-900">{order.deliveryAddress}</p>
                                {order.deliveryCity && (
                                    <p className="text-gray-500">{order.deliveryCity}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {order.orderType === 'FOOD' && (
                        <Link
                            to={`/track/${order.orderNumber}`}
                            className="btn-primary flex-1 flex items-center justify-center space-x-2"
                        >
                            <span>Track Order</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    )}
                    <Link
                        to="/"
                        className="btn-outline flex-1 flex items-center justify-center"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OrderConfirmationPage;
