import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '../store/cartStore';
import { getTheme } from '../utils/theme';

function FloatingCart() {
    const { cart } = useCartStore();
    const location = useLocation();
    const cartItemCount = cart?.totalItems || 0;

    // Hide on cart, checkout, admin, and order pages
    const hidePaths = ['/cart', '/checkout', '/admin', '/order-confirmation'];
    if (hidePaths.some(p => location.pathname.startsWith(p))) return null;

    const category = location.pathname.split('/')[2];
    const theme = getTheme(category);

    const getBgColor = () => {
        switch (theme.id) {
            case 'shoes': return 'bg-[#ccff00] text-black hover:bg-white';
            case 'clothes': return 'bg-fashion-900 text-white hover:bg-fashion-700';
            case 'food': return 'bg-organic-500 text-white hover:bg-organic-600';
            default: return 'bg-primary-500 text-white hover:bg-primary-600';
        }
    };

    const getBadgeColor = () => {
        switch (theme.id) {
            case 'shoes': return 'bg-street-900 text-[#ccff00]';
            case 'clothes': return 'bg-white text-fashion-900';
            case 'food': return 'bg-red-500 text-white';
            default: return 'bg-red-500 text-white';
        }
    };

    return (
        <Link
            to="/cart"
            className={`fixed z-40 bottom-20 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${getBgColor()} ${cartItemCount > 0 ? 'animate-bounce-subtle' : ''}`}
            aria-label={`Cart with ${cartItemCount} items`}
        >
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-6 h-6 text-xs font-bold rounded-full flex items-center justify-center animate-scale-in ring-2 ring-white ${getBadgeColor()}`}>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
            )}
        </Link>
    );
}

export default FloatingCart;
