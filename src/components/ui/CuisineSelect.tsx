import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useRef, useEffect } from 'react';

export function CuisineSelect({ setValue, cuisines }: { setValue: (key: string, value: string) => void, cuisines: { label: string, value: string }[] }) {
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredCuisines = cuisines.filter(cuisine => cuisine.label.toLowerCase().includes(cuisineSearch.toLowerCase()));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCuisineSearch(e.target.value);
  };

  const handleSelectChange = (value: string) => {
    setValue('cuisine', value);
    setCuisineSearch('');
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCuisineSearch('');
    }
  };

  if (isMobile) {
    return (
      <div>
        <Label htmlFor="cuisine">料理ジャンル（任意）</Label>
        <Input
          placeholder="料理ジャンルを検索"
          value={cuisineSearch}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        {isOpen && (
          <div className="mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
            {filteredCuisines.map(cuisine => (
              <div
                key={cuisine.value}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectChange(cuisine.value)}
              >
                {cuisine.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor="cuisine">料理ジャンル（任意）</Label>
      <Select onValueChange={handleSelectChange} open={isOpen} onOpenChange={handleOpenChange}>
        <SelectTrigger>
          <SelectValue placeholder="料理ジャンルを選択" />
        </SelectTrigger>
        <SelectContent>
          <Input
            ref={inputRef}
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