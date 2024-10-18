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
    { value: '居酒屋', label: '居酒屋' },
    { value: 'イタリアン', label: 'イタリアン' },
    { value: 'ビストロ', label: 'ビストロ' },
    { value: '和食', label: '和食' },
    { value: '寿司', label: '寿司' },
    { value: '中華', label: '中華' },
    { value: '焼肉', label: '焼肉' },
    { value: '焼鳥', label: '焼鳥' },
    { value: 'ラーメン', label: 'ラーメン' },
    { value: 'そば・うどん', label: 'そば・うどん' },
    { value: '海鮮', label: '海鮮' },
    { value: 'ピザ', label: 'ピザ' },
    { value: 'ハンバーガー', label: 'ハンバーガー' },
    { value: 'カフェ・スイーツ', label: 'カフェ・スイーツ' },
    { value: 'その他', label: 'その他' },
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