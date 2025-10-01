import React, { useState, useCallback } from 'react';
import { AppState, ShoeSizeResult } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import VideoCapture from './components/VideoCapture';
import LoadingSpinner from './components/LoadingSpinner';
import ResultsDisplay from './components/ResultsDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import { analyzeFootImages } from './services/geminiService';
import { ShoeIcon } from './components/icons/ShoeIcon';
import { extractFramesFromVideo } from './utils/videoUtils';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Welcome);
  const [analysisResult, setAnalysisResult] = useState<ShoeSizeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const apiKey = process.env.API_KEY;

  const handleStart = () => {
    setAppState(AppState.Capture);
  };
  
  const handleReset = () => {
    setAnalysisResult(null);
    setErrorMessage('');
    setAppState(AppState.Welcome);
  };

  const handleAnalyze = useCallback(async (videoBlob: Blob) => {
    if (!apiKey) {
        setErrorMessage("API Key is not configured.");
        setAppState(AppState.Error);
        return;
    }

    setAppState(AppState.Loading);
    try {
      // Extract 3 frames from the video for analysis
      const frames = await extractFramesFromVideo(videoBlob, 3);
      if (frames.length === 0) {
        throw new Error("Could not extract frames from the video. Please try recording again.");
      }

      const result = await analyzeFootImages(frames, apiKey);
      setAnalysisResult(result);
      setAppState(AppState.Results);
    } catch (error) {
      console.error("Analysis failed:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred during analysis.";
      setErrorMessage(message);
      setAppState(AppState.Error);
    }
  }, [apiKey]);

  const renderContent = () => {
    if (!apiKey) {
        return <ApiKeyPrompt />;
    }
    switch (appState) {
      case AppState.Welcome:
        return <WelcomeScreen onStart={handleStart} />;
      case AppState.Capture:
        return <VideoCapture onAnalyze={handleAnalyze} />;
      case AppState.Loading:
        return <LoadingSpinner />;
      case AppState.Results:
        return analysisResult && <ResultsDisplay result={analysisResult} onReset={handleReset} />;
      case AppState.Error:
        return <ErrorDisplay message={errorMessage} onRetry={handleReset} />;
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl shadow-2xl flex flex-col min-h-[80vh]">
        <header className="p-4 border-b border-slate-700 flex items-center justify-center space-x-3">
          <ShoeIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">AI Foot Scanner</h1>
        </header>
        <main className="flex-grow p-6 flex flex-col items-center justify-center">
          {renderContent()}
        </main>
         <footer className="text-center p-4 text-xs text-slate-500 border-t border-slate-700">
          Powered by Gemini AI. All measurements are estimates.
        </footer>
      </div>
    </div>
  );
};

export default App;
