"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">あなたの好みを教えて（任意）</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="budget">予算</Label>
          <Input id="budget" {...register('budget')} placeholder="例: 3000円" />
        </div>
        <div>
          <Label htmlFor="location">場所または最寄り駅</Label>
          <Input id="location" {...register('location')} placeholder="例: 祐天寺駅" />
        </div>
        <div>
          <Label htmlFor="cuisine">料理ジャンル</Label>
          <Select onValueChange={(value) => setValue('cuisine', value)}>
            <SelectTrigger>
              <SelectValue placeholder="料理ジャンルを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="japanese">和食</SelectItem>
              <SelectItem value="chinese">中華</SelectItem>
              <SelectItem value="italian">イタリアン</SelectItem>
              <SelectItem value="french">フレンチ</SelectItem>
              <SelectItem value="other">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="situation">シチュエーション</Label>
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