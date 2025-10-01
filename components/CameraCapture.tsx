
import React, { useState, useRef } from 'react';
import { CameraIcon } from './icons/CameraIcon';

interface CameraCaptureProps {
  onAnalyze: (imageDataUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onAnalyze }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("Image size is too large. Please use an image under 4MB.");
        setImagePreview(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read the image file.");
        setImagePreview(null);
      }
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRetake = () => {
    setImagePreview(null);
    setError(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center h-full animate-fade-in">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {imagePreview ? (
        <div className="w-full text-center">
          <img src={imagePreview} alt="Foot preview" className="rounded-lg w-full max-w-xs mx-auto mb-6 border-4 border-slate-600" />
          <div className="flex space-x-4 justify-center">
            <button
                onClick={handleRetake}
                className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105"
            >
                Retake
            </button>
            <button
              onClick={() => onAnalyze(imagePreview)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
              Analyze Foot
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
            <div className="w-full max-w-xs h-64 border-4 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center mb-6 bg-slate-900/50">
                <CameraIcon className="w-16 h-16 text-slate-500 mb-4" />
                <p className="text-slate-400">Tap to capture photo</p>
            </div>
          <button
            onClick={triggerFileInput}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            Open Camera
          </button>
          {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
