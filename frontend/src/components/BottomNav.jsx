import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Shirt, UtensilsCrossed } from 'lucide-react';
import { getTheme } from '../utils/theme';

const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'shoes', label: 'Shoes', icon: ShoppingBag, path: '/products/shoes', emoji: '👟' },
    { id: 'clothes', label: 'Clothes', icon: Shirt, path: '/products/clothes', emoji: '👕' },
    { id: 'food', label: 'Food', icon: UtensilsCrossed, path: '/products/food', emoji: '🍴' },
];

function BottomNav() {
    const location = useLocation();

    // Determine active tab
    const getActiveTab = () => {
        for (const tab of tabs) {
            if (tab.path === '/' && location.pathname === '/') return tab.id;
            if (tab.path !== '/' && location.pathname.startsWith(tab.path)) return tab.id;
        }
        return 'home';
    };
    const activeTab = getActiveTab();
    const category = location.pathname.split('/')[2];
    const theme = getTheme(category);

    // Don't show on admin or cart/checkout pages
    if (location.pathname.startsWith('/admin')) return null;

    const getActiveColor = (tabId) => {
        if (tabId !== activeTab) return 'text-gray-400';
        switch (tabId) {
            case 'shoes': return 'text-[#ccff00]';
            case 'clothes': return 'text-fashion-700';
            case 'food': return 'text-organic-600';
            default: return 'text-primary-500';
        }
    };

    const getActiveBg = (tabId) => {
        if (tabId !== activeTab) return '';
        switch (tabId) {
            case 'shoes': return 'bg-[#ccff00]/10';
            case 'clothes': return 'bg-fashion-100';
            case 'food': return 'bg-organic-50';
            default: return 'bg-primary-50';
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 safe-bottom">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <Link
                            key={tab.id}
                            to={tab.path}
                            className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-300 touch-target ${getActiveBg(tab.id)}`}
                        >
                            <Icon className={`w-5 h-5 transition-all duration-300 ${getActiveColor(tab.id)} ${isActive ? 'scale-110' : ''}`} />
                            <span className={`text-[10px] mt-1 font-semibold transition-colors duration-300 ${isActive ? getActiveColor(tab.id) : 'text-gray-400'}`}>
                                {tab.label}
                            </span>
                            {isActive && (
                                <div className={`absolute bottom-1 w-1 h-1 rounded-full ${tab.id === 'shoes' ? 'bg-[#ccff00]' :
                                        tab.id === 'clothes' ? 'bg-fashion-700' :
                                            tab.id === 'food' ? 'bg-organic-600' : 'bg-primary-500'
                                    }`} />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export default BottomNav;
