import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// register の型を適切に指定するためのインターフェースを定義
interface RegisterReturn {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
}

interface LocationInputProps {
  register: (name: string) => RegisterReturn; // より具体的な型を指定
}

export function LocationInput({ register }: LocationInputProps) {
  return (
    <div>
      <Label htmlFor="location">場所または最寄り駅（任意）</Label>
      <Input id="location" {...register('location')} placeholder="例: 都内, 祐天寺駅" />
    </div>
  );
}