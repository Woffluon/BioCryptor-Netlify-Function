import React, { memo, useMemo } from 'react';
import { Message } from '../types';
import { useLanguage } from '../hooks/useLanguage';

const renderMarkdown = (text: string) => {
  if (!text) return '';
  
  const codeBlocks: string[] = [];
  let processedText = text.replace(/```([\s\S]*?)```/g, (match) => {
    codeBlocks.push(match);
    return `%%CODE_BLOCK_${codeBlocks.length - 1}%%`;
  });

  const lines = processedText.split('\n');
  let inList = false;
  
  const processedLines = lines.map(line => {
    if (line.match(/^######\s/)) return `<h6 class="text-sm font-bold mt-4 mb-2">${line.substring(7)}</h6>`;
    if (line.match(/^#####\s/)) return `<h5 class="text-base font-bold mt-4 mb-2">${line.substring(6)}</h5>`;
    if (line.match(/^####\s/)) return `<h4 class="text-lg font-bold mt-4 mb-2">${line.substring(5)}</h4>`;
    if (line.match(/^###\s/)) return `<h3 class="text-xl font-bold mt-4 mb-2">${line.substring(4)}</h3>`;
    if (line.match(/^##\s/)) return `<h2 class="text-2xl font-bold mt-5 mb-3">${line.substring(3)}</h2>`;
    if (line.match(/^#\s/)) return `<h1 class="text-3xl font-bold mt-6 mb-4">${line.substring(2)}</h1>`;
    
    if (line.match(/^\s*[-*+]\s/)) {
      if (!inList) {
        inList = true;
        return `<ul class="list-disc pl-6 my-2"><li>${line.replace(/^\s*[-*+]\s+/, '')}</li>`;
      }
      return `<li>${line.replace(/^\s*[-*+]\s+/, '')}</li>`;
    } else if (inList) {
      inList = false;
      return `</ul>${line}`;
    }
    
    if (line.match(/^>\s/)) {
      return `<blockquote class="border-l-4 border-gray-300 pl-4 py-1 my-2 text-gray-600">${line.substring(2)}</blockquote>`;
    }
    
    if (line.match(/^[-*_]{3,}$/)) return '<hr class="my-4 border-t border-gray-200" />';
    
    return line;
  }).join('\n');

  let result = processedLines;
  codeBlocks.forEach((code, index) => {
    const content = code.replace(/^```(?:\w*\n)?|```$/g, '').trim();
    result = result.replace(
      `%%CODE_BLOCK_${index}%%`,
      `<pre class="bg-gray-100 p-4 rounded-md overflow-x-auto my-2"><code class="text-sm">${content}</code></pre>`
    );
  });

  return result
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/~~(.*?)~~/g, '<s>$1</s>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-2 max-w-full h-auto rounded" />')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-venice-coral hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n\s*\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
    .replace(/<p>(.*?)<\/p>/g, (_, p1) => p1.startsWith('<') ? p1 : `<p class="my-2">${p1}</p>`);
};

interface MessageListProps {
  messages: (Message & { responseTime?: string })[];
  isLoading: boolean;
  formatMessage: (content: string) => JSX.Element;
}

const formatResponseTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 1) return '<1sn';
  if (seconds < 60) return `${seconds}sn`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}d ${seconds % 60}sn`;
};

const MessageItem = memo(({ 
  message, 
  formatMessage, 
  translatedYou, 
  translatedAssistant,
  responseTime
}: { 
  message: Message; 
  formatMessage: (content: string) => JSX.Element;
  translatedYou: string;
  translatedAssistant: string;
  responseTime?: string;
}) => {
  const ariaLabel = useMemo(() => 
    `${message.role === 'user' ? translatedYou : translatedAssistant}: ${message.content.substring(0, 100)}`,
    [message.content, message.role, translatedAssistant, translatedYou]
  );

  return (
    <div 
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-message`}
      role="listitem"
      aria-label={ariaLabel}
    >
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' 
          ? 'bg-venice-coral/10 text-venice-dark border border-venice-coral/20' 
          : 'bg-white text-venice-dark border border-venice-stone/20 shadow-sm'}`}
        aria-live={message.role === 'assistant' ? 'polite' : 'off'}
      >
        <div className="mb-1 text-xs opacity-70 flex justify-between items-center" aria-hidden="true">
          <span>{message.role === 'user' ? translatedYou : translatedAssistant}</span>
          {message.role === 'assistant' && message.responseTime && (
            <span className="text-xs opacity-50">{message.responseTime}</span>
          )}
        </div>
        <div 
          className="markdown-content" 
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

const MessageList = memo(({ messages, isLoading, formatMessage }: MessageListProps) => {
  const { t } = useLanguage();
  
  const { translatedYou, translatedAssistant, translatedThinking, translatedStartMessage } = useMemo(() => ({
    translatedYou: t('chat.you'),
    translatedAssistant: t('chat.assistant'),
    translatedThinking: t('chat.thinking'),
    translatedStartMessage: t('chat.start_message')
  }), [t]);

  const loadingIndicator = useMemo(() => (
    <div className="flex justify-start animate-message">
      <div 
        className="bg-white rounded-lg p-3 border border-venice-stone/20 shadow-sm flex items-center space-x-2"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="w-4 h-4 border-2 border-venice-coral/50 border-t-venice-coral rounded-full animate-spin" />
        <span className="text-sm text-venice-dark/60">{translatedThinking}</span>
      </div>
    </div>
  ), [translatedThinking]);

  if (messages.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-full text-center"
        aria-live="polite"
      >
        <p className="text-venice-dark/60">
          {translatedStartMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem 
          key={message.id}
          message={message}
          formatMessage={formatMessage}
          translatedYou={translatedYou}
          translatedAssistant={translatedAssistant}
        />
      ))}
      
      {isLoading && loadingIndicator}
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;