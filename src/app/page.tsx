"use client";

import { useState, useCallback } from 'react';
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