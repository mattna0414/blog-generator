import { RadioGroup } from '../ui/Select';
import { LENGTH_OPTIONS } from '../../constants/options';

export function LengthSelector({ value, onChange }) {
  return (
    <RadioGroup
      label="글 길이"
      name="length"
      options={LENGTH_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}
