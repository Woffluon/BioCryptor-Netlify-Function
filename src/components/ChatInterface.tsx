import React, { useState, useEffect, useRef, useCallback, useMemo, KeyboardEvent } from 'react';
import { Send, Dna, X, MessageCircle, Plus } from 'lucide-react';
import { sendMessageToLangflow } from '../lib/langflow-client';
import { useLanguage } from '../hooks/useLanguage';
import MessageList from './MessageList';
import { Message, MessageListProps } from '../types';

const ChatInterface = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const startNewChat = useCallback(() => {
    setSessionId(null);
    setMessages([]);
    // Focus the input field after starting a new chat
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const generateId = useCallback(() => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleCloseChat = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsChatOpen(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleCloseChat();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }, [handleCloseChat]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isLoading) return;
    
    if (!isChatOpen) {
      setIsChatOpen(true);
    }
    
    // If there are no messages, this is the first message of a new session
    const isNewSession = messages.length === 0;
    
    const userMessage: Message = {
      id: generateId(),
      content: trimmedQuery,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setQuery('');
    
    try {
      const result = await sendMessageToLangflow(trimmedQuery, sessionId);
      
      // Only update sessionId if it's a new session or if we don't have one yet
      if (isNewSession || !sessionId) {
        setSessionId(result.sessionId);
      }
      
      const assistantMessage: Message = {
        id: generateId(),
        content: result.response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error communicating with Langflow:', error);
      
      let errorMessage = t('error.api_connection');
      if (error instanceof Error) {
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorMessage = t('error.network');
        }
      }
      
      const errorMessageObj: Message = {
        id: generateId(),
        content: errorMessage,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  }, [query, isChatOpen, sessionId, t, generateId, isLoading]);

  const formatMessage = useCallback((content: string) => {
    const lines = content.split('\n');
    return (
      <div className="whitespace-pre-wrap break-words">
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    );
  }, []);
  
  const messagesWithResponseTimes = useMemo(() => {
    return messages.map((message, index) => {
      if (message.role === 'assistant' && index > 0) {
        const prevMessage = messages[index - 1];
        if (prevMessage.role === 'user') {
          const responseTimeMs = message.timestamp.getTime() - prevMessage.timestamp.getTime();
          const seconds = Math.floor(responseTimeMs / 1000);
          let responseTimeText = '';
          
          if (seconds < 1) responseTimeText = '<1sn';
          else if (seconds < 60) responseTimeText = `${seconds}sn`;
          else {
            const minutes = Math.floor(seconds / 60);
            responseTimeText = `${minutes}d ${seconds % 60}sn`;
          }
          
          return { ...message, responseTime: responseTimeText };
        }
      }
      return message;
    });
  }, [messages]);

  const messageListProps = {
    messages: messagesWithResponseTimes,
    isLoading,
    formatMessage: (content: string) => formatMessage(content) as JSX.Element
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/Wall.mp4" type="video/mp4" />
        Tarayıcınız video etiketini desteklemiyor.
      </video>
      
      <div className="relative z-10 w-full h-full flex items-center justify-center">
          {!isChatOpen ? (
            <div 
              className="mb-12 transition-all duration-300 ease-in-out transform opacity-100 scale-100"
              style={{ animation: isChatOpen ? 'fadeOut 0.3s forwards' : 'none' }}
            >
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Dna className="w-12 h-12 text-venice-coral" />
                  <h1 className="font-playfair text-6xl md:text-8xl italic text-venice-dark">
                    BioCryptor
                  </h1>
                </div>
                <p className="text-2xl text-venice-dark/80 font-inter">
                  Genetik Şifreleme Yapay Zekası
                </p>
              </div>
              
              <div className="relative mb-8 floating-element">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (query.trim()) {
                    handleSubmit(e);
                  } else if (messages.length > 0) {
                    setIsChatOpen(!isChatOpen);
                  }
                }} className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (query.trim()) {
                          handleSubmit(e as unknown as React.FormEvent);
                        } else if (messages.length > 0) {
                          setIsChatOpen(!isChatOpen);
                        }
                      }
                    }}
                    placeholder={t('chat.placeholder')}
                    className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-venice-stone/30 rounded-full text-lg placeholder-venice-dark/60 focus:outline-none focus:ring-2 focus:ring-venice-coral focus:border-transparent shadow-lg"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-venice-coral text-white p-3 rounded-full hover:bg-venice-coral/90 transition-colors shadow-md"
                  >
                    {messages.length > 0 ? <MessageCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div
              className="w-[70%] max-w-[3400px] mx-auto rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out bg-white/90 backdrop-blur-sm"
              style={{ 
                opacity: 1,
                height: '75vh',
                animation: 'expandChat 0.5s forwards'
              }}
            >
              <div className="flex flex-col h-full bg-white/85 backdrop-blur-md">
                <div className="relative px-6 py-3 bg-white/90 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Dna className="w-6 h-6 text-venice-coral" />
                    <h2 className="font-playfair text-xl italic text-venice-dark">{t('chat.title')}</h2>
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <button 
                      onClick={startNewChat}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-venice-dark/80 hover:text-venice-coral hover:bg-venice-stone/10 transition-colors rounded-md border border-venice-stone/20"
                      title={t('chat.new_chat')}
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t('chat.new')}</span>
                    </button>
                    <button 
                      onClick={handleCloseChat}
                      className="p-1.5 text-venice-dark/60 hover:text-venice-coral hover:bg-venice-stone/10 rounded-md transition-colors"
                      title="Sohbeti Kapat"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div 
                  className="flex-1 overflow-y-auto p-6"
                  role="log"
                  aria-live="polite"
                  aria-atomic="false"
                  aria-relevant="additions"
                >
                  <MessageList {...messageListProps} />
                  <div 
                    ref={messageEndRef} 
                    aria-hidden="true"
                    className="h-px"
                  />
                </div>
                
                <div className="p-3 bg-white/90 backdrop-blur-sm shadow-inner">
                  <form onSubmit={handleSubmit} className="relative">
                    <div className="relative">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e as unknown as React.FormEvent);
                          } else if (e.key === 'Escape') {
                            handleCloseChat();
                          }
                        }}
                        placeholder={t('chat.placeholder')}
                        disabled={isLoading}
                        aria-label={t('chat.placeholder')}
                        aria-busy={isLoading}
                        className="w-full px-4 py-3 bg-white border border-venice-stone/30 rounded-full text-base placeholder-venice-dark/60 focus:outline-none focus:ring-2 focus:ring-venice-coral focus:border-transparent shadow-sm"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-venice-coral/50 border-t-venice-coral rounded-full animate-spin" />
                        ) : (
                          <button
                            type="submit"
                            disabled={!query.trim()}
                            className="p-1.5 rounded-full text-venice-coral hover:bg-venice-coral/10 transition-colors"
                            aria-label={t('chat.send')}
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}


      </div>
    </div>
  );
};

export default ChatInterface;