import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useRef, useEffect } from 'react';

export function CuisineSelect({ setValue, cuisines }: { setValue: (key: string, value: string) => void, cuisines: { label: string, value: string }[] }) {
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCuisines = cuisines.filter(cuisine => cuisine.label.toLowerCase().includes(cuisineSearch.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCuisineSearch(e.target.value);
    setIsOpen(true);
  };

  const handleCuisineSelect = (value: string, label: string) => {
    setValue('cuisine', value);
    setSelectedCuisine(label);
    setCuisineSearch('');
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef}>
      <Label htmlFor="cuisine">料理ジャンル（任意）</Label>
      <Input
        id="cuisine"
        placeholder={selectedCuisine || "料理ジャンルを選択"}
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
              onClick={() => handleCuisineSelect(cuisine.value, cuisine.label)}
            >
              {cuisine.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}