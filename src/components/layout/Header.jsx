import { FileText, History } from 'lucide-react';
import { Button } from '../ui/Button';

export function Header({ onShowHistory }) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={32} className="text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                기술 블로그 초안 생성기
              </h1>
              <p className="text-sm text-gray-500">
                Claude AI로 완성도 높은 기술 블로그를 자동 생성하세요
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onShowHistory}
          >
            <History size={18} className="mr-2" />
            히스토리
          </Button>
        </div>
      </div>
    </header>
  );
}
