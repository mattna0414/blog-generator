import { Copy, Download, RotateCcw, Edit3 } from 'lucide-react';
import { Button } from '../ui/Button';

export function EditorToolbar({
  onCopy,
  onDownloadMd,
  onDownloadHtml,
  onRegenerate,
  onEdit,
  isGenerating = false
}) {
  return (
    <div className="flex items-center space-x-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
      <Button
        size="sm"
        variant="outline"
        onClick={onCopy}
        disabled={isGenerating}
      >
        <Copy size={16} className="mr-1.5" />
        복사
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={onDownloadMd}
        disabled={isGenerating}
      >
        <Download size={16} className="mr-1.5" />
        .md
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={onDownloadHtml}
        disabled={isGenerating}
      >
        <Download size={16} className="mr-1.5" />
        .html
      </Button>

      <div className="flex-1" />

      <Button
        size="sm"
        variant="outline"
        onClick={onEdit}
        disabled={isGenerating}
      >
        <Edit3 size={16} className="mr-1.5" />
        편집
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={onRegenerate}
        disabled={isGenerating}
      >
        <RotateCcw size={16} className="mr-1.5" />
        재생성
      </Button>
    </div>
  );
}
