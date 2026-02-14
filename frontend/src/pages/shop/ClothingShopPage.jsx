import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import ShopFilters from '../../components/ShopFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import { productsApi, categoriesApi } from '../../services/api';
import { getTheme } from '../../utils/theme';

function ClothingShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = getTheme('clothes');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [activeFilters, setActiveFilters] = useState({
        price: { min: '', max: '' },
        gender: [],
        sizes: [],
        occasion: []
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let catRes = await categoriesApi.getBySlug('clothes').catch(() => null);
                if (!catRes) catRes = await categoriesApi.getBySlug('fashion').catch(() => null);
                if (!catRes) { console.error("Clothes category not found"); return; }

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
                if (activeFilters.gender?.length === 1) params.gender = activeFilters.gender[0];
                if (activeFilters.occasion?.length === 1) params.occasion = activeFilters.occasion[0];

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
            id: 'gender', title: 'Category', type: 'checkbox',
            options: [
                { label: 'Men', value: 'men' },
                { label: 'Women', value: 'women' },
                { label: 'Unisex', value: 'unisex' }
            ]
        },
        {
            id: 'sizes', title: 'Size', type: 'pills',
            options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => ({ label: s, value: s }))
        },
        {
            id: 'occasion', title: 'Occasion', type: 'checkbox',
            options: [
                { label: 'Casual', value: 'casual' },
                { label: 'Formal', value: 'formal' },
                { label: 'Party', value: 'party' },
                { label: 'Gym', value: 'gym' }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-fashion-50 text-fashion-900 font-serif page-bottom">
            <ShopFilters
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filterConfig}
                activeFilters={activeFilters}
                onFilterChange={(id, val) => setActiveFilters(prev => ({ ...prev, [id]: val }))}
                theme={theme}
            />

            {/* Editorial Header — Compact on mobile */}
            <div className="relative pt-16 pb-8 md:pt-32 md:pb-16 px-4 md:px-6 border-b border-fashion-200 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-[10px] md:text-sm font-sans uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 mb-2 md:mb-4 animate-slide-up">
                        Spring / Summer 2024
                    </p>
                    <h1 className="text-4xl md:text-8xl font-serif font-thin mb-4 md:mb-8 animate-slide-up text-fashion-900">
                        The Edit
                    </h1>

                    {/* Subcategory tabs — horizontal scroll on mobile */}
                    <div className="flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-4 md:gap-8 pb-2 animate-slide-up">
                        {['New Arrivals', 'Best Sellers', "Editor's Pick", 'Casual', 'Formal', 'Ethnic'].map((tab) => (
                            <button
                                key={tab}
                                className="flex-shrink-0 text-xs md:text-sm font-sans uppercase tracking-widest hover:underline underline-offset-4 decoration-fashion-600 transition-all py-2 px-1 touch-target whitespace-nowrap text-fashion-700"
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="sticky top-14 md:top-16 z-30 bg-white/90 backdrop-blur-md border-b border-fashion-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    <button
                        onClick={() => setShowFilters(true)}
                        className="flex items-center space-x-2 font-sans text-xs md:text-sm uppercase tracking-widest hover:text-fashion-600 transition-colors touch-target"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filter</span>
                    </button>

                    <span className="hidden md:block font-serif italic text-2xl absolute left-1/2 -translate-x-1/2">
                        Fashion Hunt
                    </span>

                    <div className="flex items-center space-x-4 md:space-x-6">
                        {/* Search — visible on mobile now */}
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="border-b border-transparent group-hover:border-fashion-300 focus:border-fashion-900 bg-transparent py-1 px-2 text-xs md:text-sm font-sans focus:outline-none transition-all w-24 md:w-32 focus:w-36 md:focus:w-48 placeholder-gray-400"
                                onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), search: e.target.value })}
                            />
                            <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="flex items-center space-x-1 font-sans text-xs uppercase tracking-widest cursor-pointer">
                            <select
                                className="bg-transparent focus:outline-none cursor-pointer appearance-none pr-3 relative z-10 touch-target"
                                onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), sort: e.target.value })}
                            >
                                <option value="createdAt">Newest</option>
                                <option value="price_asc">Price ↑</option>
                                <option value="price_desc">Price ↓</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid — Instagram-style single column on mobile */}
            <div className="max-w-7xl mx-auto px-3 md:px-6 py-6 md:py-12">
                {loading ? (
                    <div className="py-20 md:py-40 flex justify-center">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                        <button
                            onClick={() => { setActiveFilters({ price: { min: '', max: '' }, gender: [], sizes: [], occasion: [] }); setSearchParams({}); }}
                            className="mt-4 px-6 py-2 bg-fashion-900 text-white font-bold rounded-lg touch-target"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-x-8 md:gap-y-16">
                        {products.map((product, idx) => (
                            <div key={product.id} className={`${idx % 2 === 0 ? 'mt-0' : 'md:mt-12'} transition-all duration-700`}>
                                <ProductCard product={product} categoryTheme={theme} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClothingShopPage;
