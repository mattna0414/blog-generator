import { RadioGroup } from '../ui/Select';
import { DIFFICULTY_OPTIONS } from '../../constants/options';

export function DifficultySelector({ value, onChange }) {
  return (
    <RadioGroup
      label="난이도"
      name="difficulty"
      options={DIFFICULTY_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}
