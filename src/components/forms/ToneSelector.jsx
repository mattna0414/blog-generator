import { RadioGroup } from '../ui/Select';
import { TONE_OPTIONS } from '../../constants/options';

export function ToneSelector({ value, onChange }) {
  return (
    <RadioGroup
      label="문체 톤"
      name="tone"
      options={TONE_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}
