export function Input({
  label,
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
      <input
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="error-text">{error}</p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className = '',
  containerClassName = '',
  rows = 4,
  ...props
}) {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`input-field resize-y ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="error-text">{error}</p>
      )}
    </div>
  );
}
