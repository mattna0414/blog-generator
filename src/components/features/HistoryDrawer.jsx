import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Trash2, FileText, Calendar } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { extractMetadata } from '../../utils/markdown';

export function HistoryDrawer({ isOpen, onClose, onLoadDraft }) {
  const { history, deleteDraft, clearHistory } = useLocalStorage();
  const [selectedId, setSelectedId] = useState(null);

  const handleLoad = (draft) => {
    onLoadDraft(draft);
    onClose();
  };

  const handleDelete = (id) => {
    deleteDraft(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="저장된 히스토리"
      size="xl"
      footer={
        history.length > 0 && (
          <Button variant="danger" onClick={clearHistory}>
            전체 삭제
          </Button>
        )
      }
    >
      {history.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">저장된 히스토리가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((draft) => {
            const metadata = extractMetadata(draft.content);
            const date = new Date(draft.createdAt);

            return (
              <div
                key={draft.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {metadata.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {date.toLocaleDateString('ko-KR')} {date.toLocaleTimeString('ko-KR')}
                      </span>
                      <span>{metadata.wordCount} 단어</span>
                      <span>{metadata.readingTime}분 읽기</span>
                    </div>
                    {draft.settings?.topic && (
                      <p className="text-sm text-gray-600">
                        주제: {draft.settings.topic}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoad(draft)}
                    >
                      불러오기
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(draft.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
