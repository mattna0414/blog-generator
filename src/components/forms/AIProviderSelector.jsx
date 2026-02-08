import { RadioGroup } from '../ui/Select';
import { AI_PROVIDER_OPTIONS } from '../../constants/options';

export function AIProviderSelector({ value, onChange }) {
  return (
    <RadioGroup
      label="AI 제공자"
      name="aiProvider"
      options={AI_PROVIDER_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}
