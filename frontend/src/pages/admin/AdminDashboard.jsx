import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    ArrowUpRight
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../services/api';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminApi.getDashboard();
                setStats(response.data.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingCart,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-500'
        },
        {
            title: 'Pending Orders',
            value: stats?.pendingOrders || 0,
            icon: AlertTriangle,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-500'
        },
        {
            title: 'Total Products',
            value: stats?.totalProducts || 0,
            icon: Package,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-500'
        },
        {
            title: "Today's Revenue",
            value: `Rs. ${(stats?.todayRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-500'
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-sm p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/80">Weekly Revenue</p>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold">Rs. {(stats?.weeklyRevenue || 0).toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl shadow-sm p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/80">Monthly Revenue</p>
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold">Rs. {(stats?.monthlyRevenue || 0).toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-sm p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/80">Completed Orders</p>
                        <Package className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-bold">{stats?.completedOrders || 0}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/admin/products"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div>
                            <p className="font-medium text-gray-900">Add Product</p>
                            <p className="text-sm text-gray-500">Create new</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div>
                            <p className="font-medium text-gray-900">View Orders</p>
                            <p className="text-sm text-gray-500">Manage orders</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    <Link
                        to="/admin/categories"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div>
                            <p className="font-medium text-gray-900">Categories</p>
                            <p className="text-sm text-gray-500">Manage categories</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div>
                            <p className="font-medium text-gray-900">View Store</p>
                            <p className="text-sm text-gray-500">Open website</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </a>
                </div>
            </div>

            {/* Low Stock Alert */}
            {stats?.lowStockProducts > 0 && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                        <p className="font-medium text-yellow-800">Low Stock Alert</p>
                        <p className="text-sm text-yellow-600">
                            {stats.lowStockProducts} products are running low on stock
                        </p>
                    </div>
                    <Link to="/admin/products" className="ml-auto text-yellow-700 font-medium hover:underline">
                        View Products
                    </Link>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
