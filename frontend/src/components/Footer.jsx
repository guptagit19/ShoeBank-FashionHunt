import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white page-bottom">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {/* Brand — full width on mobile */}
                    <div className="col-span-2">
                        <div className="flex items-center space-x-2 mb-3 md:mb-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 gradient-primary rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-base md:text-xl">S</span>
                            </div>
                            <span className="text-base md:text-xl font-bold">ShoeBank</span>
                        </div>
                        <p className="text-gray-400 mb-3 md:mb-4 max-w-md text-xs md:text-base">
                            Your one-stop destination for premium shoes, trendy clothes, and delicious food.
                        </p>
                        <div className="flex space-x-3">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors touch-target">
                                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm md:text-lg font-semibold mb-3 md:mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {[
                                { to: '/products/shoes', label: 'Shoes 👟' },
                                { to: '/products/clothes', label: 'Clothes 👕' },
                                { to: '/products/food', label: 'Food 🍴' },
                                { to: '/cart', label: 'Cart' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-gray-400 hover:text-white transition-colors text-xs md:text-base">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm md:text-lg font-semibold mb-3 md:mb-4">Contact</h3>
                        <ul className="space-y-2 md:space-y-3">
                            {[
                                { icon: MapPin, text: 'Kathmandu, Nepal' },
                                { icon: Phone, text: '+977 9800000000' },
                                { icon: Mail, text: 'hello@shoebank.com' },
                            ].map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center space-x-2 text-gray-400 text-xs md:text-base">
                                    <Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-gray-400 text-xs md:text-base">
                    <p>&copy; {new Date().getFullYear()} ShoeBank. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
