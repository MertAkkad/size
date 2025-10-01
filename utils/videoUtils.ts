/**
 * Extracts a specified number of frames from a video blob.
 * @param videoBlob The video file as a Blob.
 * @param frameCount The number of frames to extract.
 * @returns A promise that resolves to an array of base64 encoded image strings (without the data URL prefix).
 */
export const extractFramesFromVideo = (videoBlob: Blob, frameCount: number): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames: string[] = [];

    video.src = URL.createObjectURL(videoBlob);
    video.muted = true;

    video.onloadeddata = async () => {
      if (!ctx) {
        return reject(new Error("Could not create canvas context."));
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const duration = video.duration;
      if (duration <= 0) {
        return reject(new Error("Video has no duration."));
      }

      const interval = duration / (frameCount > 1 ? frameCount - 1 : 1);

      const captureFrame = (time: number): Promise<void> => {
        return new Promise(resolveCapture => {
          video.currentTime = time;
          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // 90% quality
            // Return only the base64 part
            frames.push(dataUrl.split(',')[1]);
            resolveCapture();
          };
        });
      };

      try {
        for (let i = 0; i < frameCount; i++) {
          const time = (frameCount === 1) ? 0 : i * interval;
          // Ensure we don't seek beyond the video duration
          await captureFrame(Math.min(time, duration));
        }
        URL.revokeObjectURL(video.src); // Clean up
        resolve(frames);
      } catch (error) {
         URL.revokeObjectURL(video.src); // Clean up
        reject(error);
      }
    };

    video.onerror = () => {
      reject(new Error("Failed to load video data."));
    };

    video.play().catch(e => {
        // Autoplay can be blocked, but loading should still work.
        // We just need the data to be loaded to seek.
    });
  });
};
