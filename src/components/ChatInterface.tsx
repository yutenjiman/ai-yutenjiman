"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

type Message = {
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
}

export function ChatInterface({ userPreferences }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const initializationRef = useRef(false);

  const translatePreference = (key: string, value: string | undefined): string => {
    const translations: { [key: string]: { [key: string]: string } } = {
      cuisine: {
        'chinese': '中華',
        'japanese': '和食',
        'italian': 'イタリアン',
        // 他のジャンルも追加
      },
      situation: {
        'family': '家族',
        'date': 'デート',
        'business': 'ビジネス',
        // 他のシチュエーションも追加
      }
    };

    if (key in translations && value && value in translations[key]) {
      return translations[key][value];
    }
    return value || '指定なし';
  };

  const fetchRecommendation = useCallback(async (body: object) => {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchRecommendation(body);
    }

    if (!response.ok) {
      throw new Error('APIレスポンスエラー');
    }

    const data = await response.json();
    console.log('APIからのデータ:', data); // デバッグ用ログ
    return data;
  }, []);

  useEffect(() => {
    const initializeChat = async () => {
      if (initializationRef.current) return;
      initializationRef.current = true;

      setLoading(true);
      setError('');

      const initialMessage = `以下の条件でおすすめのお店を教えてください：
予算: ${userPreferences.budget || '指定なし'}
場所: ${userPreferences.location || '指定なし'}
ジャンル: ${translatePreference('cuisine', userPreferences.cuisine)}
シチュエーション: ${translatePreference('situation', userPreferences.situation)}`;

      setMessages([
        { id: 1, content: initialMessage, sender: 'user' },
        { id: 2, content: 'ちょっと待ってな......', sender: 'ai' }
      ]);

      console.log('Sending initial request:', userPreferences);

      try {
        const data = await fetchRecommendation(userPreferences);
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
  }, [userPreferences, fetchRecommendation]);

  const handleSend = async () => {
    if (input.trim() === '' || loading) return;
    setLoading(true);
    setError('');

    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage, { id: messages.length + 2, content: 'ちょっと待ってな......', sender: 'ai' }]);
    const currentInput = input;
    setInput('');

    try {
      const data = await fetchRecommendation({ input: currentInput });
      const aiMessage: Message = {
        id: messages.length + 2,
        content: data.response || '応答がありません。',
        sender: 'ai',
      };
      console.log("AIの返答:", aiMessage.content); // デバッグ用ログ
      setMessages(prev => prev.map(msg => msg.id === aiMessage.id ? aiMessage : msg));
    } catch (error) {
      console.error('AI応答の生成に失敗しました:', error);
      setError('AI応答の生成に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (response: string | undefined) => {
    if (!response) {
      return <div>応答がありません。</div>;
    }
    const html = marked(response.replace(/\n/g, '<br>'));
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
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
                  style={{ borderRadius: '50%' }}
                />
              )}
              {formatResponse(message.content)}
            </div>
          </div>
        ))}
      </div>
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