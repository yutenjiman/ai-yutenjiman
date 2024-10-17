import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState, useEffect } from 'react';

export function CuisineSelect({ setValue, cuisines }: { setValue: (key: string, value: string) => void, cuisines: { label: string, value: string }[] }) {
  const [cuisineSearch, setCuisineSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredCuisines = cuisines.filter(cuisine => cuisine.label.toLowerCase().includes(cuisineSearch.toLowerCase()));

  const handleSelectTriggerClick = () => {
    setIsOpen(!isOpen);
    if (isMobile && !isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleInputFocus = () => {
    if (!isMobile) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    if (!isMobile) {
      if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) {
        setTimeout(() => {
          setIsOpen(false);
        }, 200);
      }
    }
  };

  const handleSelectChange = (value: string) => {
    setValue('cuisine', value);
    setIsOpen(false);
    setCuisineSearch('');
    if (isMobile) {
      inputRef.current?.blur();
    }
  };

  return (
    <div>
      <Label htmlFor="cuisine">料理ジャンル（任意）</Label>
      <Select onValueChange={handleSelectChange} open={isOpen} onOpenChange={setIsOpen}>
        <SelectTrigger onClick={handleSelectTriggerClick}>
          <SelectValue placeholder="料理ジャンルを選択" />
        </SelectTrigger>
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
      </Select>
    </div>
  );
}