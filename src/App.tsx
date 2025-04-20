import React from 'react';
import { AudioVisualizer } from './components/AudioVisualizer';
import { Controls } from './components/Controls';
import { TranscriptionOutput } from './components/TranscriptionOutput';
import { useStore } from './store';

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Audio Transcription
          </h1>
          
          <Controls />
          
          <div className="w-full max-w-2xl">
            <AudioVisualizer />
          </div>
          
          <TranscriptionOutput />
        </div>
      </div>
    </div>
  );
}

export default App;