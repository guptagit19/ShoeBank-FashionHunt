import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { productsApi } from '../services/api';
import useCartStore from '../store/cartStore';

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');

    const { addToCart, loading: cartLoading } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productsApi.getById(id);
                setProduct(response.data.data);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Product not found');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = async () => {
        // Validation: Check if size is selected for products that have sizes
        if (product.size && !isFood && !selectedSize) {
            toast.error('Please select a size');
            return;
        }

        // Validation: Check if color is selected for products that have colors
        if (product.color && !isFood && !selectedColor) {
            toast.error('Please select a color');
            return;
        }

        try {
            await addToCart({
                productId: parseInt(id),
                quantity,
                selectedSize,
                selectedColor,
                specialInstructions
            });
            toast.success('Added to cart!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const images = product.images?.length > 0
        ? product.images
        : ['https://via.placeholder.com/600x600?text=No+Image'];

    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const displayPrice = hasDiscount ? product.discountPrice : product.price;
    const isFood = product.categorySlug === 'food';

    return (
        <div className="pt-20 md:pt-24 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Gallery */}
                        <div className="p-6 md:p-8">
                            {/* Main Image */}
                            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                                <img
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="flex space-x-3 overflow-x-auto">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary-500' : 'border-transparent'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-6 md:p-8 border-l border-gray-100">
                            <p className="text-primary-500 font-medium mb-2">{product.categoryName}</p>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline space-x-3 mb-6">
                                <span className="text-3xl font-bold text-primary-500">
                                    Rs. {displayPrice?.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <span className="text-xl text-gray-400 line-through">
                                        Rs. {product.price?.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {product.description || 'No description available'}
                            </p>

                            {/* Size Selection (for clothes/shoes) */}
                            {product.size && !isFood && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.size.split(',').map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size.trim())}
                                                className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${selectedSize === size.trim()
                                                    ? 'border-primary-500 bg-primary-50 text-primary-500'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {size.trim()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Selection */}
                            {product.color && !isFood && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.color.split(',').map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color.trim())}
                                                className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${selectedColor === color.trim()
                                                    ? 'border-primary-500 bg-primary-50 text-primary-500'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {color.trim()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Special Instructions (for food) */}
                            {isFood && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Special Instructions (optional)
                                    </label>
                                    <textarea
                                        value={specialInstructions}
                                        onChange={(e) => setSpecialInstructions(e.target.value)}
                                        placeholder="Any special requests? (e.g., no onions, extra spicy)"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            )}

                            {/* Quantity & Add to Cart */}
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="flex items-center border border-gray-200 rounded-xl">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-gray-100 transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="p-3 hover:bg-gray-100 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || cartLoading}
                                    className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cartLoading ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5" />
                                            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Stock Info */}
                            {product.stock > 0 && product.stock < 10 && (
                                <p className="text-orange-500 mb-6">
                                    ⚠️ Only {product.stock} left in stock!
                                </p>
                            )}

                            {/* Features */}
                            <div className="border-t pt-6 space-y-4">
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Truck className="w-5 h-5 text-primary-500" />
                                    <span>Fast delivery across Nepal</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <Shield className="w-5 h-5 text-primary-500" />
                                    <span>100% authentic products</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-600">
                                    <RotateCcw className="w-5 h-5 text-primary-500" />
                                    <span>Easy returns within 7 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;
