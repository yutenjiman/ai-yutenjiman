import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';

export function CuisineSelect({ setValue, cuisines }: { setValue: (key: string, value: string) => void, cuisines: { label: string, value: string }[] }) {
  const [cuisineSearch, setCuisineSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredCuisines = cuisines.filter(cuisine => cuisine.label.includes(cuisineSearch));

  const handleSelectTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleInputFocus = () => {
    setIsOpen(true); // フォーカス時にドロップダウンを開く
  };

  const handleInputBlur = () => {
    // タイムアウトを利用して次のクリックが発生するかどうかを少し待つ
    setTimeout(() => {
      if (!document.activeElement?.closest('.select-content')) {
        setIsOpen(false); // フォーカスが完全に外れたらドロップダウンを閉じる
      }
    }, 100); // 小さな遅延を加える
  };

  return (
    <div>
      <Label htmlFor="cuisine">料理ジャンル（任意）</Label>
      <Select onValueChange={(value) => setValue('cuisine', value)}>
        <SelectTrigger onClick={handleSelectTriggerClick}>
          <SelectValue placeholder="料理ジャンルを選択" />
        </SelectTrigger>
        {isOpen && (
          <SelectContent className="select-content">
            <Input
              ref={inputRef}
              placeholder="料理ジャンルを検索"
              value={cuisineSearch}
              onChange={(e) => setCuisineSearch(e.target.value)}
              className="mb-2"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            {filteredCuisines.map(cuisine => (
              <SelectItem key={cuisine.value} value={cuisine.value}>
                {cuisine.label}
              </SelectItem>
            ))}
          </SelectContent>
        )}
      </Select>
    </div>
  );
}
