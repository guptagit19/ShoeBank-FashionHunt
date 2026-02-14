import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronDown, Filter, Zap, TrendingUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { productsApi, categoriesApi } from '../services/api';
import { getTheme } from '../utils/theme';

function ProductsPage() {
    const { category } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = getTheme(category);

    const [products, setProducts] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    const currentPage = parseInt(searchParams.get('page')) || 0;
    const searchQuery = searchParams.get('search') || '';
    const sortBy = searchParams.get('sort') || 'createdAt';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let categoryId = null;

                if (category) {
                    try {
                        const categoryRes = await categoriesApi.getBySlug(category);
                        const categoryData = categoryRes.data.data;
                        setCategoryInfo(categoryData);
                        categoryId = categoryData.id;
                    } catch (err) {
                        console.error('Error fetching category:', err);
                    }
                } else {
                    setCategoryInfo(null);
                }

                const params = {
                    page: currentPage,
                    size: 12,
                    sortBy,
                    ...(categoryId && { categoryId }),
                    ...(searchQuery && { search: searchQuery })
                };

                const productsRes = await productsApi.getAll(params);
                setProducts(productsRes.data.data.content || []);
                setTotalPages(productsRes.data.data.totalPages || 0);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category, currentPage, searchQuery, sortBy]);

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const search = formData.get('search');
        setSearchParams({ search, page: '0' });
    };

    const handleSortChange = (newSort) => {
        setSearchParams({ ...Object.fromEntries(searchParams), sort: newSort, page: '0' });
    };

    // Promo content based on category
    const getPromoContent = () => {
        switch (theme.id) {
            case 'shoes':
                return {
                    title: "SUMMER HEAT WAVE",
                    subtitle: "Get 20% off on all Air Jordans this week.",
                    bg: "bg-street-accent",
                    text: "text-black"
                };
            case 'clothes':
                return {
                    title: "The Minimalist Edit",
                    subtitle: "Essential pieces for your capsule wardrobe.",
                    bg: "bg-fashion-200",
                    text: "text-fashion-900"
                };
            case 'food':
                return {
                    title: "Farm to Table",
                    subtitle: "Fresh organic vegetables delivered daily.",
                    bg: "bg-organic-100",
                    text: "text-organic-800"
                };
            default:
                return null;
        }
    };

    const promo = getPromoContent();

    return (
        <div className={`min-h-screen pt-16 ${theme.colors.bg} transition-colors duration-500`}>
            {/* Dynamic Hero Banner */}
            <div className={`relative py-20 ${theme.id === 'shoes' ? 'pt-32' : 'pt-24'}`}>
                {theme.id === 'shoes' && <div className="absolute inset-0 bg-street-900 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-50 z-0"></div>}
                {theme.id === 'clothes' && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 z-0"></div>}

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
                    <span className={`inline-block mb-3 text-sm font-bold uppercase tracking-[0.2em] animate-slide-up ${theme.colors.accent}`}>
                        {theme.name} Collection
                    </span>
                    <h1 className={`text-5xl md:text-8xl mb-6 tracking-tight animate-slide-up ${theme.fonts.heading} ${theme.colors.text} ${theme.id === 'shoes' ? 'font-black uppercase italic' : 'font-bold'}`}>
                        {category ? category.toUpperCase() : 'WINTER 2024'}
                    </h1>
                    <p className={`text-lg max-w-2xl mx-auto animate-slide-up ${theme.id === 'shoes' ? 'text-gray-400 font-mono' : 'text-gray-500 font-sans'}`}>
                        {theme.id === 'shoes' ? 'Premium Kicks. Limited Drops. Global Sourcing.' :
                            theme.id === 'clothes' ? 'Curated fashion pieces for the modern aesthetic.' :
                                'Fresh, organic, and delicious food delivered to your doorstep.'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Advanced Filters Bar */}
                <div className={`sticky top-20 z-30 mb-12 p-2 rounded-2xl transition-all duration-300 ${theme.id === 'shoes' ? 'bg-street-800/90 backdrop-blur-md border border-street-700' :
                        theme.id === 'clothes' ? 'bg-white/80 backdrop-blur-md border-b border-fashion-200 rounded-none' :
                            'bg-white/90 backdrop-blur-md shadow-sm border border-gray-100'
                    }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2">
                        <div className="flex items-center space-x-4 flex-1">
                            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${theme.id === 'shoes' ? 'text-white hover:bg-street-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                                <Filter className="w-5 h-5" />
                                <span>Filter</span>
                            </button>

                            <div className="h-6 w-px bg-gray-300 mx-2"></div>

                            <form onSubmit={handleSearch} className="flex-1 max-w-md">
                                <div className="relative group">
                                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${theme.id === 'shoes' ? 'text-street-500 group-hover:text-street-accent' : 'text-gray-400 group-hover:text-primary-500'
                                        }`} />
                                    <input
                                        type="text"
                                        name="search"
                                        defaultValue={searchQuery}
                                        placeholder={`Search ${category || 'products'}...`}
                                        className={`w-full pl-10 pr-4 py-2 bg-transparent border-0 focus:ring-0 placeholder-opacity-50 transition-all ${theme.id === 'shoes' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                                            }`}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className={`appearance-none pl-4 pr-10 py-2 font-medium focus:outline-none cursor-pointer bg-transparent ${theme.id === 'shoes' ? 'text-white' : 'text-gray-900'
                                        }`}
                                >
                                    <option value="createdAt" className="text-black">Newest Drops</option>
                                    <option value="price" className="text-black">Price: Low to High</option>
                                    <option value="name" className="text-black">Name: A to Z</option>
                                </select>
                                <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${theme.id === 'shoes' ? 'text-white' : 'text-gray-900'
                                    }`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid with Promo Injection */}
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <LoadingSpinner size="xl" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 animate-fade-in">
                        <div className="text-6xl mb-4">😕</div>
                        <h3 className={`text-xl font-semibold mb-2 ${theme.colors.text}`}>No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <>
                        {/* Promo Banner (Inserted if products exist) */}
                        {promo && (
                            <div className={`mb-16 rounded-3xl overflow-hidden relative ${promo.bg} ${promo.text} p-8 md:p-12 flex items-center justify-between`}>
                                <div className="relative z-10 max-w-xl">
                                    <div className="flex items-center space-x-2 mb-4 font-bold uppercase tracking-wider opacity-70">
                                        <Zap className="w-5 h-5" />
                                        <span>Limited Offer</span>
                                    </div>
                                    <h3 className={`text-4xl md:text-5xl font-bold mb-4 ${theme.fonts.heading}`}>{promo.title}</h3>
                                    <p className="text-lg md:text-xl opacity-90">{promo.subtitle}</p>
                                </div>
                                <div className="hidden md:block">
                                    <TrendingUp className="w-32 h-32 opacity-20" />
                                </div>
                            </div>
                        )}

                        <div className={`grid gap-x-6 gap-y-12 animate-slide-up ${theme.id === 'food' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                            }`}>
                            {products.map((product, index) => (
                                <ProductCard key={product.id} product={product} categoryTheme={theme} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-20 space-x-2">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: i.toString() })}
                                        className={`w-12 h-12 flex items-center justify-center font-bold transition-all ${currentPage === i
                                                ? (theme.colors.button)
                                                : (theme.id === 'shoes' ? 'bg-street-800 text-gray-400 hover:bg-street-700' : 'bg-white text-gray-700 hover:bg-gray-100')
                                            } ${theme.id === 'food' ? 'rounded-full' : 'rounded-none'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductsPage;
