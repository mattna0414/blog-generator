export function Select({
  label,
  options,
  value,
  onChange,
  error,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="error-text">{error}</p>
      )}
    </div>
  );
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  name,
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
          <label
            key={option.value}
            className="flex items-start space-x-3 p-3 border border-gray-300 rounded-md hover:border-blue-500 cursor-pointer transition-colors"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-500">{option.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
