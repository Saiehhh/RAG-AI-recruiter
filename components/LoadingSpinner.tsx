import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 bg-[#A67B5B] rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-[#A67B5B] rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-[#A67B5B] rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;