export type Language = 'tr' | 'en';

export interface TranslationDictionary {
  [key: string]: string;
}

export interface Translations {
  [language: string]: TranslationDictionary;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  responseTime?: string;
}

export interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  formatMessage: (content: string) => React.ReactNode;
}

export interface ChatInterfaceProps {
}

export interface LangflowResult {
  response: string;
  sessionId: string;
}

export interface LangflowResponse {
  session_id?: string;
  outputs?: Array<{
    outputs?: Array<{
      results?: {
        message?: {
          text: string;
        };
      };
      artifacts?: {
        message: string;
      };
      outputs?: {
        message?: {
          message: string;
        };
      };
      messages?: Array<{
        message: string;
      }>;
    }>;
  }>;
}