"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageList } from './ui/MessageList';

// Message型をエクスポート
export type Message = {
  id: number;
  content: string;
  sender: 'user' | 'ai';
};

interface ChatInterfaceProps {
  userPreferences: {
    budget?: string;
    location?: string;
    cuisine?: string;
    situation?: string;
  };
  sessionId: string; // セッションIDをプロパティとして追加
}

export function ChatInterface({ userPreferences, sessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const initializationRef = useRef(false);

  const fetchRecommendation = useCallback(async (body: object, retries = 3, delay = 1000) => {
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 429) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchRecommendation(body, retries - 1, delay * 2);
        }
        throw new Error('Too many requests, please try again later.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('APIレスポンスエラー:', errorText);
        throw new Error('APIレスポンスエラー');
      }

      const data = await response.json();
      console.log('APIからのデータ:', data);
      return data;
    } catch (error) {
      console.error('API呼び出し中にエラーが発生しました:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const initializeChat = async () => {
      if (initializationRef.current) return;
      initializationRef.current = true;

      setLoading(true);
      setError('');

      const initialMessage = `以下の条件でおすすめのお店を教えて
予算: ${userPreferences.budget || '指定なし'}
場所: ${userPreferences.location || '指定なし'}
ジャンル: ${userPreferences.cuisine || '指定なし'}
シチュエーション: ${userPreferences.situation || '指定なし'}`;

      setMessages([
        { id: 1, content: initialMessage, sender: 'user' },
        { id: 2, content: 'ちょっと待ってな...', sender: 'ai' }
      ]);

      console.log('Sending initial request:', userPreferences);

      try {
        const data = await fetchRecommendation({ ...userPreferences, sessionId });
        console.log('Received response:', data);
        setMessages(prevMessages => [
          prevMessages[0],
          { id: 2, content: data.recommendation || '応答がありません。', sender: 'ai' }
        ]);
      } catch (error) {
        console.error('レストラン推薦の取得に失敗しました:', error);
        setError('レストランの推薦取得に失敗しました。もう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [userPreferences, fetchRecommendation, sessionId]);

  const handleSend = async () => {
    if (input.trim() === '' || loading) return;
    setLoading(true);
    setError('');

    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage, { id: messages.length + 2, content: 'ちょっと待ってな...', sender: 'ai' }]);
    const currentInput = input;
    setInput('');

    try {
      const data = await fetchRecommendation({ input: currentInput, sessionId }); // セッションIDを含める
      console.log("受け取ったデータ:", data);

      const defaultResponse = 'その質問はちょっとわからんけど、他に何か答えるで！';

      const aiMessage: Message = {
        id: messages.length + 2,
        content: data.recommendation || data.response || defaultResponse,
        sender: 'ai',
      };
      console.log("AIの返答:", aiMessage.content);
      setMessages(prev => prev.map(msg => msg.id === aiMessage.id ? aiMessage : msg));
    } catch (error) {
      console.error('AI応答の生成に失敗しました:', error);
      setError('AI応答の生成に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <MessageList messages={messages} />
      <div className="flex">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
          placeholder="メッセージを入力..."
          className="flex-1 mr-2"
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading}>送信</Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}