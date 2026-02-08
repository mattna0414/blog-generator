import { useState, useEffect } from 'react';

export function MarkdownEditor({ content, onChange, placeholder = '생성된 마크다운 내용이 여기에 표시됩니다...' }) {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    onChange(newContent);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <textarea
          value={localContent}
          onChange={handleChange}
          placeholder={placeholder}
          className="absolute inset-0 w-full h-full p-4 font-mono text-sm border-0 focus:outline-none focus:ring-0 resize-none"
          style={{ minHeight: '500px' }}
        />
      </div>
    </div>
  );
}
