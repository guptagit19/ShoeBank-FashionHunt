import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import useCartStore from '../store/cartStore';
import { getComponentStyles, getTheme } from '../utils/theme';

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { cart, fetchCart } = useCartStore();
    const location = useLocation();

    const category = location.pathname.split('/')[2];
    const theme = getTheme(category);
    const navbarStyle = getComponentStyles(category, 'navbar');

    useEffect(() => {
        fetchCart();
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchCart]);

    const cartItemCount = cart?.totalItems || 0;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? navbarStyle : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${theme.id === 'shoes' ? 'bg-street-accent text-black' :
                            theme.id === 'clothes' ? 'bg-fashion-900 text-white' :
                                theme.id === 'food' ? 'bg-organic-500 text-white' :
                                    'gradient-primary text-white'
                            }`}>
                            <span className={`font-bold text-lg md:text-xl ${theme.fonts.heading}`}>S</span>
                        </div>
                        <span className={`text-lg md:text-xl font-bold ${theme.fonts.heading} ${isScrolled ? (theme.id === 'shoes' ? 'text-white' : 'text-gray-900') : 'text-white'
                            }`}>
                            ShoeBank
                        </span>
                    </Link>

                    {/* Desktop Navigation — hidden on mobile (BottomNav handles it) */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['Home', 'Shoes', 'Clothes', 'Food'].map((item) => {
                            const path = item === 'Home' ? '/' : `/products/${item.toLowerCase()}`;
                            return (
                                <Link
                                    key={item}
                                    to={path}
                                    className={`font-medium transition-all duration-300 relative group ${isScrolled
                                        ? (theme.id === 'shoes' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-primary-500')
                                        : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    {item}
                                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${theme.id === 'shoes' ? 'bg-street-accent' :
                                        theme.id === 'clothes' ? 'bg-fashion-900' :
                                            theme.id === 'food' ? 'bg-organic-500' :
                                                'bg-white'
                                        }`}></span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Cart icon — desktop only (FloatingCart handles mobile) */}
                    <div className="hidden md:flex items-center">
                        <Link to="/cart" className={`relative p-2 rounded-full transition-colors ${isScrolled
                            ? (theme.id === 'shoes' ? 'text-white hover:bg-street-800' : 'text-gray-700 hover:bg-gray-100')
                            : 'text-white hover:bg-white/10'
                            }`}>
                            <ShoppingCart className="w-6 h-6" />
                            {cartItemCount > 0 && (
                                <span className={`absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center animate-scale-in ${theme.id === 'shoes' ? 'bg-street-accent text-black' :
                                    theme.id === 'clothes' ? 'bg-fashion-900 text-white' :
                                        theme.id === 'food' ? 'bg-organic-500 text-white' :
                                            'bg-primary-500 text-white'
                                    }`}>
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
