"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { BudgetSelect } from '@/components/ui/BudgetSelect';
import { LocationInput } from '@/components/ui/LocationInput';
import { CuisineSelect } from '@/components/ui/CuisineSelect';
import { SituationSelect } from '@/components/ui/SituationSelect';

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

  const cuisines = [
    { value: '和食', label: '和食' },
    { value: '鮨', label: '鮨' },
    { value: '海鮮', label: '海鮮' },
    { value: 'うなぎ・あなご', label: 'うなぎ・あなご' },
    { value: '天ぷら', label: '天ぷら' },
    { value: 'とんかつ・揚げ物', label: 'とんかつ・揚げ物' },
    { value: '焼き鳥・串焼・鶏料理', label: '焼き鳥・串焼・鶏料理' },
    { value: 'すき焼き', label: 'すき焼き' },
    { value: 'しゃぶしゃぶ', label: 'しゃぶしゃぶ' },
    { value: 'そば', label: 'そば' },
    { value: 'うどん', label: 'うどん' },
    { value: '麺類', label: '麺類' },
    { value: 'お好み焼き・たこ焼き', label: 'お好み焼き・たこ焼き' },
    { value: '丼', label: '丼' },
    { value: 'おでん', label: 'おでん' },
    { value: 'その他', label: 'その他' },
    { value: '洋食', label: '洋食' },
    { value: 'ステーキ・鉄板焼', label: 'ステーキ・鉄板焼' },
    { value: 'フレンチ', label: 'フレンチ' },
    { value: 'イタリアン', label: 'イタリアン' },
    { value: 'スペイン料理', label: 'スペイン料理' },
    { value: 'ヨーロッパ料理', label: 'ヨーロッパ料理' },
    { value: 'アメリカ料理', label: 'アメリカ料理' },
    { value: '中華料理', label: '中華料理' },
    { value: '四川料理', label: '四川料理' },
    { value: '台湾料理', label: '台湾料理' },
    { value: '飲茶・点心', label: '飲茶・点心' },
    { value: '餃子', label: '餃子' },
    { value: '肉まん', label: '肉まん' },
    { value: '小籠包', label: '小籠包' },
    { value: '中華粥', label: '中華粥' },
    { value: 'アジア・エスニック', label: 'アジア・エスニック' },
    { value: '韓国料理', label: '韓国料理' },
    { value: '東南アジア料理', label: '東南アジア料理' },
    { value: '南アジア料理', label: '南アジア料理' },
    { value: '中東料理', label: '中東料理' },
    { value: '中南米料理', label: '中南米料理' },
    { value: 'アフリカ料理', label: 'アフリカ料理' },
    { value: 'カレー', label: 'カレー' },
    { value: 'インドカレー', label: 'インドカレー' },
    { value: 'スープカレー', label: 'スープカレー' },
    { value: '焼肉', label: '焼肉' },
    { value: 'ホルモン', label: 'ホルモン' },
    { value: 'ジンギスカン', label: 'ジンギスカン' },
    { value: '鍋', label: '鍋' },
    { value: 'もつ鍋', label: 'もつ鍋' },
    { value: '水炊き', label: '水炊き' },
    { value: 'ちゃんこ鍋', label: 'ちゃんこ鍋' },
    { value: '火鍋', label: '火鍋' },
    { value: 'うどんすき', label: 'うどんすき' },
    { value: '居酒屋', label: '居酒屋' },
    { value: 'ダイニングバー', label: 'ダイニングバー' },
    { value: '立ち飲み', label: '立ち飲み' },
    { value: 'バー', label: 'バー' },
    { value: 'ビアガーデン・ビアホール', label: 'ビアガーデン・ビアホール' },
    { value: 'レストラン・食堂', label: 'レストラン・食堂' },
    { value: '創作料理・イノベーティブ', label: '創作料理・イノベーティブ' },
    { value: 'オーガニック・薬膳', label: 'オーガニック・薬膳' },
    { value: '弁当・おにぎり・惣菜', label: '弁当・おにぎり・惣菜' },
    { value: '肉料理', label: '肉料理' },
    { value: 'サラダ・野菜料理', label: 'サラダ・野菜料理' },
    { value: 'チーズ料理', label: 'チーズ料理' },
    { value: 'ニンニク料理', label: 'ニンニク料理' },
    { value: 'ビュッフェ', label: 'ビュッフェ' },
    { value: 'バーベキュー', label: 'バーベキュー' },
    { value: '屋台船・クルージング', label: '屋台船・クルージング' },
    { value: 'ラーメン', label: 'ラーメン' },
    { value: 'つけ麺', label: 'つけ麺' },
    { value: '油そば・まぜそば', label: '油そば・まぜそば' },
    { value: '台湾まぜそば', label: '台湾まぜそば' },
    { value: '担々麺', label: '担々麺' },
    { value: '汁なし担々麺', label: '汁なし担々麺' },
    { value: '刀削麺', label: '刀削麺' },
    { value: 'カフェ', label: 'カフェ' },
    { value: '喫茶店', label: '喫茶店' },
    { value: '甘味処', label: '甘味処' },
    { value: 'フルーツパーラー', label: 'フルーツパーラー' },
    { value: 'パンケーキ', label: 'パンケーキ' },
    { value: 'コーヒースタンド', label: 'コーヒースタンド' },
    { value: 'ティースタンド', label: 'ティースタンド' },
    { value: 'ジューススタンド', label: 'ジューススタンド' },
    { value: 'タピオカ', label: 'タピオカ' },
    { value: 'スイーツ', label: 'スイーツ' },
    { value: '洋菓子', label: '洋菓子' },
    { value: 'ケーキ', label: 'ケーキ' },
    { value: 'シュークリーム', label: 'シュークリーム' },
    { value: 'チョコレート', label: 'チョコレート' },
    { value: 'ドーナツ', label: 'ドーナツ' },
    { value: 'マカロン', label: 'マカロン' },
    { value: 'バームクーヘン', label: 'バームクーヘン' },
    { value: 'プリン', label: 'プリン' },
    { value: 'クレープ・ガレット', label: 'クレープ・ガレット' },
    { value: '和菓子', label: '和菓子' },
    { value: '大福', label: '大福' },
    { value: 'たい焼き・大判焼き', label: 'たい焼き・大判焼き' },
    { value: 'どら焼き', label: 'どら焼き' },
    { value: '焼き芋・大学芋', label: '焼き芋・大学芋' },
    { value: 'せんべい', label: 'せんべい' },
    { value: '中華菓子', label: '中華菓子' },
    { value: 'ジェラート・アイスクリーム', label: 'ジェラート・アイスクリーム' },
    { value: 'ソフトクリーム', label: 'ソフトクリーム' },
    { value: 'かき氷', label: 'かき氷' },
    { value: 'パン', label: 'パン' },
    { value: 'サンドイッチ', label: 'サンドイッチ' },
    { value: 'ベーグル', label: 'ベーグル' },
    { value: 'パブ', label: 'パブ' },
    { value: 'ワインバー', label: 'ワインバー' },
    { value: 'ビアバー', label: 'ビアバー' },
    { value: 'スポーツバー', label: 'スポーツバー' },
    { value: '日本酒バー', label: '日本酒バー' },
    { value: '焼酎バー', label: '焼酎バー' },
    { value: '料理旅館', label: '料理旅館' },
    { value: 'オーベルジュ', label: 'オーベルジュ' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">好みを教えてな</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <BudgetSelect setValue={(field, value) => setValue(field as "budget", value)} />
        <LocationInput register={(name) => register(name as "location")} />
        <CuisineSelect setValue={(field, value) => setValue(field as "cuisine", value)} cuisines={cuisines} />
        <SituationSelect setValue={(field, value) => setValue(field as "situation", value)} />
        <Button type="submit">チャットを開始</Button>
      </form>
    </div>
  );
}