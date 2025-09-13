export interface Attachment {
  file: File;
  previewUrl: string;
  type: "image" | "file";
  name: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  conversationId?: string;
  sender: {
    id?: string;
    role: string;
    clinicianProfile?: any;
    patientProfile?: any;
  };
  attachments?: any[];
}

export interface Conversation {
  id: string;
  patient?: any;
  clinician?: any;
  lastMessage?: string;
  lastMessageAt?: string;
  star?: boolean;
}

export interface UserInfo {
  id: string;
  role: string;
}