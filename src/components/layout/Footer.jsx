import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Made with</span>
            <Heart size={16} className="text-red-500 fill-current" />
            <span>by Claude AI</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
            >
              <Github size={16} />
              <span>GitHub</span>
            </a>
          </div>
          
          <p className="text-xs text-gray-400">
            © 2024 기술 블로그 생성기. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
