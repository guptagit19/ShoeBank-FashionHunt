import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, Star, Flame, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import ShopFilters from '../../components/ShopFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import { productsApi, categoriesApi } from '../../services/api';
import { getTheme } from '../../utils/theme';

function FoodShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = getTheme('food');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);

    const [activeFilters, setActiveFilters] = useState({
        price: { min: '', max: '' },
        diet: [],
        cuisine: [],
        spice: []
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const catRes = await categoriesApi.getBySlug('food');
                const categoryId = catRes.data.data.id;

                // Parse sort value into field + direction
                const sortRaw = searchParams.get('sort') || 'createdAt';
                let sortBy = sortRaw;
                let sortDir = 'desc';
                if (sortRaw === 'price_asc') { sortBy = 'price'; sortDir = 'asc'; }
                else if (sortRaw === 'price_desc') { sortBy = 'price'; sortDir = 'desc'; }

                const params = {
                    page: searchParams.get('page') || 0,
                    size: 12,
                    sortBy,
                    sortDir,
                    categoryId,
                    search: searchParams.get('search') || '',
                };

                // Add filters if set
                if (activeFilters.price?.min) params.minPrice = activeFilters.price.min;
                if (activeFilters.price?.max) params.maxPrice = activeFilters.price.max;
                if (activeFilters.diet?.length === 1) params.tag = activeFilters.diet[0];
                else if (activeFilters.cuisine?.length === 1) params.tag = activeFilters.cuisine[0];

                const res = await productsApi.getAll(params);
                setProducts(res.data.data.content || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchParams, activeFilters]);

    const filterConfig = [
        { id: 'price', title: 'Price Range', type: 'range' },
        {
            id: 'diet', title: 'Dietary', type: 'pills',
            options: [
                { label: '🥬 Veg', value: 'veg' },
                { label: '🍗 Non-Veg', value: 'non-veg' },
                { label: '🌱 Vegan', value: 'vegan' }
            ]
        },
        {
            id: 'cuisine', title: 'Cuisines', type: 'checkbox',
            options: [
                { label: 'Italian', value: 'italian' },
                { label: 'Chinese', value: 'chinese' },
                { label: 'Indian', value: 'indian' },
                { label: 'Fast Food', value: 'fast_food' }
            ]
        }
    ];

    const quickCategories = [
        { label: 'All', emoji: '🔥' },
        { label: 'Starters', emoji: '🥗' },
        { label: 'Mains', emoji: '🍛' },
        { label: 'Pizza', emoji: '🍕' },
        { label: 'Burger', emoji: '🍔' },
        { label: 'Dessert', emoji: '🍰' },
        { label: 'Drinks', emoji: '🥤' },
    ];

    return (
        <div className="min-h-screen bg-orange-50 font-sans page-bottom">
            <ShopFilters
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filterConfig}
                activeFilters={activeFilters}
                onFilterChange={(id, val) => setActiveFilters(prev => ({ ...prev, [id]: val }))}
                theme={theme}
            />

            {/* Header — App-style sticky */}
            <div className="bg-white sticky top-14 md:top-0 z-30 shadow-sm">
                <div className="max-w-2xl mx-auto px-4 pt-3 md:pt-6 pb-2">
                    {/* Location & Time */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-gray-800">
                            <div className="bg-orange-100 p-2 rounded-full mr-2">
                                <MapPin className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Delivering to</p>
                                <p className="font-bold text-xs md:text-sm">Kathmandu, Nepal</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full text-xs font-bold text-green-700">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>35-45 min</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Craving something specific?"
                            className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-12 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400 transition-all font-medium text-sm"
                            onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), search: e.target.value })}
                        />
                        <button
                            onClick={() => setShowFilters(true)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-sm text-gray-600 hover:text-orange-600 touch-target"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Quick Category Tabs — horizontal scroll */}
                <div className="flex overflow-x-auto pb-3 gap-2 px-4 max-w-2xl mx-auto no-scrollbar">
                    {quickCategories.map((cat, i) => (
                        <button
                            key={cat.label}
                            onClick={() => setActiveCategory(i)}
                            className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-2xl font-bold text-xs transition-all touch-target ${i === activeCategory
                                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className="text-lg mb-0.5">{cat.emoji}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-2xl mx-auto px-4 py-4 md:py-8">

                {/* Promo Banner */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 md:p-6 text-white mb-6 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-1.5">
                            <Flame className="w-4 h-4 animate-pulse" />
                            <span className="font-bold text-xs uppercase tracking-wider">Top Offer</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-0.5">50% OFF</h2>
                        <p className="font-medium opacity-90 mb-3 text-sm">First order with code: TASTY50</p>
                        <button className="bg-white text-orange-600 px-4 py-2 rounded-xl font-bold text-xs shadow-sm hover:scale-105 transition-transform touch-target">
                            Claim Now
                        </button>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-8 translate-y-8">
                        <Star className="w-36 h-36 md:w-48 md:h-48" />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Popular Near You 🔥</h2>
                    <button className="text-orange-600 font-bold text-xs touch-target">See All</button>
                </div>

                {loading ? (
                    <div className="py-16 md:py-20 flex justify-center">
                        <LoadingSpinner size="lg" color="text-orange-500" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-gray-500 text-lg">No dishes found matching your filters.</p>
                        <button
                            onClick={() => { setActiveFilters({ price: { min: '', max: '' }, diet: [], cuisine: [], spice: [] }); setSearchParams({}); }}
                            className="mt-4 px-6 py-2 bg-orange-500 text-white font-bold rounded-lg touch-target"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} categoryTheme={theme} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FoodShopPage;
