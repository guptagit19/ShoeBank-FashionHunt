import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Plus, Flame, Heart, Star, Clock, BadgeCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { getTheme, getComponentStyles } from '../utils/theme';

function ProductCard({ product, categoryTheme }) {
    const categoryIdentifier = product.categorySlug || product.categoryName?.toLowerCase();
    const theme = categoryTheme || getTheme(categoryIdentifier);

    const imageUrl = product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.discountPrice / product.price) * 100)
        : 0;

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock < 10;
    const stockPercent = isLowStock ? Math.max(10, Math.round((product.stock / 10) * 100)) : 100;

    // Generate a fake rating based on product id (deterministic)
    const fakeRating = product.id ? (3.5 + ((product.id * 7) % 15) / 10).toFixed(1) : '4.2';
    const fakeReviews = product.id ? 10 + ((product.id * 13) % 490) : 128;

    // ========================================================
    // 1. SHOES — StockX / Nike SNKRS Inspired
    // ========================================================
    if (theme.id === 'shoes') {
        return (
            <Link to={`/product/${product.id}`} className={`group relative block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ccff00]/10 ${isOutOfStock ? 'opacity-60 pointer-events-none' : ''}`}
                style={{ background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 50%, #1e1e1e 100%)' }}>

                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden" style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #f0f0f0 100%)' }}>
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />

                    {/* Discount Tag */}
                    {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] md:text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-lg shadow-red-500/30">
                            {discountPercent}% OFF
                        </div>
                    )}

                    {/* Sold Out Overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="bg-white text-black font-black text-sm md:text-lg px-6 py-2 rounded-lg uppercase tracking-widest shadow-xl">
                                Sold Out
                            </div>
                            <p className="text-gray-400 text-xs mt-2 font-mono">Notify when available</p>
                        </div>
                    )}

                    {/* Low Stock Urgency */}
                    {isLowStock && !isOutOfStock && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            {product.stock} left
                        </div>
                    )}

                    {/* Hover Quick View */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex items-end justify-center pb-6">
                        <div className="flex gap-3">
                            <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-[#ccff00] hover:scale-110 transition-all shadow-xl">
                                <Eye className="w-4 h-4 text-black" />
                            </button>
                            <button className="bg-[#ccff00] p-2.5 rounded-full hover:bg-white hover:scale-110 transition-all shadow-xl">
                                <ShoppingCart className="w-4 h-4 text-black" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-3 md:p-4">
                    {/* Brand + Verified */}
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            {product.brand || product.categoryName}
                        </span>
                        <BadgeCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#ccff00] flex-shrink-0" />
                    </div>

                    {/* Product Name */}
                    <h3 className="text-white text-sm md:text-base font-bold leading-tight mb-2 truncate group-hover:text-[#ccff00] transition-colors">
                        {product.name}
                    </h3>

                    {/* Stock Bar (when low) */}
                    {isLowStock && !isOutOfStock && (
                        <div className="mb-2">
                            <div className="w-full bg-gray-700 rounded-full h-1">
                                <div
                                    className="bg-gradient-to-r from-red-500 to-orange-400 h-1 rounded-full transition-all duration-500"
                                    style={{ width: `${stockPercent}%` }}
                                ></div>
                            </div>
                            <p className="text-orange-400 text-[9px] md:text-[10px] font-mono mt-0.5">Selling fast · {product.stock} remaining</p>
                        </div>
                    )}

                    {/* Price Section */}
                    <div className="flex items-end justify-between mt-auto">
                        <div>
                            {hasDiscount && (
                                <span className="text-gray-500 text-[10px] md:text-xs line-through font-mono block">Rs. {product.price?.toLocaleString()}</span>
                            )}
                            <span className="text-white text-lg md:text-xl font-black font-mono">
                                Rs. {(hasDiscount ? product.discountPrice : product.price)?.toLocaleString()}
                            </span>
                        </div>
                        {!isOutOfStock && (
                            <button className="bg-[#ccff00] text-black p-2 rounded-lg hover:bg-white transition-all hover:scale-110 shadow-lg shadow-[#ccff00]/20 touch-target">
                                <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    // ========================================================
    // 2. CLOTHES — Myntra / Zara Inspired
    // ========================================================
    if (theme.id === 'clothes') {
        return (
            <Link to={`/product/${product.id}`} className={`group block ${isOutOfStock ? 'opacity-60' : ''}`}>
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3 rounded-xl md:rounded-2xl shadow-sm group-hover:shadow-xl transition-shadow duration-300">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />

                    {/* Wishlist Heart */}
                    <button
                        className="absolute top-3 right-3 w-8 h-8 md:w-9 md:h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:scale-110 transition-all z-10"
                        onClick={(e) => e.preventDefault()}
                    >
                        <Heart className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
                    </button>

                    {/* Sale Ribbon */}
                    {hasDiscount && (
                        <div className="absolute top-3 left-0">
                            <div className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-r-lg shadow-lg shadow-red-500/20 uppercase tracking-wide">
                                {discountPercent}% Off
                            </div>
                        </div>
                    )}

                    {/* Sold Out */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="bg-fashion-900 text-white font-serif text-sm md:text-base italic px-6 py-2.5 rounded-lg shadow-xl tracking-wide">
                                Sold Out
                            </div>
                        </div>
                    )}

                    {/* Low Stock Pill */}
                    {isLowStock && !isOutOfStock && (
                        <div className="absolute bottom-3 left-3 right-3">
                            <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center justify-center gap-1.5 shadow-lg">
                                <Flame className="w-3 h-3 text-orange-500" />
                                <span className="text-[10px] md:text-xs font-semibold text-gray-800">
                                    Only {product.stock} left — selling fast!
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Add to Bag (hover) */}
                    {!isOutOfStock && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
                            <button className="w-full bg-fashion-900 text-white text-xs font-bold py-3 uppercase tracking-wider hover:bg-fashion-800 transition-colors rounded-lg flex items-center justify-center gap-2 shadow-xl">
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Add to Bag
                            </button>
                        </div>
                    )}
                </div>

                {/* Card Body */}
                <div className="px-1">
                    {/* Brand Name */}
                    <p className="text-fashion-900 text-xs md:text-sm font-bold uppercase tracking-wide truncate">
                        {product.brand || product.categoryName}
                    </p>
                    {/* Product Name */}
                    <h3 className="text-gray-600 text-xs md:text-sm mt-0.5 truncate">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1.5">
                        <div className="flex items-center gap-0.5 bg-green-600 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded">
                            {fakeRating}
                            <Star className="w-2.5 h-2.5 fill-current" />
                        </div>
                        <span className="text-gray-400 text-[10px] md:text-xs">({fakeReviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-bold text-sm md:text-base text-fashion-900">
                            Rs. {(hasDiscount ? product.discountPrice : product.price)?.toLocaleString()}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-gray-400 text-xs line-through">
                                    Rs. {product.price?.toLocaleString()}
                                </span>
                                <span className="text-orange-500 text-xs font-bold">
                                    ({discountPercent}% off)
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    // ========================================================
    // 3. FOOD — Swiggy / Zomato Style
    // ========================================================
    if (theme.id === 'food') {
        const isVeg = product.tags?.some(t => ['veg', 'vegan', 'organic'].includes(t?.toLowerCase()));
        const isNonVeg = product.tags?.some(t => ['non-veg', 'nonveg'].includes(t?.toLowerCase()));

        return (
            <Link to={`/product/${product.id}`} className={`group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 ${isOutOfStock ? 'opacity-50' : ''}`}>
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden bg-orange-50">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                    {/* Discount Badge on Image */}
                    {hasDiscount && (
                        <div className="absolute top-0 left-0">
                            <div className="bg-blue-600 text-white text-[10px] md:text-xs font-extrabold px-3 py-1.5 rounded-br-xl shadow-lg">
                                {discountPercent}% OFF
                            </div>
                        </div>
                    )}

                    {/* Bestseller Ribbon */}
                    {product.featured && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] md:text-[10px] font-extrabold px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                            ⭐ Bestseller
                        </div>
                    )}

                    {/* Unavailable Overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="bg-white text-gray-800 font-bold text-sm px-5 py-2 rounded-xl shadow-xl">
                                Currently Unavailable
                            </div>
                        </div>
                    )}

                    {/* Rating + Delivery Time on Image Bottom */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1 shadow-md">
                            <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                            <span className="text-xs md:text-sm font-bold text-gray-800">{fakeRating}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1 shadow-md">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] md:text-xs font-semibold text-gray-700">25-35 min</span>
                        </div>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-3 md:p-4">
                    {/* Name + Veg/Non-veg Indicator */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                {/* Veg/Non-veg Dot */}
                                {(isVeg || isNonVeg) && (
                                    <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                        <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                    </span>
                                )}
                                <h3 className="font-bold text-gray-900 text-sm md:text-base truncate group-hover:text-orange-600 transition-colors">
                                    {product.name}
                                </h3>
                            </div>
                        </div>

                        {/* ADD Button */}
                        {!isOutOfStock && (
                            <button className="relative flex-shrink-0 bg-white border-2 border-green-600 text-green-600 font-extrabold text-xs md:text-sm px-4 py-1.5 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm hover:shadow-md touch-target uppercase tracking-wide">
                                ADD
                                <span className="absolute -top-1 -right-1 bg-green-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shadow">+</span>
                            </button>
                        )}
                    </div>

                    {/* Cuisine Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex gap-1.5 mt-1.5 flex-wrap">
                            {product.tags.filter(t => !['veg', 'non-veg', 'nonveg', 'vegan', 'organic'].includes(t?.toLowerCase())).slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] md:text-[11px] font-medium text-gray-500 capitalize">
                                    {tag}
                                </span>
                            ))}
                            {product.tags.filter(t => !['veg', 'non-veg', 'nonveg', 'vegan', 'organic'].includes(t?.toLowerCase())).length > 1 && (
                                <span className="text-[10px] text-gray-300">•</span>
                            )}
                        </div>
                    )}

                    {/* Price + Stock */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-base md:text-lg text-gray-900">
                                Rs. {(hasDiscount ? product.discountPrice : product.price)?.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-gray-400 text-xs line-through">
                                    Rs. {product.price?.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Low Stock Warning */}
                        {isLowStock && !isOutOfStock && (
                            <div className="flex items-center gap-1 text-amber-600">
                                <AlertTriangle className="w-3 h-3" />
                                <span className="text-[10px] md:text-xs font-bold">{product.stock} left</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    // ========================================================
    // DEFAULT LAYOUT
    // ========================================================
    return (
        <Link to={`/product/${product.id}`} className="card hover-lift group rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />
                {hasDiscount && (
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white text-[10px] md:text-sm font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                        -{discountPercent}%
                    </div>
                )}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-sm md:text-lg">Out of Stock</span>
                    </div>
                )}
                {isLowStock && !isOutOfStock && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        <Flame className="w-3 h-3" />
                        Only {product.stock} left!
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                    <button className="w-full bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                        <ShoppingCart className="w-4 h-4" />
                        <span>View Details</span>
                    </button>
                </div>
            </div>

            <div className="p-3 md:p-4">
                <p className="text-[10px] md:text-sm text-primary-500 font-medium mb-0.5 md:mb-1">
                    {product.categoryName}
                </p>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 md:mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-center space-x-1 md:space-x-2">
                    {hasDiscount ? (
                        <>
                            <span className="text-sm md:text-lg font-bold text-primary-500">
                                Rs. {product.discountPrice?.toLocaleString()}
                            </span>
                            <span className="text-[10px] md:text-sm text-gray-400 line-through">
                                Rs. {product.price?.toLocaleString()}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm md:text-lg font-bold text-gray-900">
                            Rs. {product.price?.toLocaleString()}
                        </span>
                    )}
                </div>
                {isLowStock && !isOutOfStock && (
                    <p className="text-[10px] md:text-sm text-orange-500 mt-1 md:mt-2 flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Only {product.stock} left!
                    </p>
                )}
            </div>
        </Link>
    );
}

export default ProductCard;
