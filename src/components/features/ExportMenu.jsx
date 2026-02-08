import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export function ExportMenu({
  onDownloadMd,
  onDownloadHtml,
  onCopy,
  disabled = false
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await onCopy();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        disabled={disabled}
      >
        {copied ? (
          <>
            <Check size={16} className="mr-1.5 text-green-600" />
            복사됨
          </>
        ) : (
          <>
            <Copy size={16} className="mr-1.5" />
            클립보드 복사
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onDownloadMd}
        disabled={disabled}
      >
        <Download size={16} className="mr-1.5" />
        마크다운 다운로드
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onDownloadHtml}
        disabled={disabled}
      >
        <Download size={16} className="mr-1.5" />
        HTML 다운로드
      </Button>
    </div>
  );
}
