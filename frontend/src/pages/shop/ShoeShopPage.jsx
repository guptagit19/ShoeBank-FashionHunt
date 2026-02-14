import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, ChevronDown, TrendingUp } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import ShopFilters from '../../components/ShopFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import { productsApi, categoriesApi } from '../../services/api';
import { getTheme } from '../../utils/theme';

function ShoeShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = getTheme('shoes');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [activeFilters, setActiveFilters] = useState({
        price: { min: '', max: '' },
        brands: [],
        sizes: []
    });

    useEffect(() => {
        fetchProducts();
    }, [searchParams, activeFilters]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const catRes = await categoriesApi.getBySlug('shoes');
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
            if (activeFilters.brands?.length === 1) params.brand = activeFilters.brands[0];

            const res = await productsApi.getAll(params);
            setProducts(res.data.data.content || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterConfig = [
        { id: 'price', title: 'Price Range', type: 'range' },
        {
            id: 'brands', title: 'Top Brands', type: 'checkbox',
            options: [
                { label: 'Nike', value: 'nike' },
                { label: 'Adidas', value: 'adidas' },
                { label: 'Jordan', value: 'jordan' },
                { label: 'New Balance', value: 'new_balance' },
                { label: 'Puma', value: 'puma' }
            ]
        },
        {
            id: 'sizes', title: 'US Sizes', type: 'pills',
            options: ['7', '8', '9', '10', '11', '12'].map(s => ({ label: s, value: s }))
        }
    ];

    return (
        <div className="min-h-screen bg-street-900 text-white font-sans selection:bg-[#ccff00] selection:text-black page-bottom">

            {/* Hero — Compact on mobile */}
            <div className="relative pt-16 pb-8 md:pt-32 md:pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-street-800 to-transparent opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-8">
                        <div>
                            <span className="text-[#ccff00] font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase mb-2 md:mb-4 block text-xs md:text-base animate-slide-up">
                                New Drop 2024
                            </span>
                            <h1 className="text-4xl md:text-9xl font-black italic uppercase leading-none tracking-tighter animate-slide-up">
                                Street<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Legend</span>
                            </h1>
                        </div>
                        <div className="mb-0 md:mb-4 animate-slide-up">
                            <p className="text-gray-400 max-w-sm text-sm md:text-lg font-mono">
                                Curated collection of the rarest kicks. Verified authentic.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Toolbar — Mobile optimized */}
            <div className="sticky top-14 md:top-20 z-30 bg-street-900/90 backdrop-blur-md border-y border-street-800">
                <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-wrap items-center justify-between gap-3 md:gap-4">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowFilters(true)}
                            className="flex items-center space-x-2 bg-street-800 text-white px-4 py-2 md:px-6 border border-street-700 hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all uppercase font-bold text-xs tracking-wider touch-target rounded-lg md:rounded-none"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <span className="text-xs text-gray-500 hidden md:inline">{products.length} Results</span>
                    </div>

                    <div className="flex-1 max-w-xs md:max-w-lg mx-2 md:mx-auto w-full order-last md:order-none mt-2 md:mt-0">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#ccff00] transition-colors" />
                            <input
                                type="text"
                                placeholder="SEARCH KICKS..."
                                defaultValue={searchParams.get('search') || ''}
                                className="w-full bg-street-950 border border-street-800 py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#ccff00] transition-colors font-mono placeholder-gray-600 rounded-lg md:rounded-none"
                                onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), search: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <select
                            className="bg-transparent text-white font-bold uppercase text-xs focus:outline-none cursor-pointer touch-target"
                            value={searchParams.get('sort') || 'createdAt'}
                            onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), sort: e.target.value })}
                        >
                            <option value="createdAt" className="bg-street-900">Latest</option>
                            <option value="price_asc" className="bg-street-900">Price ↑</option>
                            <option value="price_desc" className="bg-street-900">Price ↓</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-12">
                <ShopFilters
                    isOpen={showFilters}
                    onClose={() => setShowFilters(false)}
                    filters={filterConfig}
                    activeFilters={activeFilters}
                    onFilterChange={(id, val) => setActiveFilters(prev => ({ ...prev, [id]: val }))}
                    theme={theme}
                />

                {loading ? (
                    <div className="py-20 md:py-40 flex justify-center">
                        <LoadingSpinner size="xl" color="border-[#ccff00]" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-gray-400 text-lg">No products found matching your filters.</p>
                        <button
                            onClick={() => { setActiveFilters({ price: { min: '', max: '' }, brands: [], sizes: [] }); setSearchParams({}); }}
                            className="mt-4 px-6 py-2 bg-[#ccff00] text-black font-bold rounded-lg touch-target"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-x-6 md:gap-y-12">
                        {/* Promo Card — full-width mobile */}
                        <div className="col-span-2 bg-[#ccff00] text-black p-5 md:p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:bg-white transition-colors rounded-2xl md:rounded-none">
                            <div className="relative z-10">
                                <span className="font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1 md:mb-2 block">Weekly Highlight</span>
                                <h3 className="text-2xl md:text-4xl font-black italic uppercase leading-tight mb-3 md:mb-4">
                                    Air Max<br />Day 2024
                                </h3>
                                <button className="bg-black text-white px-5 py-2 font-bold uppercase text-xs hover:scale-105 transition-transform rounded-lg md:rounded-none touch-target">
                                    Shop Collection
                                </button>
                            </div>
                            <TrendingUp className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-20 h-20 md:w-32 md:h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        {products.map(product => (
                            <ProductCard key={product.id} product={product} categoryTheme={theme} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShoeShopPage;
