import { useState, useEffect } from 'react';
import { Eye, X, Truck, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../services/api';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await adminApi.getOrders({ page: 0, size: 100 });
            setOrders(response.data.data.content || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await adminApi.updateOrderStatus(orderId, newStatus);
            toast.success('Order status updated');
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                const updatedOrder = await adminApi.getOrder(orderId);
                setSelectedOrder(updatedOrder.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-700',
            CONFIRMED: 'bg-blue-100 text-blue-700',
            PROCESSING: 'bg-purple-100 text-purple-700',
            SHIPPED: 'bg-indigo-100 text-indigo-700',
            DELIVERED: 'bg-green-100 text-green-700',
            CANCELLED: 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const statusOptions = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    const filteredOrders = statusFilter
        ? orders.filter(o => o.orderStatus === statusFilter)
        : orders;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500">{orders.length} orders total</p>
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input w-full sm:w-48"
                >
                    <option value="">All Status</option>
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-primary-500">{order.orderNumber}</p>
                                        <p className="text-sm text-gray-500">{order.items?.length} items</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{order.customerName}</p>
                                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${order.orderType === 'FOOD' ? 'bg-green-100 text-green-700' :
                                                order.orderType === 'SHOES' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-purple-100 text-purple-700'
                                            }`}>
                                            {order.orderType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        Rs. {order.totalAmount?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className={`appearance-none px-3 py-1.5 pr-8 rounded-full text-sm font-medium cursor-pointer ${getStatusColor(order.orderStatus)}`}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No orders found</p>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                                <p className="text-primary-500">{selectedOrder.orderNumber}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Name</p>
                                        <p className="font-medium">{selectedOrder.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Phone</p>
                                        <p className="font-medium">{selectedOrder.customerPhone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-500">Address</p>
                                        <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <img
                                                src={item.productImage || 'https://via.placeholder.com/50'}
                                                alt={item.productName}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.productName}</p>
                                                <p className="text-sm text-gray-500">
                                                    Qty: {item.quantity}
                                                    {item.selectedSize && ` • Size: ${item.selectedSize}`}
                                                    {item.selectedColor && ` • Color: ${item.selectedColor}`}
                                                </p>
                                            </div>
                                            <p className="font-medium">Rs. {item.subtotal?.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>Rs. {selectedOrder.subtotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Delivery</span>
                                        <span>Rs. {selectedOrder.deliveryCharge?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                        <span>Total</span>
                                        <span className="text-primary-500">Rs. {selectedOrder.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Update Status */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {statusOptions.map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedOrder.orderStatus === status
                                                    ? getStatusColor(status)
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
