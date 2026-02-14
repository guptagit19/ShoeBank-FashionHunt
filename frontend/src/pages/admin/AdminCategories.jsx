import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../services/api';

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        displayOrder: '',
        isActive: true
    });

    const fetchCategories = async () => {
        try {
            const response = await adminApi.getCategories();
            setCategories(response.data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                ...formData,
                displayOrder: parseInt(formData.displayOrder) || 0
            };

            if (editingCategory) {
                await adminApi.updateCategory(editingCategory.id, data);
                toast.success('Category updated successfully');
            } else {
                await adminApi.createCategory(data);
                toast.success('Category created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save category');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            displayOrder: category.displayOrder?.toString() || '',
            isActive: category.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await adminApi.deleteCategory(id);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const resetForm = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            slug: '',
            description: '',
            displayOrder: '',
            isActive: true
        });
    };

    const generateSlug = (name) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500">{categories.length} categories total</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Category</span>
                </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                                    {category.slug === 'shoes' && '👟'}
                                    {category.slug === 'clothes' && '👕'}
                                    {category.slug === 'food' && '🍽️'}
                                    {!['shoes', 'clothes', 'food'].includes(category.slug) && '📦'}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                    <p className="text-sm text-gray-500">/{category.slug}</p>
                                </div>
                            </div>

                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {category.description || 'No description'}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Order: {category.displayOrder}</span>
                            <span className={`badge ${category.isActive ? 'badge-success' : 'badge-error'}`}>
                                {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <p className="text-gray-500">No categories found</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingCategory ? 'Edit Category' : 'Add Category'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setFormData({
                                            ...formData,
                                            name,
                                            slug: editingCategory ? formData.slug : generateSlug(name)
                                        });
                                    }}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                                <input
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                                    className="input"
                                    min="0"
                                />
                            </div>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                            </label>

                            <div className="flex justify-end space-x-4 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-outline"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingCategory ? 'Update' : 'Create'} Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCategories;
