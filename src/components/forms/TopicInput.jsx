import { Input, Textarea } from '../ui/Input';

export function TopicInput({ topic, subtitle, onChange, errors = {} }) {
  return (
    <div>
      <Input
        label="블로그 주제 *"
        placeholder="예: React 성능 최적화 기법"
        value={topic}
        onChange={(e) => onChange('topic', e.target.value)}
        error={errors.topic}
      />
      <Textarea
        label="부제목 (선택)"
        placeholder="주제에 대한 간단한 설명을 입력하세요"
        value={subtitle}
        onChange={(e) => onChange('subtitle', e.target.value)}
        error={errors.subtitle}
        rows={2}
      />
    </div>
  );
}
