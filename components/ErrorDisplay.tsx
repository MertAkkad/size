
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in">
      <div className="w-16 h-16 flex items-center justify-center bg-red-500/20 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-100 mb-2">Analysis Failed</h2>
      <p className="text-slate-400 mb-8 max-w-xs">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="w-full max-w-xs bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg shadow-cyan-500/20"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;
