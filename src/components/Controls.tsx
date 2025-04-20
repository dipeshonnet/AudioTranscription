import React, { useEffect } from 'react';
import { Play, Pause, StopCircle, Copy, Sun, Moon } from 'lucide-react';
import { useStore } from '../store';
import type { AudioSource } from '../types';

export const Controls: React.FC = () => {
  const {
    availableSources,
    selectedSourceId,
    isTranscribing,
    isPaused,
    isDarkMode,
    setAvailableSources,
    setSelectedSourceId,
    setIsTranscribing,
    setIsPaused,
    setIsDarkMode,
  } = useStore();

  useEffect(() => {
    const getAudioSources = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioSources = devices
          .filter(device => device.kind === 'audioinput' || device.kind === 'audiooutput')
          .map(device => ({
            id: device.deviceId,
            label: device.label || `Audio Source ${device.deviceId.slice(0, 4)}`,
            kind: device.kind as 'audioinput' | 'audiooutput',
          }));
        setAvailableSources(audioSources);
        if (audioSources.length > 0 && !selectedSourceId) {
          setSelectedSourceId(audioSources[0].id);
        }
      } catch (error) {
        console.error('Error accessing audio devices:', error);
      }
    };

    getAudioSources();
  }, []);

  const handleTranscriptionToggle = () => {
    if (!isTranscribing) {
      setIsTranscribing(true);
      setIsPaused(false);
    } else if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    setIsTranscribing(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <label htmlFor="audioSource" className="text-sm text-gray-600 dark:text-gray-400">
          Audio Source
        </label>
        <select
          id="audioSource"
          value={selectedSourceId || ''}
          onChange={(e) => setSelectedSourceId(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
        >
          {availableSources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.label} ({source.kind === 'audioinput' ? 'Input' : 'Output'})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleTranscriptionToggle}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          {!isTranscribing ? (
            <>
              <Play size={20} /> Start
            </>
          ) : isPaused ? (
            <>
              <Play size={20} /> Resume
            </>
          ) : (
            <>
              <Pause size={20} /> Pause
            </>
          )}
        </button>
        <button
          onClick={handleStop}
          className="flex items-center justify-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <StopCircle size={20} />
        </button>
      </div>

      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};