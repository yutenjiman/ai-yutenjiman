import Image from 'next/image';
import { Message } from '../ChatInterface';
import { formatResponse } from '../../lib/formatResponse';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-100 rounded">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 ${
            message.sender === 'user' ? 'text-right' : 'text-left'
          }`}
        >
          <div
            className={`inline-block p-2 rounded-lg ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white text-left'
                : 'bg-gray-300 text-black'
            }`}
          >
            {message.sender === 'ai' && (
              <Image
                src="/ai-yutenji-man.png"
                alt="AI"
                width={30}
                height={30}
                className="rounded-full"
              />
            )}
            {formatResponse(message.content)}
          </div>
        </div>
      ))}
    </div>
  );
}