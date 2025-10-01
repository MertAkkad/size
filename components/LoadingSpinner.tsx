
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-semibold text-slate-200">Analyzing...</h2>
      <p className="text-slate-400 mt-2">Our AI is measuring your foot. <br/> This may take a moment.</p>
    </div>
  );
};

export default LoadingSpinner;
