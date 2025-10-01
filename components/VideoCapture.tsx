import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VideoIcon } from './icons/VideoIcon';

interface VideoCaptureProps {
  onAnalyze: (videoBlob: Blob) => void;
}

const RECORDING_DURATION = 5000; // 5 seconds

const VideoCapture: React.FC<VideoCaptureProps> = ({ onAnalyze }) => {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(RECORDING_DURATION / 1000);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: true, // required for MediaRecorder on some browsers
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please check permissions.");
    }
  }, []);

  useEffect(() => {
    startStream();
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [startStream]);
  
  // Fix: Memoize handleStopRecording with useCallback and define it before use in useEffect.
  const handleStopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  useEffect(() => {
    // Fix: Use ReturnType<typeof setTimeout> for timer ID type, as NodeJS.Timeout is not available in the browser.
    let timer: ReturnType<typeof setTimeout>;
    if (isRecording && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    if (countdown === 0 && isRecording) {
        handleStopRecording();
    }
    return () => clearTimeout(timer);
    // Fix: Add handleStopRecording to the dependency array.
  }, [isRecording, countdown, handleStopRecording]);

  const handleStartRecording = () => {
    if (!streamRef.current) {
        setError("Camera stream not available.");
        return;
    }
    setVideoPreview(null);
    recordedChunksRef.current = [];
    setIsRecording(true);
    setCountdown(RECORDING_DURATION / 1000);

    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    recorder.onstop = () => {
      const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoPreview(videoUrl);
      setIsRecording(false);
    };
    recorder.start();
  };

  const handleRetake = () => {
    setVideoPreview(null);
    setError(null);
  };
  
  const handleAnalyzeClick = () => {
    if(videoPreview) {
        // Fetch the blob again to pass to the parent
        fetch(videoPreview)
            .then(res => res.blob())
            .then(blob => onAnalyze(blob));
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center h-full animate-fade-in">
      {videoPreview ? (
        <div className="w-full text-center">
            <video src={videoPreview} controls autoPlay loop className="rounded-lg w-full max-w-xs mx-auto mb-6 border-4 border-slate-600"></video>
            <div className="flex space-x-4 justify-center">
                <button
                    onClick={handleRetake}
                    className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105"
                >
                    Retake
                </button>
                <button
                onClick={handleAnalyzeClick}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg shadow-cyan-500/20"
                >
                Analyze Video
                </button>
            </div>
        </div>
      ) : (
        <div className="text-center w-full">
            <div className="w-full max-w-xs h-64 border-4 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center mb-6 bg-slate-900 overflow-hidden relative">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                {isRecording && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                        <div className="text-white text-5xl font-mono">{countdown}</div>
                        <p className="text-slate-300 mt-2">Recording...</p>
                    </div>
                )}
            </div>
            <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`w-full max-w-xs text-slate-900 font-bold py-3 px-8 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 shadow-lg ${isRecording ? 'bg-red-500 hover:bg-red-400 shadow-red-500/20' : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/20'}`}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
             <p className="text-slate-400 mt-4 text-sm">Slowly move around your foot.</p>
            {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default VideoCapture;