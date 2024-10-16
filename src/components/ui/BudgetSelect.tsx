import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface BudgetSelectProps {
  setValue: (field: string, value: string) => void;
}

export function BudgetSelect({ setValue }: BudgetSelectProps) {
  return (
    <div>
      <Label htmlFor="budget">予算（任意）</Label>
      <Select onValueChange={(value) => setValue('budget', value)}>
        <SelectTrigger>
          <SelectValue placeholder="予算を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="~5000">～5,000円</SelectItem>
          <SelectItem value="5000-10000">5,000円～10,000円</SelectItem>
          <SelectItem value="10000-20000">10,000円～20,000円</SelectItem>
          <SelectItem value="20000~">20,000円～</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}