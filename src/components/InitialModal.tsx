"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useRef } from 'react';

export const formSchema = z.object({
  budget: z.string().optional(),
  location: z.string().optional(),
  cuisine: z.string().optional(),
  situation: z.string().optional(),
});

export type UserPreferences = z.infer<typeof formSchema>;

interface InitialModalProps {
  onStartChat: (preferences: UserPreferences) => void;
}

export function InitialModal({ onStartChat }: InitialModalProps) {
  const { register, handleSubmit, setValue } = useForm<UserPreferences>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: UserPreferences) => {
    console.log("送信されるデータ:", data); 
    onStartChat(data);
  };

  const [cuisineSearch, setCuisineSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const cuisines = [
    { value: 'japanese', label: '日本料理' },
    { value: 'sushi', label: '鮨' },
    { value: 'seafood', label: '海鮮' },
    { value: 'eel', label: 'うなぎ・あなご' },
    { value: 'tempura', label: '天ぷら' },
    { value: 'fried', label: 'とんかつ・揚げ物' },
    { value: 'yakitori', label: '焼き鳥・串焼・鶏料理' },
    { value: 'sukiyaki', label: 'すき焼き' },
    { value: 'shabu-shabu', label: 'しゃぶしゃぶ' },
    { value: 'soba', label: 'そば' },
    { value: 'udon', label: 'うどん' },
    { value: 'noodles', label: '麺類' },
    { value: 'okonomiyaki', label: 'お好み焼き・たこ焼き' },
    { value: 'donburi', label: '丼' },
    { value: 'oden', label: 'おでん' },
    { value: 'other', label: 'その他' },
    { value: 'western', label: '洋食' },
    { value: 'steak', label: 'ステーキ・鉄板焼' },
    { value: 'french', label: 'フレンチ' },
    { value: 'italian', label: 'イタリアン' },
    { value: 'spanish', label: 'スペイン料理' },
    { value: 'european', label: 'ヨーロッパ料理' },
    { value: 'american', label: 'アメリカ料理' },
    { value: 'chinese', label: '中華料理' },
    { value: 'sichuan', label: '四川料理' },
    { value: 'taiwanese', label: '台湾料理' },
    { value: 'dimsum', label: '飲茶・点心' },
    { value: 'gyoza', label: '餃子' },
    { value: 'nikuman', label: '肉まん' },
    { value: 'xiaolongbao', label: '小籠包' },
    { value: 'congee', label: '中華粥' },
    { value: 'asian', label: 'アジア・エスニック' },
    { value: 'korean', label: '韓国料理' },
    { value: 'southeast_asian', label: '東南アジア料理' },
    { value: 'south_asian', label: '南アジア料理' },
    { value: 'middle_eastern', label: '中東料理' },
    { value: 'latin_american', label: '中南米料理' },
    { value: 'african', label: 'アフリカ料理' },
    { value: 'curry', label: 'カレー' },
    { value: 'indian_curry', label: 'インドカレー' },
    { value: 'soup_curry', label: 'スープカレー' },
    { value: 'yakiniku', label: '焼肉' },
    { value: 'hormone', label: 'ホルモン' },
    { value: 'jingisukan', label: 'ジンギスカン' },
    { value: 'nabe', label: '鍋' },
    { value: 'motsunabe', label: 'もつ鍋' },
    { value: 'mizutaki', label: '水炊き' },
    { value: 'chanko', label: 'ちゃんこ鍋' },
    { value: 'hotpot', label: '火鍋' },
    { value: 'udonsuki', label: 'うどんすき' },
    { value: 'izakaya', label: '居酒屋' },
    { value: 'dining_bar', label: 'ダイニングバー' },
    { value: 'standing_bar', label: '立ち飲み' },
    { value: 'bar', label: 'バー' },
    { value: 'beer_garden', label: 'ビアガーデン・ビアホール' },
    { value: 'restaurant', label: 'レストラン・食堂' },
    { value: 'creative', label: '創作料理・イノベーティブ' },
    { value: 'organic', label: 'オーガニック・薬膳' },
    { value: 'bento', label: '弁当・おにぎり・惣菜' },
    { value: 'meat', label: '肉料理' },
    { value: 'salad', label: 'サラダ・野菜料理' },
    { value: 'cheese', label: 'チーズ料理' },
    { value: 'garlic', label: 'ニンニク料理' },
    { value: 'buffet', label: 'ビュッフェ' },
    { value: 'bbq', label: 'バーベキュー' },
    { value: 'yatai', label: '屋台船・クルージング' },
    { value: 'ramen', label: 'ラーメン' },
    { value: 'tsukemen', label: 'つけ麺' },
    { value: 'aburasoba', label: '油そば・まぜそば' },
    { value: 'taiwan_mazesoba', label: '台湾まぜそば' },
    { value: 'tantanmen', label: '担々麺' },
    { value: 'soup_less_tantanmen', label: '汁なし担々麺' },
    { value: 'knife_cut_noodles', label: '刀削麺' },
    { value: 'cafe', label: 'カフェ' },
    { value: 'kissaten', label: '喫茶店' },
    { value: 'kanmidokoro', label: '甘味処' },
    { value: 'fruit_parlor', label: 'フルーツパーラー' },
    { value: 'pancake', label: 'パンケーキ' },
    { value: 'coffee_stand', label: 'コーヒースタンド' },
    { value: 'tea_stand', label: 'ティースタンド' },
    { value: 'juice_stand', label: 'ジューススタンド' },
    { value: 'tapioca', label: 'タピオカ' },
    { value: 'sweets', label: 'スイーツ' },
    { value: 'western_sweets', label: '洋菓子' },
    { value: 'cake', label: 'ケーキ' },
    { value: 'cream_puff', label: 'シュークリーム' },
    { value: 'chocolate', label: 'チョコレート' },
    { value: 'donut', label: 'ドーナツ' },
    { value: 'macaron', label: 'マカロン' },
    { value: 'baumkuchen', label: 'バームクーヘン' },
    { value: 'pudding', label: 'プリン' },
    { value: 'crepe', label: 'クレープ・ガレット' },
    { value: 'wagashi', label: '和菓子' },
    { value: 'daifuku', label: '大福' },
    { value: 'taiyaki', label: 'たい焼き・大判焼き' },
    { value: 'dorayaki', label: 'どら焼き' },
    { value: 'yakiimo', label: '焼き芋・大学芋' },
    { value: 'senbei', label: 'せんべい' },
    { value: 'chinese_sweets', label: '中華菓子' },
    { value: 'gelato', label: 'ジェラート・アイスクリーム' },
    { value: 'soft_cream', label: 'ソフトクリーム' },
    { value: 'shaved_ice', label: 'かき氷' },
    { value: 'bread', label: 'パン' },
    { value: 'sandwich', label: 'サンドイッチ' },
    { value: 'bagel', label: 'ベーグル' },
    { value: 'pub', label: 'パブ' },
    { value: 'wine_bar', label: 'ワインバー' },
    { value: 'beer_bar', label: 'ビアバー' },
    { value: 'sports_bar', label: 'スポーツバー' },
    { value: 'sake_bar', label: '日本酒バー' },
    { value: 'shochu_bar', label: '焼酎バー' },
    { value: 'ryokan', label: '料理旅館' },
    { value: 'auberge', label: 'オーベルジュ' },
  ];

  const filteredCuisines = cuisines.filter(cuisine => cuisine.label.includes(cuisineSearch));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">好みを教えてな</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="budget">予算（任意）</Label>
          <Select onValueChange={(value) => setValue('budget', value)}>
            <SelectTrigger>
              <SelectValue placeholder="予算を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="~5000">～5,000円</SelectItem>
              <SelectItem value="5000-10000">5,000円～10,000円</SelectItem>
              <SelectItem value="10000-20000">10,000円～20,000円</SelectItem>
              <SelectItem value="20000~">20,000円～</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">場所または最寄り駅（任意）</Label>
          <Input id="location" {...register('location')} placeholder="例: 都内, 祐天寺駅" />
        </div>
        <div>
          <Label htmlFor="cuisine">料理ジャンル（任意）</Label>
          <Select onValueChange={(value) => setValue('cuisine', value)}>
            <SelectTrigger onClick={() => setTimeout(() => inputRef.current?.focus(), 0)}>
              <SelectValue placeholder="料理ジャンルを選択" />
            </SelectTrigger>
            <SelectContent>
              <Input
                ref={inputRef}
                placeholder="料理ジャンルを検索"
                value={cuisineSearch}
                onChange={(e) => setCuisineSearch(e.target.value)}
                className="mb-2"
              />
              {filteredCuisines.map(cuisine => (
                <SelectItem key={cuisine.value} value={cuisine.value}>
                  {cuisine.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="situation">シチュエーション（任意）</Label>
          <Select onValueChange={(value) => setValue('situation', value)}>
            <SelectTrigger>
              <SelectValue placeholder="シチュエーションを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">デート</SelectItem>
              <SelectItem value="family">家族</SelectItem>
              <SelectItem value="friends">友人</SelectItem>
              <SelectItem value="business">ビジネス</SelectItem>
              <SelectItem value="solo">一人</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">チャットを開始</Button>
      </form>
    </div>
  );
}