import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Tags,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, checkAuth } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const verify = async () => {
            const isValid = await checkAuth();
            if (!isValid) {
                navigate('/admin/login');
            }
        };
        verify();
    }, [checkAuth, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/categories', icon: Tags, label: 'Categories' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">S</span>
                        </div>
                        <span className="font-bold text-gray-900">Admin Panel</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {/* Logo */}
                <div className="p-6 border-b hidden lg:block">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900">Admin Panel</h1>
                            <p className="text-xs text-gray-500">ShoeBank & Fashion Hunt</p>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <nav className="p-4 mt-16 lg:mt-0">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path, item.exact)
                                                ? 'bg-primary-500 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="border-t mt-8 pt-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <div className="lg:ml-64 pt-16 lg:pt-0">
                <main className="p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
