import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function CuisineSelect({ setValue, cuisines }: { setValue: (key: string, value: string) => void, cuisines: { label: string, value: string }[] }) {
  const [cuisineSearch, setCuisineSearch] = useState('');

  const filteredCuisines = cuisines.filter(cuisine => cuisine.label.toLowerCase().includes(cuisineSearch.toLowerCase()));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCuisineSearch(e.target.value);
  };

  const handleSelectChange = (value: string) => {
    setValue('cuisine', value);
    setCuisineSearch('');
  };

  return (
    <div>
      <Label htmlFor="cuisine">料理ジャンル（任意）</Label>
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue placeholder="料理ジャンルを選択" />
        </SelectTrigger>
        <SelectContent>
          <Input
            placeholder="料理ジャンルを検索"
            value={cuisineSearch}
            onChange={handleInputChange}
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
  );
}