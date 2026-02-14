import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import useCartStore from '../store/cartStore';

function CartPage() {
    const navigate = useNavigate();
    const { cart, loading, fetchCart, updateQuantity, removeItem } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(itemId);
            return;
        }
        await updateQuantity(itemId, newQuantity);
        toast.success('Cart updated');
    };

    const handleRemoveItem = async (itemId) => {
        await removeItem(itemId);
        toast.success('Item removed from cart');
    };

    if (loading && !cart) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    const items = cart?.items || [];
    const isEmpty = items.length === 0;

    return (
        <div className="pt-16 md:pt-24 min-h-screen bg-gray-50 page-bottom">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <p className="text-gray-500 text-sm md:text-base mt-0.5 md:mt-1">
                            {isEmpty ? 'Your cart is empty' : `${cart?.totalItems} items in your cart`}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-1 md:space-x-2 text-gray-600 hover:text-gray-900 touch-target text-sm"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden md:inline">Continue Shopping</span>
                    </button>
                </div>

                {isEmpty ? (
                    <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet</p>
                        <Link to="/" className="btn-primary inline-flex items-center space-x-2">
                            <span>Start Shopping</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                                            <img
                                                src={item.productImage || 'https://via.placeholder.com/100?text=No+Image'}
                                                alt={item.productName}
                                                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl"
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                to={`/product/${item.productId}`}
                                                className="text-lg font-semibold text-gray-900 hover:text-primary-500 line-clamp-2"
                                            >
                                                {item.productName}
                                            </Link>

                                            {/* Variants */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {item.selectedSize && (
                                                    <span className="badge badge-primary">Size: {item.selectedSize}</span>
                                                )}
                                                {item.selectedColor && (
                                                    <span className="badge badge-primary">Color: {item.selectedColor}</span>
                                                )}
                                            </div>

                                            {/* Special Instructions */}
                                            {item.specialInstructions && (
                                                <p className="text-sm text-gray-500 mt-2 line-clamp-1">
                                                    Note: {item.specialInstructions}
                                                </p>
                                            )}

                                            {/* Price */}
                                            <div className="flex items-baseline gap-2 mt-2">
                                                <span className="text-lg font-bold text-primary-500">
                                                    Rs. {(item.discountPrice || item.price)?.toLocaleString()}
                                                </span>
                                                {item.discountPrice && item.discountPrice < item.price && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        Rs. {item.price?.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quantity & Remove */}
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-100 transition-colors touch-target"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.availableStock}
                                                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 touch-target"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <span className="font-semibold text-gray-900">
                                                Rs. {item.subtotal?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal ({cart?.totalItems} items)</span>
                                        <span className="font-medium">Rs. {cart?.subtotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Delivery</span>
                                        <span className="font-medium text-secondary-500">
                                            {cart?.subtotal >= 1000 ? 'FREE' : 'Rs. 100'}
                                        </span>
                                    </div>

                                    {cart?.subtotal < 1000 && (
                                        <p className="text-sm text-primary-500 bg-primary-50 p-3 rounded-lg">
                                            Add Rs. {(1000 - cart?.subtotal).toLocaleString()} more for FREE delivery!
                                        </p>
                                    )}

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span className="text-primary-500">
                                                Rs. {((cart?.subtotal || 0) + (cart?.subtotal >= 1000 ? 0 : 100)).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="btn-primary w-full mt-6 flex items-center justify-center space-x-2"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>

                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-500">
                                        🔒 Secure checkout with eSewa
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartPage;
