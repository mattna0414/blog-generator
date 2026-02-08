import { CheckboxGroup } from '../ui/Checkbox';
import { CONTENT_OPTIONS } from '../../constants/options';

export function ContentOptions({ values, onChange }) {
  return (
    <CheckboxGroup
      label="포함할 콘텐츠 요소"
      options={CONTENT_OPTIONS}
      values={values}
      onChange={onChange}
    />
  );
}
