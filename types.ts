export enum CapColor {
  BLACK = '#1a1a1a',
  NAVY = '#1e3a8a',
  WHITE = '#f8fafc',
  RED = '#991b1b',
  CYAN = '#0891b2',
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export type AppState = 'HOME' | 'DESIGN' | 'PREVIEW';

export interface DesignSession {
  selectedColor: CapColor;
  prompt: string;
  generatedImage: GeneratedImage | null;
  isLoading: boolean;
  error: string | null;
}