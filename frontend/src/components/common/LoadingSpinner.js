import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', skeleton = false, style = {} }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (skeleton) {
    return (
      <div
        className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg ${sizeClasses[size]} ${className}`}
        style={{ minHeight: 32, minWidth: 32, ...style }}
      >
        <div className="w-full h-full bg-gray-200 rounded-lg" style={{ opacity: 0.5 }} />
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center ${className}`} style={style}>
      <div className={`spinner ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner; 