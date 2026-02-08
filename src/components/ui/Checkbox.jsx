export function Checkbox({
  label,
  description,
  checked,
  onChange,
  id,
  className = ''
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start space-x-3 p-3 border border-gray-300 rounded-md hover:border-blue-500 cursor-pointer transition-colors ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        {description && (
          <div className="text-sm text-gray-500">{description}</div>
        )}
      </div>
    </label>
  );
}

export function CheckboxGroup({
  label,
  options,
  values,
  onChange,
  className = ''
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="label mb-2">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <Checkbox
            key={option.id}
            id={option.id}
            label={option.label}
            description={option.description}
            checked={values[option.id] || false}
            onChange={(checked) => onChange(option.id, checked)}
          />
        ))}
      </div>
    </div>
  );
}
