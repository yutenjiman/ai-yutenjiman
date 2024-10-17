import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';

export function CuisineSelect({ setValue, cuisines }: { setValue: (key: string, value: string) => void, cuisines: { label: string, value: string }[] }) {
  const [cuisineSearch, setCuisineSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredCuisines = cuisines.filter(cuisine => cuisine.label.toLowerCase().includes(cuisineSearch.toLowerCase()));

  const handleSelectTriggerClick = () => {
    setIsOpen(!isOpen);
    setIsSearching(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCuisineSearch(e.target.value);
    setIsOpen(true);
  };

  const handleSelectChange = (value: string) => {
    setValue('cuisine', value);
    setSelectedCuisine(value);
    setCuisineSearch('');
    setIsOpen(false);
    setIsSearching(false);
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearching(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div>
      <Label htmlFor="cuisine">料理ジャンル（任意）</Label>
      <Select onValueChange={handleSelectChange} open={isOpen} onOpenChange={setIsOpen} value={selectedCuisine}>
        <SelectTrigger onClick={handleSelectTriggerClick}>
          <SelectValue placeholder="料理ジャンルを選択" />
        </SelectTrigger>
        <SelectContent className="select-content">
          <div onClick={handleSearchClick}>
            <Input
              ref={inputRef}
              placeholder="料理ジャンルを検索"
              value={cuisineSearch}
              onChange={handleInputChange}
              className="mb-2"
              readOnly={!isSearching}
            />
          </div>
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