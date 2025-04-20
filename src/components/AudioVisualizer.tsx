import React, { useEffect, useRef } from 'react';
import { useStore } from '../store';

export const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number>();
  
  const isDarkMode = useStore((state) => state.isDarkMode);
  const selectedSourceId = useStore((state) => state.selectedSourceId);
  const isTranscribing = useStore((state) => state.isTranscribing);
  const isPaused = useStore((state) => state.isPaused);
  const setAudioLevel = useStore((state) => state.setAudioLevel);

  useEffect(() => {
    const setupAudioContext = async () => {
      if (!selectedSourceId || !isTranscribing || isPaused) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        setAudioLevel(0);
        return;
      }

      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: selectedSourceId,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        });

        streamRef.current = stream;
        
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }
        
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        sourceRef.current.connect(analyserRef.current);
      } catch (error) {
        console.error('Error accessing audio:', error);
      }
    };

    setupAudioContext();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedSourceId, isTranscribing, isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const barWidth = 3;
    const barGap = 2;
    const numBars = Math.floor(canvas.width / (barWidth + barGap));
    const levels = new Array(numBars).fill(0);
    const dataArray = new Uint8Array(analyserRef.current?.frequencyBinCount || 0);

    const draw = () => {
      if (!analyserRef.current || !isTranscribing || isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        levels.fill(0);
        setAudioLevel(0);
      } else {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        const normalizedLevel = Math.min(Math.max(average / 255, 0), 1);
        
        setAudioLevel(normalizedLevel);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        levels.shift();
        levels.push(normalizedLevel);

        levels.forEach((level, i) => {
          if (!Number.isFinite(level)) return;
          
          const x = i * (barWidth + barGap);
          const height = Math.max(1, canvas.height * level);
          const y = (canvas.height - height) / 2;

          if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(height)) return;

          const gradient = ctx.createLinearGradient(x, y, x, y + height);
          gradient.addColorStop(0, '#60A5FA');
          gradient.addColorStop(1, '#3B82F6');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth, height);
        });
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isTranscribing, isPaused, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={60}
      className="w-full h-[60px] rounded-lg bg-gray-100 dark:bg-gray-800"
    />
  );
};