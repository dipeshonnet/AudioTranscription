import { create } from 'zustand';
import { AudioSource, TranscriptionState } from './types';

export const useStore = create<TranscriptionState>((set) => ({
  availableSources: [],
  selectedSourceId: null,
  isTranscribing: false,
  isPaused: false,
  transcribedText: '',
  audioLevel: 0,
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  setAvailableSources: (sources: AudioSource[]) => set({ availableSources: sources }),
  setSelectedSourceId: (id: string | null) => set({ selectedSourceId: id }),
  setIsTranscribing: (isTranscribing: boolean) => set({ isTranscribing }),
  setIsPaused: (isPaused: boolean) => set({ isPaused }),
  setTranscribedText: (text: string) => set({ transcribedText: text }),
  setAudioLevel: (level: number) => set({ audioLevel: level }),
  setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
}));