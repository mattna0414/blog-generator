import { LoadingSpinner } from '../ui/LoadingSpinner';

export function ProgressIndicator({ message, isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-4">
      <LoadingSpinner size="md" />
      <div className="flex-1">
        <p className="text-blue-900 font-medium">{message || '생성 중...'}</p>
        <p className="text-blue-700 text-sm mt-1">
          잠시만 기다려주세요. Claude가 블로그 글을 작성하고 있습니다.
        </p>
      </div>
    </div>
  );
}
