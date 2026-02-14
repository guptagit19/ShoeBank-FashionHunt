function LoadingSpinner({ size = 'md' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`}></div>
        </div>
    );
}

export default LoadingSpinner;
