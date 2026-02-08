import { TopicInput } from './TopicInput';
import { LengthSelector } from './LengthSelector';
import { DifficultySelector } from './DifficultySelector';
import { ToneSelector } from './ToneSelector';
import { AIProviderSelector } from './AIProviderSelector';
import { ContentOptions } from './ContentOptions';
import { Input, Textarea } from '../ui/Input';
import { useBlog } from '../../contexts/BlogContext';

export function BlogSettingsForm({ errors = {} }) {
  const { settings, updateSettings, updateContentOption } = useBlog();

  const handleChange = (field, value) => {
    updateSettings({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <TopicInput
        topic={settings.topic}
        subtitle={settings.subtitle}
        onChange={handleChange}
        errors={errors}
      />

      <LengthSelector
        value={settings.length}
        onChange={(value) => handleChange('length', value)}
      />

      <DifficultySelector
        value={settings.difficulty}
        onChange={(value) => handleChange('difficulty', value)}
      />

      <ToneSelector
        value={settings.tone}
        onChange={(value) => handleChange('tone', value)}
      />

      <AIProviderSelector
        value={settings.aiProvider}
        onChange={(value) => handleChange('aiProvider', value)}
      />

      <ContentOptions
        values={settings.contentOptions}
        onChange={updateContentOption}
      />

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">추가 옵션</h3>
        
        <Input
          label="대상 독자층 (선택)"
          placeholder="예: 1-2년차 프론트엔드 개발자"
          value={settings.targetAudience || '3년차 이하의 프론트엔드 개발자'}
          onChange={(e) => handleChange('targetAudience', e.target.value)}
        />

        <Input
          label="기술 스택 (선택)"
          placeholder="예: React, TypeScript, Next.js"
          value={settings.techStack || 'react, typescript, nextjs'}
          onChange={(e) => handleChange('techStack', e.target.value)}
        />

        <Textarea
          label="추가 요청사항 (선택)"
          placeholder="특별히 포함하거나 제외할 내용을 작성해주세요"
          value={settings.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          error={errors.notes}
          rows={3}
        />
      </div>
    </div>
  );
}
