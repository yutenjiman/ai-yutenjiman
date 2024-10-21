"use client";

import { useState, useCallback, useEffect } from 'react';
import { InitialModal, UserPreferences } from '@/components/InitialModal';
import { ChatInterface } from '@/components/ChatInterface';
import { v4 as uuidv4 } from 'uuid'; // UUIDを生成するために追加

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    budget: '',
    location: '',
    cuisine: '',
    situation: ''
  });
  const [sessionId, setSessionId] = useState<string>(''); // セッションIDの状態を追加

  const handleStartChat = useCallback((preferences: UserPreferences) => {
    console.log("Home コンポーネントで受け取ったデータ:", preferences);
    setUserPreferences(preferences);
    setSessionId(uuidv4()); // セッションIDを生成
    setShowChat(true);
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('/api/getRestaurants');
        if (!response.ok) {
          throw new Error('データ取得エラー');
        }
  
        const restaurants = await response.json();
        console.log("取得したレストランデータ:", restaurants); // データをログに出力
  
        localStorage.setItem('restaurants', JSON.stringify(restaurants));
        console.log("レストランデータがローカルストレージに保存されました。");
      } catch (error) {
        console.error('エラーが発生しました:', error);
      }
    };
  
    fetchRestaurants();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI祐天寺マン</h1>
      {!showChat ? (
        <InitialModal onStartChat={handleStartChat} />
      ) : (
        <ChatInterface 
          key={JSON.stringify(userPreferences)}
          userPreferences={userPreferences} 
          sessionId={sessionId} // セッションIDを渡す
        />
      )}
    </div>
  );
}