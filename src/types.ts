export type AudioSource = {
  id: string;
  label: string;
  kind: 'audiooutput' | 'audioinput';
};

export interface TranscriptionState {
  availableSources: AudioSource[];
  selectedSourceId: string | null;
  isTranscribing: boolean;
  isPaused: boolean;
  transcribedText: string;
  audioLevel: number;
  isDarkMode: boolean;
  setAvailableSources: (sources: AudioSource[]) => void;
  setSelectedSourceId: (id: string | null) => void;
  setIsTranscribing: (isTranscribing: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setTranscribedText: (text: string) => void;
  setAudioLevel: (level: number) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
}