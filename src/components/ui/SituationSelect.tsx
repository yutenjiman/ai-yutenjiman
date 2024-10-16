import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function SituationSelect({ setValue }: { setValue: (key: string, value: string) => void }) {
  return (
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
  );
}