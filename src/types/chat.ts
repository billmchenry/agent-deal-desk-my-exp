export interface ChatMessageAction {
  label: string;
  icon?: 'focus' | 'pin';
  onClick?: () => void;
}

export interface ChatMessageData {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  widget?: {
    type: 'forecast' | 'velocity' | 'pipeline';
    id: string;
    title: string;
  };
  action?: ChatMessageAction;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessageData[];
  createdAt: Date;
  updatedAt: Date;
  preview: string; // First 100 chars of first AI response
}
