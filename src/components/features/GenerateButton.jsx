import { Sparkles, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function GenerateButton({ onClick, onCancel, isGenerating, disabled }) {
  if (isGenerating) {
    return (
      <Button
        variant="danger"
        size="lg"
        onClick={onCancel}
        className="w-full"
      >
        <X size={20} className="mr-2" />
        생성 취소
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className="w-full"
    >
      <Sparkles size={20} className="mr-2" />
      블로그 초안 생성하기!!
    </Button>
  );
}
