import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Generating Summary...</h2>
        <p className="mt-2 text-gray-500">Please wait while we analyze the patient notes.</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 