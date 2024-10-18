import { Input } from './input';
import { Button } from './button';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSend: () => void;
  loading: boolean;
}

export function ChatInput({ input, setInput, handleSend, loading }: ChatInputProps) {
  return (
    <div className="flex">
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
        placeholder="メッセージを入力..."
        className="flex-1 mr-2"
        disabled={loading}
      />
      <Button onClick={handleSend} disabled={loading}>送信</Button>
    </div>
  );
}