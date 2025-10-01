import React from 'react';
import { VideoIcon } from './icons/VideoIcon';
import { RulerIcon } from './icons/RulerIcon';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-100 mb-4">Get Your 3D Fit</h2>
      <p className="text-slate-400 mb-8 max-w-xs">
        Use your phone's camera to record a short video of your foot for an accurate shoe size.
      </p>

      <div className="space-y-6 text-left w-full max-w-xs bg-slate-900/50 p-6 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-center text-cyan-300 mb-4">How it works:</h3>
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-slate-700 rounded-full p-2">
                <RulerIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
                <h4 className="font-semibold text-slate-200">1. Add a Reference</h4>
                <p className="text-slate-400 text-sm">Place a standard credit card next to your bare foot on a flat surface.</p>
            </div>
        </div>
        <div className="flex items-start space-x-4">
             <div className="flex-shrink-0 bg-slate-700 rounded-full p-2">
                <VideoIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
                <h4 className="font-semibold text-slate-200">2. Record a Video</h4>
                <p className="text-slate-400 text-sm">Record a 5-second video, slowly moving the camera around your foot for a 3D view.</p>
            </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="mt-10 w-full max-w-xs bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg shadow-cyan-500/20"
      >
        Start Scan
      </button>
    </div>
  );
};

export default WelcomeScreen;
