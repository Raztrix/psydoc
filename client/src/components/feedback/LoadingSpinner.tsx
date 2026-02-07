import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'; // Optional size control
    color?: string;            // Optional color override
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 'md',
                                                           color = 'border-blue-600' // Default color class
                                                       }) => {

    // Map size prop to Tailwind classes
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className="flex justify-center items-center w-full h-full p-4">
            <div
                className={`
          ${sizeClasses[size]} 
          ${color} 
          border-t-transparent 
          rounded-full 
          animate-spin
        `}
                role="status"
                aria-label="loading"
            />
        </div>
    );
};

export default LoadingSpinner;