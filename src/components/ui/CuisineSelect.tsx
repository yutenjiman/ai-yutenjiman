import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';

export function CuisineSelect({ setValue, cuisines }: { setValue: (key: string, value: string) => void, cuisines: { label: string, value: string }[] }) {
  const [cuisineSearch, setCuisineSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCuisines = cuisines.filter(cuisine => cuisine.label.includes(cuisineSearch));

  // フォーカスを当てる処理を削除
  const handleSelectTriggerClick = () => {
    // フォーカスを当てる処理を削除
  };

  return (
    <div>
      <Label htmlFor="cuisine">料理ジャンル（任意）</Label>
      <Select onValueChange={(value) => setValue('cuisine', value)}>
        <SelectTrigger onMouseDown={(e) => e.preventDefault()} onClick={handleSelectTriggerClick}>
          <SelectValue placeholder="料理ジャンルを選択" />
        </SelectTrigger>
        <SelectContent>
          <Input
            ref={inputRef}
            placeholder="料理ジャンルを検索"
            value={cuisineSearch}
            onChange={(e) => setCuisineSearch(e.target.value)}
            className="mb-2"
            onFocus={(e) => {
              e.stopPropagation();
            }}
          />
          {filteredCuisines.map(cuisine => (
            <SelectItem key={cuisine.value} value={cuisine.value}>
              {cuisine.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}