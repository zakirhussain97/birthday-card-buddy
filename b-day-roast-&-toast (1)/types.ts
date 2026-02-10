
export interface BirthdayData {
  name: string;
  age: string;
  hobby: string;
}

export interface GeneratedMessage {
  text: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
  metadata?: BirthdayData; // Store metadata of the current generation for saving
}

export interface SavedRoast extends BirthdayData {
  id: string;
  text: string;
  timestamp: number;
}
