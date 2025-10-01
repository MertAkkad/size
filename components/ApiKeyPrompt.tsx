import React from 'react';
import { KeyIcon } from './icons/KeyIcon';

const ApiKeyPrompt: React.FC = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in p-4">
        <div className="w-full text-center flex flex-col items-center animate-fade-in p-4 bg-slate-900/50 rounded-lg border border-yellow-500/30">
            <div className="w-16 h-16 flex items-center justify-center bg-yellow-500/20 rounded-full mb-6">
                <KeyIcon className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Configuration Needed</h2>
            <p className="text-slate-400 mb-4 max-w-xs">
                This demo requires a Google Gemini API key to function.
            </p>
            <div className="text-left bg-slate-800 p-4 rounded-lg w-full max-w-xs">
                <p className="text-sm text-slate-300">Please set the <code className="bg-slate-900 text-yellow-300 px-1 py-0.5 rounded">API_KEY</code> environment variable in your deployment settings to run this application.</p>
            </div>
        </div>
    </div>
  );
};

export default ApiKeyPrompt;
