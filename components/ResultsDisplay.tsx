
import React from 'react';
import type { ShoeSizeResult } from '../types';

interface ResultsDisplayProps {
  result: ShoeSizeResult;
  onReset: () => void;
}

const SizeCard: React.FC<{ region: string; size: string }> = ({ region, size }) => (
    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
        <p className="text-sm font-medium text-slate-400">{region}</p>
        <p className="text-2xl font-bold text-cyan-300">{size}</p>
    </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  return (
    <div className="w-full text-center flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-100 mb-2">Your Estimated Size</h2>
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-6">
        <p className="text-slate-300">
            Length: <span className="font-semibold text-white">{result.length_mm.toFixed(1)} mm</span> / <span className="font-semibold text-white">{result.length_in.toFixed(2)} in</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
        <div className="bg-slate-700 rounded-lg p-4 text-center col-span-1">
          <p className="text-sm font-medium text-slate-400">US Men</p>
          <p className="text-3xl font-bold text-white">{result.size_us_men}</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-4 text-center col-span-1">
          <p className="text-sm font-medium text-slate-400">US Women</p>
          <p className="text-3xl font-bold text-white">{result.size_us_women}</p>
        </div>
        <SizeCard region="EU" size={result.size_eu} />
        <SizeCard region="UK" size={result.size_uk} />
      </div>

      <p className="text-xs text-slate-500 mb-6 max-w-xs">
        Disclaimer: This is an AI-powered estimate. For a perfect fit, consider getting measured professionally.
      </p>

      <button
        onClick={onReset}
        className="w-full max-w-xs bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg shadow-cyan-500/20"
      >
        Scan Again
      </button>
    </div>
  );
};

export default ResultsDisplay;
