
// Theme configurations for different sections
const themes = {
    clothes: {
        id: 'clothes',
        name: 'Fashion Hunt',
        type: 'editorial',
        colors: {
            bg: 'bg-fashion-50',
            text: 'text-fashion-900',
            primary: 'bg-fashion-900',
            accent: 'text-fashion-600',
            border: 'border-fashion-200',
            hover: 'hover:bg-fashion-100',
            button: 'bg-fashion-900 text-fashion-50 hover:bg-fashion-800'
        },
        fonts: {
            heading: 'font-serif',
            body: 'font-sans'
        },
        layout: 'masonry',
        cardStyle: 'minimal'
    },
    shoes: {
        id: 'shoes',
        name: 'ShoeBank',
        type: 'streetwear',
        colors: {
            bg: 'bg-street-900',
            text: 'text-white',
            primary: 'bg-street-accent',
            secondary: 'text-street-accent',
            border: 'border-street-700',
            hover: 'hover:bg-street-800',
            button: 'bg-street-accent text-black hover:bg-white'
        },
        fonts: {
            heading: 'font-display',
            body: 'font-sans'
        },
        layout: 'grid',
        cardStyle: 'bold'
    },
    food: {
        id: 'food',
        name: 'Fresh Eats',
        type: 'organic',
        colors: {
            bg: 'bg-organic-50',
            text: 'text-gray-900',
            primary: 'bg-organic-500',
            accent: 'text-organic-700',
            border: 'border-organic-200',
            hover: 'hover:bg-organic-100',
            button: 'bg-organic-500 text-white hover:bg-organic-600'
        },
        fonts: {
            heading: 'font-sans',
            body: 'font-sans'
        },
        layout: 'list',
        cardStyle: 'rounded'
    },
    default: {
        id: 'default',
        name: 'ShoeBank & Fashion Hunt',
        type: 'standard',
        colors: {
            bg: 'bg-gray-50',
            text: 'text-gray-900',
            primary: 'bg-primary-500',
            accent: 'text-primary-600',
            border: 'border-gray-200',
            hover: 'hover:bg-gray-100',
            button: 'bg-primary-500 text-white hover:bg-primary-600'
        },
        fonts: {
            heading: 'font-sans',
            body: 'font-sans'
        },
        layout: 'grid',
        cardStyle: 'standard'
    }
};

/**
 * Get theme configuration based on category slug
 * @param {string} category - 'shoes', 'clothes', 'food' or undefined
 * @returns {object} Theme configuration object
 */
export const getTheme = (category) => {
    if (!category) return themes.default;
    const cat = category.toLowerCase();
    if (cat.includes('shoe')) return themes.shoes;
    if (cat.includes('clothe') || cat.includes('cloth') || cat.includes('fashion')) return themes.clothes;
    if (cat.includes('food') || cat.includes('fresh')) return themes.food;
    return themes[cat] || themes.default;
};

/**
 * Get class names for specific components based on theme
 */
export const getComponentStyles = (category, component) => {
    const theme = getTheme(category);

    switch (component) {
        case 'navbar':
            return theme.id === 'shoes'
                ? 'bg-street-900/90 backdrop-blur-md border-b border-street-800 text-white'
                : 'bg-white/90 backdrop-blur-md border-b border-gray-100 text-gray-900';

        case 'card':
            if (theme.id === 'shoes') return 'bg-street-800 border-street-700 text-white overflow-visible hover:-translate-y-2';
            if (theme.id === 'clothes') return 'bg-white border-none shadow-none hover:shadow-lg rounded-none';
            if (theme.id === 'food') return 'bg-white rounded-3xl shadow-sm border-organic-100 hover:shadow-md hover:border-organic-300';
            return 'bg-white rounded-2xl shadow-sm hover:shadow-md';

        case 'button':
            if (theme.id === 'shoes') return 'bg-street-accent text-black font-bold uppercase tracking-wider hover:bg-white hover:scale-105';
            if (theme.id === 'clothes') return 'bg-fashion-900 text-white font-serif tracking-widest hover:bg-fashion-800 rounded-none';
            if (theme.id === 'food') return 'bg-organic-500 text-white rounded-full hover:bg-organic-600 shadow-sm';
            return 'bg-primary-500 text-white hover:bg-primary-600 rounded-lg';

        default:
            return '';
    }
};
