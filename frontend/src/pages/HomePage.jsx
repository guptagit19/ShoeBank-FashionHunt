import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Zap, TrendingUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { categoriesApi, productsApi } from '../services/api';

const categoryMeta = {
    shoes: {
        emoji: '👟',
        gradient: 'from-gray-900 via-gray-800 to-black',
        accent: 'bg-[#ccff00] text-black',
        desc: 'Premium kicks & streetwear',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop',
    },
    clothes: {
        emoji: '👕',
        gradient: 'from-[#5c3e2e] via-[#704c36] to-[#4d3428]',
        accent: 'bg-fashion-200 text-fashion-900',
        desc: 'Curated fashion & trends',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
    },
    food: {
        emoji: '🍴',
        gradient: 'from-orange-600 via-amber-600 to-yellow-700',
        accent: 'bg-white text-organic-700',
        desc: 'Fresh food & beverages',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop',
    },
};

function HomePage() {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = [
        {
            id: 'shoes',
            title: "Urban Movement",
            subtitle: "Next gen streetwear",
            bg: "from-street-900 to-black",
            accent: "text-[#ccff00]",
            button: "bg-[#ccff00] text-black hover:bg-white",
            link: "/products/shoes",
            image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 'fashion',
            title: "Redefine Style",
            subtitle: "Luxury collection",
            bg: "from-fashion-800 to-fashion-900",
            accent: "text-fashion-200",
            button: "bg-fashion-200 text-fashion-900 hover:bg-white",
            link: "/products/clothes",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 'food',
            title: "Pure & Fresh",
            subtitle: "Taste nature's best",
            bg: "from-organic-600 to-organic-800",
            accent: "text-organic-300",
            button: "bg-white text-organic-700 hover:bg-organic-50",
            link: "/products/food",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, productsRes] = await Promise.all([
                    categoriesApi.getAll(),
                    productsApi.getFeatured()
                ]);
                setCategories(categoriesRes.data.data || []);
                setFeaturedProducts(productsRes.data.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-14">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen page-bottom">

            {/* ===== HERO CAROUSEL ===== */}
            <section className="relative h-[60vh] md:h-screen overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div className="absolute inset-0 bg-black/50 z-10" />
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />
                        <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
                            <div className="max-w-4xl animate-slide-up">
                                <span className={`inline-block text-sm md:text-xl font-medium tracking-widest uppercase mb-3 md:mb-4 ${slide.accent}`}>
                                    {slide.subtitle}
                                </span>
                                <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold text-white mb-6 md:mb-8 leading-tight">
                                    {slide.title}
                                </h1>
                                <Link
                                    to={slide.link}
                                    className={`inline-flex items-center space-x-2 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold uppercase tracking-wider transition-all transform hover:scale-105 hover:shadow-xl text-sm md:text-base touch-target ${slide.button}`}
                                >
                                    <span>Shop Now</span>
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 touch-target ${index === activeSlide ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            </section>

            {/* ===== FEATURES BANNER ===== */}
            <div className="bg-black text-white py-4 md:py-6 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:justify-between items-center gap-3 md:gap-4 text-xs md:text-base font-medium uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 md:w-5 md:h-5 text-[#ccff00]" />
                        <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 md:w-5 md:h-5 text-[#ccff00]" />
                        <span>Authentic Products</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 md:w-5 md:h-5 text-[#ccff00]" />
                        <span>Exclusive Drops</span>
                    </div>
                </div>
            </div>

            {/* ===== CATEGORY CARDS — MOBILE: VERTICAL FULL-WIDTH STACK ===== */}
            <section className="py-8 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 md:mb-12 text-center md:text-left">
                        <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Browse Categories</span>
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mt-1 md:mt-2">What are you shopping for?</h2>
                    </div>

                    <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-8">
                        {categories.map((category) => {
                            const slug = category.slug?.toLowerCase();
                            const meta = categoryMeta[slug] || categoryMeta.shoes;
                            return (
                                <Link
                                    key={category.id}
                                    to={`/products/${slug}`}
                                    className="group relative overflow-hidden rounded-2xl md:rounded-md md:h-[500px] h-[180px] touch-target"
                                >
                                    <img
                                        src={meta.image}
                                        alt={category.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                                    <div className="absolute inset-0 flex items-center md:items-end p-6 md:p-8">
                                        <div className="flex items-center md:flex-col md:items-start gap-3 md:gap-2 w-full">
                                            <span className="text-3xl md:text-4xl">{meta.emoji}</span>
                                            <div className="flex-1">
                                                <h3 className="text-xl md:text-3xl font-bold text-white">{category.name}</h3>
                                                <p className="text-white/70 text-sm mt-0.5 hidden md:block">{meta.desc}</p>
                                            </div>
                                            <div className={`flex items-center space-x-1 px-4 py-2 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider transition-all ${meta.accent}`}>
                                                <span>Shop Now</span>
                                                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== FEATURED PRODUCTS ===== */}
            {featuredProducts.length > 0 && (
                <section className="py-10 md:py-24 bg-gray-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-[#ccff00] opacity-10 rounded-full filter blur-[100px]" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-16">
                            <div>
                                <div className="flex items-center space-x-2 text-[#ccff00] mb-2 md:mb-4">
                                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="uppercase tracking-widest font-bold font-mono text-xs md:text-sm">Trending Now</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase italic font-display">
                                    Fresh <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-white">Drops</span>
                                </h2>
                            </div>
                            <Link to="/products/shoes" className="mt-4 md:mt-0 group flex items-center space-x-3">
                                <span className="uppercase tracking-widest font-bold text-sm group-hover:text-[#ccff00] transition-colors">View All</span>
                                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#ccff00] group-hover:border-[#ccff00] transition-all touch-target">
                                    <ArrowRight className="w-4 h-4 group-hover:text-black" />
                                </div>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
                            {featuredProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== NEWSLETTER / CTA ===== */}
            <section className="py-12 md:py-24 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">
                        Join the Inner Circle
                    </h2>
                    <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-10 font-light">
                        Be the first to know about exclusive drops, fashion edits, and secret sales.
                    </p>
                    <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3 md:gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-5 py-3 md:py-4 bg-gray-800 border border-gray-700 text-white rounded-xl md:rounded-none focus:outline-none focus:border-[#ccff00] placeholder-gray-500 text-base"
                        />
                        <button className="px-6 py-3 md:py-4 bg-[#ccff00] text-black font-bold uppercase tracking-wider rounded-xl md:rounded-none hover:bg-white transition-colors touch-target">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
