import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Search, Package, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi, categoriesApi } from '../../services/api';

// Category-specific field configs (synced with backend)
const CATEGORY_FIELDS = {
    shoes: {
        brands: ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Reebok', 'Converse', 'Vans'],
        sizes: ['6', '7', '8', '9', '10', '11', '12', '13'],
        showColor: true,
        showMaterial: true,
        materials: ['Leather', 'Canvas', 'Mesh', 'Suede', 'Synthetic'],
        showGender: true,
    },
    clothes: {
        brands: ['Zara', 'H&M', 'Uniqlo', 'Gucci', 'Prada', 'Levi\'s', 'Ralph Lauren'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        showColor: true,
        showMaterial: true,
        materials: ['Cotton', 'Polyester', 'Silk', 'Wool', 'Denim', 'Linen'],
        showGender: true,
        occasions: ['Casual', 'Formal', 'Party', 'Gym', 'Beach', 'Office'],
    },
    fashion: {
        brands: ['Zara', 'H&M', 'Uniqlo', 'Gucci', 'Prada', 'Levi\'s', 'Ralph Lauren'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        showColor: true,
        showMaterial: true,
        materials: ['Cotton', 'Polyester', 'Silk', 'Wool', 'Denim', 'Linen'],
        showGender: true,
        occasions: ['Casual', 'Formal', 'Party', 'Gym', 'Beach', 'Office'],
    },
    food: {
        showWeight: true,
        dietTags: ['Veg', 'Non-Veg', 'Vegan', 'Gluten-Free', 'Organic', 'Sugar-Free'],
        cuisineTags: ['Italian', 'Chinese', 'Indian', 'Fast Food', 'Thai', 'Mexican', 'Japanese', 'Nepali'],
    },
};

function getCategoryConfig(categories, categoryId) {
    if (!categoryId) return null;
    const cat = categories.find(c => c.id?.toString() === categoryId?.toString());
    if (!cat) return null;
    const slug = cat.slug?.toLowerCase() || cat.name?.toLowerCase();
    return CATEGORY_FIELDS[slug] || null;
}

function StockBadge({ stock }) {
    if (stock === 0) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Out of Stock</span>;
    if (stock < 10) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700"><AlertTriangle className="w-3 h-3 mr-1" />Low: {stock}</span>;
    if (stock < 20) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">{stock} left</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">{stock} in stock</span>;
}

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const initialFormData = {
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        stock: '',
        categoryId: '',
        size: '',
        color: '',
        brand: '',
        gender: '',
        material: '',
        weight: '',
        occasion: '',
        tags: [],
        images: [],
        isAvailable: true,
        isFeatured: false
    };

    const [formData, setFormData] = useState(initialFormData);

    const fetchData = async () => {
        try {
            // Fetch products and categories independently
            const [productsRes, categoriesRes] = await Promise.allSettled([
                adminApi.getProducts({ page: 0, size: 100 }),
                categoriesApi.getAll()
            ]);
            if (productsRes.status === 'fulfilled') {
                setProducts(productsRes.value.data.data.content || []);
            }
            if (categoriesRes.status === 'fulfilled') {
                setCategories(categoriesRes.value.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const catConfig = getCategoryConfig(categories, formData.categoryId);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
                stock: parseInt(formData.stock),
                categoryId: parseInt(formData.categoryId)
            };

            if (editingProduct) {
                await adminApi.updateProduct(editingProduct.id, data);
                toast.success('Product updated successfully');
            } else {
                await adminApi.createProduct(data);
                toast.success('Product created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price?.toString() || '',
            discountPrice: product.discountPrice?.toString() || '',
            stock: product.stock?.toString() || '',
            categoryId: product.categoryId?.toString() || '',
            size: product.size || '',
            color: product.color || '',
            brand: product.brand || '',
            gender: product.gender || '',
            material: product.material || '',
            weight: product.weight || '',
            occasion: product.occasion || '',
            tags: product.tags || [],
            images: product.images || [],
            isAvailable: product.isAvailable,
            isFeatured: product.isFeatured
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await adminApi.deleteProduct(id);
            toast.success('Product deleted successfully');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData(initialFormData);
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || p.categoryId?.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadToast = toast.loading('Uploading images...');
        try {
            const validFiles = files.filter(file => file.type.startsWith('image/'));
            if (validFiles.length !== files.length) {
                toast.error('Some files were skipped because they are not images');
            }

            const res = await adminApi.uploadImages(validFiles);
            const uploadedUrls = res.data.data;

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
            const BASE_URL = API_URL.replace('/api', '');

            const fullUrls = uploadedUrls.map(url =>
                url.startsWith('http') ? url : `${BASE_URL}${url}`
            );

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...fullUrls]
            }));

            toast.success('Images uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload images');
        } finally {
            toast.dismiss(uploadToast);
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const toggleTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const toggleSize = (size) => {
        const currentSizes = formData.size ? formData.size.split(',').map(s => s.trim()).filter(Boolean) : [];
        const newSizes = currentSizes.includes(size)
            ? currentSizes.filter(s => s !== size)
            : [...currentSizes, size];
        setFormData(prev => ({ ...prev, size: newSizes.join(', ') }));
    };

    const selectedSizes = formData.size ? formData.size.split(',').map(s => s.trim()).filter(Boolean) : [];

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500">{products.length} products total</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="input pl-12"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="input w-full sm:w-48"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={product.images?.[0] || 'https://via.placeholder.com/50'}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    {product.isFeatured && (
                                                        <span className="text-xs text-primary-500">⭐ Featured</span>
                                                    )}
                                                    {product.brand && (
                                                        <span className="text-xs text-gray-400">{product.brand}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{product.categoryName}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium">Rs. {product.price?.toLocaleString()}</p>
                                            {product.discountPrice && (
                                                <p className="text-sm text-green-600">Rs. {product.discountPrice?.toLocaleString()}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StockBadge stock={product.stock} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${product.isAvailable ? 'badge-success' : 'badge-error'}`}>
                                            {product.isAvailable ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No products found</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingProduct ? 'Edit Product' : 'Add Product'}
                                </h2>
                                {catConfig && (
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Category-specific fields will appear below
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* === SECTION 1: Basic Info === */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Basic Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="input"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                        <select
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, brand: '', gender: '', material: '', weight: '', occasion: '', tags: [], size: '' })}
                                            className="input"
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="input"
                                            required
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="input"
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                                        <input
                                            type="number"
                                            value={formData.discountPrice}
                                            onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                                            className="input"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* === SECTION 2: Images === */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">📷 Images</h3>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary-50 file:text-primary-700
                                            hover:file:bg-primary-100"
                                    />

                                    {formData.images.length > 0 && (
                                        <div className="grid grid-cols-4 gap-4 mt-4">
                                            {formData.images.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={img}
                                                        alt={`Product ${index + 1}`}
                                                        className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                                                            opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* === SECTION 3: Category-Specific Fields === */}
                            {catConfig && (
                                <div className="border-t pt-6">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                        🏷️ Category Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">

                                        {/* Brand Dropdown */}
                                        {catConfig.brands && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                                <select
                                                    value={formData.brand}
                                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                    className="input"
                                                >
                                                    <option value="">Select brand</option>
                                                    {catConfig.brands.map(b => (
                                                        <option key={b} value={b.toLowerCase()}>{b}</option>
                                                    ))}
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Gender Radio */}
                                        {catConfig.showGender && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                                <div className="flex gap-3">
                                                    {['Men', 'Women', 'Unisex'].map(g => (
                                                        <label key={g} className={`flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm
                                                            ${formData.gender === g.toLowerCase() ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-200 hover:border-gray-300'}`}>
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value={g.toLowerCase()}
                                                                checked={formData.gender === g.toLowerCase()}
                                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                                className="sr-only"
                                                            />
                                                            {g}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Size Pills */}
                                        {catConfig.sizes && (
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {catConfig.sizes.map(s => (
                                                        <button
                                                            key={s}
                                                            type="button"
                                                            onClick={() => toggleSize(s)}
                                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all
                                                                ${selectedSizes.includes(s)
                                                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Color */}
                                        {catConfig.showColor && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
                                                <input
                                                    type="text"
                                                    value={formData.color}
                                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                    className="input"
                                                    placeholder="Red, Blue, Black"
                                                />
                                            </div>
                                        )}

                                        {/* Material Dropdown */}
                                        {catConfig.showMaterial && catConfig.materials && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                                <select
                                                    value={formData.material}
                                                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                                    className="input"
                                                >
                                                    <option value="">Select material</option>
                                                    {catConfig.materials.map(m => (
                                                        <option key={m} value={m.toLowerCase()}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* Occasion Checkboxes (Clothes) */}
                                        {catConfig.occasions && (
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {catConfig.occasions.map(o => (
                                                        <label key={o} className={`flex items-center px-3 py-1.5 rounded-full border cursor-pointer text-sm transition-all
                                                            ${formData.occasion === o.toLowerCase() ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-200 hover:border-gray-300'}`}>
                                                            <input
                                                                type="radio"
                                                                name="occasion"
                                                                value={o.toLowerCase()}
                                                                checked={formData.occasion === o.toLowerCase()}
                                                                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                                                                className="sr-only"
                                                            />
                                                            {o}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Weight (Food) */}
                                        {catConfig.showWeight && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight / Serving</label>
                                                <input
                                                    type="text"
                                                    value={formData.weight}
                                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                                    className="input"
                                                    placeholder="500g, 1 serving, etc."
                                                />
                                            </div>
                                        )}

                                        {/* Diet Tags (Food) */}
                                        {catConfig.dietTags && (
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {catConfig.dietTags.map(tag => (
                                                        <button
                                                            key={tag}
                                                            type="button"
                                                            onClick={() => toggleTag(tag.toLowerCase())}
                                                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all
                                                                ${formData.tags.includes(tag.toLowerCase())
                                                                    ? 'border-green-500 bg-green-50 text-green-700'
                                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Cuisine Tags (Food) */}
                                        {catConfig.cuisineTags && (
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {catConfig.cuisineTags.map(tag => (
                                                        <button
                                                            key={tag}
                                                            type="button"
                                                            onClick={() => toggleTag(tag.toLowerCase())}
                                                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all
                                                                ${formData.tags.includes(tag.toLowerCase())
                                                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* === SECTION 4: Visibility === */}
                            <div className="border-t pt-4">
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isAvailable}
                                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">Available for sale</span>
                                    </label>

                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFeatured}
                                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">Featured product</span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end space-x-4 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-outline"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingProduct ? 'Update' : 'Create'} Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;
