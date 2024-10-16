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
        'japanese': '日本料理',
        'sushi': '鮨',
        'seafood': '海鮮',
        'eel': 'うなぎ・あなご',
        'tempura': '天ぷら',
        'fried': 'とんかつ・揚げ物',
        'yakitori': '焼き鳥・串焼・鶏料理',
        'sukiyaki': 'すき焼き',
        'shabu-shabu': 'しゃぶしゃぶ',
        'soba': 'そば',
        'udon': 'うどん',
        'noodles': '麺類',
        'okonomiyaki': 'お好み焼き・たこ焼き',
        'donburi': '丼',
        'oden': 'おでん',
        'other': 'その他',
        'western': '洋食',
        'steak': 'ステーキ・鉄板焼',
        'french': 'フレンチ',
        'italian': 'イタリアン',
        'spanish': 'スペイン料理',
        'european': 'ヨーロッパ料理',
        'american': 'アメリカ料理',
        'chinese': '中華料理',
        'sichuan': '四川料理',
        'taiwanese': '台湾料理',
        'dimsum': '飲茶・点心',
        'gyoza': '餃子',
        'nikuman': '肉まん',
        'xiaolongbao': '小籠包',
        'congee': '中華粥',
        'asian': 'アジア・エスニック',
        'korean': '韓国料理',
        'southeast_asian': '東南アジア料理',
        'south_asian': '南アジア料理',
        'middle_eastern': '中東料理',
        'latin_american': '中南米料理',
        'african': 'アフリカ料理',
        'curry': 'カレー',
        'indian_curry': 'インドカレー',
        'soup_curry': 'スープカレー',
        'yakiniku': '焼肉',
        'hormone': 'ホルモン',
        'jingisukan': 'ジンギスカン',
        'nabe': '鍋',
        'motsunabe': 'もつ鍋',
        'mizutaki': '水炊き',
        'chanko': 'ちゃんこ鍋',
        'hotpot': '火鍋',
        'udonsuki': 'うどんすき',
        'izakaya': '居酒屋',
        'dining_bar': 'ダイニングバー',
        'standing_bar': '立ち飲み',
        'bar': 'バー',
        'beer_garden': 'ビアガーデン・ビアホール',
        'restaurant': 'レストラン・食堂',
        'creative': '創作料理・イノベーティブ',
        'organic': 'オーガニック・薬膳',
        'bento': '弁当・おにぎり・惣菜',
        'meat': '肉料理',
        'salad': 'サラダ・野菜料理',
        'cheese': 'チーズ料理',
        'garlic': 'ニンニク料理',
        'buffet': 'ビュッフェ',
        'bbq': 'バーベキュー',
        'yatai': '屋台船・クルージング',
        'ramen': 'ラーメン',
        'tsukemen': 'つけ麺',
        'aburasoba': '油そば・まぜそば',
        'taiwan_mazesoba': '台湾まぜそば',
        'tantanmen': '担々麺',
        'soup_less_tantanmen': '汁なし担々麺',
        'knife_cut_noodles': '刀削麺',
        'cafe': 'カフェ',
        'kissaten': '喫茶店',
        'kanmidokoro': '甘味処',
        'fruit_parlor': 'フルーツパーラー',
        'pancake': 'パンケーキ',
        'coffee_stand': 'コーヒースタンド',
        'tea_stand': 'ティースタンド',
        'juice_stand': 'ジューススタンド',
        'tapioca': 'タピオカ',
        'sweets': 'スイーツ',
        'western_sweets': '洋菓子',
        'cake': 'ケーキ',
        'cream_puff': 'シュークリーム',
        'chocolate': 'チョコレート',
        'donut': 'ドーナツ',
        'macaron': 'マカロン',
        'baumkuchen': 'バームクーヘン',
        'pudding': 'プリン',
        'crepe': 'クレープ・ガレット',
        'wagashi': '和菓子',
        'daifuku': '大福',
        'taiyaki': 'たい焼き・大判焼き',
        'dorayaki': 'どら焼き',
        'yakiimo': '焼き芋・大学芋',
        'senbei': 'せんべい',
        'chinese_sweets': '中華菓子',
        'gelato': 'ジェラート・アイスクリーム',
        'soft_cream': 'ソフトクリーム',
        'shaved_ice': 'かき氷',
        'bread': 'パン',
        'sandwich': 'サンドイッチ',
        'bagel': 'ベーグル',
        'pub': 'パブ',
        'wine_bar': 'ワインバー',
        'beer_bar': 'ビアバー',
        'sports_bar': 'スポーツバー',
        'sake_bar': '日本酒バー',
        'shochu_bar': '焼酎バー',
        'ryokan': '料理旅館',
        'auberge': 'オーベルジュ',
      },
      situation: {
        'family': '家族',
        'date': 'デート',
        'business': 'ビジネス',
        'friends': '友人',
        'solo': '一人',
        'party': 'パーティー',
        'celebration': 'お祝い',
        'casual': 'カジュアル',
        'formal': 'フォーマル',
        'romantic': 'ロマンチック',
        'adventure': '冒険',
        'relaxation': 'リラクゼーション',
        'work': '仕事',
        'study': '勉強',
        'travel': '旅行',
        'shopping': 'ショッピング',
        'sports': 'スポーツ',
        'entertainment': 'エンターテインメント',
        'health': '健康',
        'spiritual': 'スピリチュアル',
        'cultural': '文化',
        'educational': '教育',
        'volunteer': 'ボランティア',
        'networking': 'ネットワーキング',
        'family_gathering': '家族の集まり',
        'friend_meeting': '友人との会合',
        'business_meeting': 'ビジネス会議',
        'date_night': 'デートナイト',
        'solo_time': '一人の時間',
      }
    };

    if (key in translations && value && value in translations[key]) {
      return translations[key][value];
    }
    return value || '指定なし';
  };

  const fetchRecommendation = useCallback(async (body: object) => {
    try {
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
        const errorText = await response.text();
        console.error('APIレスポンスエラー:', errorText);
        throw new Error('APIレスポンスエラー');
      }

      const data = await response.json();
      console.log('APIからのデータ:', data); // デバッグ用ログ
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

      const initialMessage = `以下の条件でおすすめのお店を教えてください：
予算: ${userPreferences.budget || '指定なし'}
場所: ${userPreferences.location || '指定なし'}
ジャンル: ${translatePreference('cuisine', userPreferences.cuisine)}
シチュエーション: ${translatePreference('situation', userPreferences.situation)}`;

      setMessages([
        { id: 1, content: initialMessage, sender: 'user' },
        { id: 2, content: 'ちょっと待ってな...', sender: 'ai' }
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

    setMessages(prev => [...prev, userMessage, { id: messages.length + 2, content: 'ちょっと待ってな...', sender: 'ai' }]);
    const currentInput = input;
    setInput('');

    try {
      const data = await fetchRecommendation({ input: currentInput });
      console.log("受け取ったデータ:", data); // デバッグ用ログ

      // 飲食店に関連しない場合のデフォルト応答を設定
      const defaultResponse = 'その質問に対する情報はありませんが、他に何かお手伝いできることがあれば教えてください！';

      const aiMessage: Message = {
        id: messages.length + 2,
        content: data.recommendation || data.response || defaultResponse,
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