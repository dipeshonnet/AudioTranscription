import React from 'react';
import { Copy } from 'lucide-react';
import { useStore } from '../store';

export const TranscriptionOutput: React.FC = () => {
  const transcribedText = useStore((state) => state.transcribedText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcribedText);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Transcription</h2>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Copy size={20} />
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {transcribedText || 'Transcription will appear here...'}
        </p>
      </div>
    </div>
  );
};