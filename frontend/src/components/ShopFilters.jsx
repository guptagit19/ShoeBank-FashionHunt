import { X } from 'lucide-react';

function ShopFilters({ isOpen, onClose, filters, activeFilters, onFilterChange, theme }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-end" style={{ zIndex: 9999 }}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Sidebar — full height, z-[100] to cover BottomNav */}
            <div className={`relative w-full max-w-xs h-full transform transition-transform duration-300 ease-out ${theme.id === 'shoes' ? 'bg-street-900 border-l border-street-700' : 'bg-white shadow-xl'
                } ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                <div className="h-full flex flex-col">
                    <div className={`px-6 py-4 border-b flex items-center justify-between ${theme.id === 'shoes' ? 'border-street-700' : 'border-gray-100'
                        }`}>
                        <h2 className={`text-xl font-bold ${theme.id === 'shoes' ? 'text-white' : 'text-gray-900'}`}>
                            Filters
                        </h2>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full transition-colors ${theme.id === 'shoes'
                                ? 'hover:bg-street-800 text-gray-400 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-500 hover:text-black'
                                }`}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {filters.map((section) => (
                            <div key={section.id}>
                                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme.id === 'shoes' ? 'text-street-500' : 'text-gray-900'
                                    }`}>
                                    {section.title}
                                </h3>

                                {/* Range Input */}
                                {section.type === 'range' && (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={activeFilters[section.id]?.min || ''}
                                            onChange={(e) => onFilterChange(section.id, { ...activeFilters[section.id], min: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-lg border ${theme.id === 'shoes' ? 'bg-street-800 border-street-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                                        />
                                        <span className={theme.id === 'shoes' ? 'text-gray-400' : 'text-gray-500'}>-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={activeFilters[section.id]?.max || ''}
                                            onChange={(e) => onFilterChange(section.id, { ...activeFilters[section.id], max: e.target.value })}
                                            className={`w-full px-3 py-2 rounded-lg border ${theme.id === 'shoes' ? 'bg-street-800 border-street-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                                        />
                                    </div>
                                )}

                                {/* Checkbox Input */}
                                {section.type === 'checkbox' && (
                                    <div className="space-y-2">
                                        {section.options.map((option) => (
                                            <div key={option.value} className="flex items-center space-x-3 cursor-pointer group"
                                                onClick={() => {
                                                    const current = activeFilters[section.id] || [];
                                                    const updated = current.includes(option.value)
                                                        ? current.filter(v => v !== option.value)
                                                        : [...current, option.value];
                                                    onFilterChange(section.id, updated);
                                                }}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${(activeFilters[section.id] || []).includes(option.value)
                                                    ? (theme.id === 'shoes' ? 'bg-street-accent border-street-accent' : 'bg-black border-black')
                                                    : (theme.id === 'shoes' ? 'border-street-600 bg-street-800' : 'border-gray-300 bg-white')
                                                    }`}>
                                                    {(activeFilters[section.id] || []).includes(option.value) && (
                                                        <svg className={`w-3 h-3 ${theme.id === 'shoes' ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className={theme.id === 'shoes' ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-black'}>
                                                    {option.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Pills Input */}
                                {section.type === 'pills' && (
                                    <div className="flex flex-wrap gap-2">
                                        {section.options.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    const current = activeFilters[section.id] || [];
                                                    const updated = current.includes(option.value)
                                                        ? current.filter(v => v !== option.value)
                                                        : [...current, option.value];
                                                    onFilterChange(section.id, updated);
                                                }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${(activeFilters[section.id] || []).includes(option.value)
                                                    ? (theme.id === 'shoes' ? 'bg-street-accent text-black' : 'bg-black text-white')
                                                    : (theme.id === 'shoes'
                                                        ? 'bg-street-800 text-gray-300 hover:bg-street-700'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={`p-6 pb-24 md:pb-6 border-t ${theme.id === 'shoes' ? 'border-street-700' : 'border-gray-100'}`}>
                        <button
                            onClick={onClose}
                            className={`w-full py-3 rounded-xl font-bold text-center transition-transform hover:scale-[1.02] ${theme.id === 'shoes'
                                ? 'bg-street-accent text-black hover:bg-white'
                                : 'bg-black text-white hover:bg-gray-800'
                                }`}
                        >
                            Show Results
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopFilters;
