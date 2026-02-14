import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function CategoryCard({ category }) {
    const icons = {
        shoes: '👟',
        clothes: '👕',
        food: '🍽️'
    };

    const gradients = {
        shoes: 'from-orange-400 to-red-500',
        clothes: 'from-purple-400 to-pink-500',
        food: 'from-green-400 to-teal-500'
    };

    return (
        <Link
            to={`/products/${category.slug}`}
            className="group relative overflow-hidden rounded-3xl aspect-[4/3] card hover-lift"
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradients[category.slug] || 'from-gray-400 to-gray-600'} opacity-90`}></div>

            {/* Background Image */}
            {category.image && (
                <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
                />
            )}

            {/* Content */}
            <div className="relative h-full p-8 flex flex-col justify-between text-white">
                <div>
                    <span className="text-5xl mb-4 block">{icons[category.slug] || '📦'}</span>
                    <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/80 text-lg">
                        {category.description || `Explore our ${category.name.toLowerCase()} collection`}
                    </p>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                    <span className="font-semibold">Shop Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
            </div>

            {/* Product Count Badge */}
            {category.productCount > 0 && (
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white font-medium">{category.productCount} items</span>
                </div>
            )}
        </Link>
    );
}

export default CategoryCard;
