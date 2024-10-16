import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// register の型を適切に指定するためのインターフェースを定義
interface LocationInputProps {
  register: (name: string) => { [key: string]: any }; // オブジェクトを返すように型を指定
}

export function LocationInput({ register }: LocationInputProps) {
  return (
    <div>
      <Label htmlFor="location">場所または最寄り駅（任意）</Label>
      <Input id="location" {...register('location')} placeholder="例: 都内, 祐天寺駅" />
    </div>
  );
}