# 코드 스타일 가이드 - 기술 블로그 초안 생성기

## 프로젝트 정보
- **프레임워크**: React 18+
- **주요 라이브러리**: 
  - Tailwind CSS (스타일링)
  - react-markdown (마크다운 렌더링)
  - react-syntax-highlighter (코드 하이라이팅)
  - Lucide React (아이콘)
- **언어**: JavaScript (ES6+)
- **빌드 도구**: Vite

## 파일 및 폴더 구조

```
src/
├── components/
│   ├── forms/              # 입력 폼 관련
│   │   ├── BlogSettingsForm.jsx
│   │   ├── TopicInput.jsx
│   │   ├── LengthSelector.jsx
│   │   ├── DifficultySelector.jsx
│   │   ├── ToneSelector.jsx
│   │   └── ContentOptions.jsx
│   ├── editor/             # 에디터 및 미리보기
│   │   ├── MarkdownEditor.jsx
│   │   ├── MarkdownPreview.jsx
│   │   └── EditorToolbar.jsx
│   ├── layout/             # 레이아웃
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── MainContainer.jsx
│   ├── ui/                 # 재사용 가능한 UI
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Checkbox.jsx
│   │   ├── Modal.jsx
│   │   └── LoadingSpinner.jsx
│   └── features/           # 주요 기능
│       ├── GenerateButton.jsx
│       ├── ExportMenu.jsx
│       ├── HistoryDrawer.jsx
│       └── ProgressIndicator.jsx
├── hooks/                  # 커스텀 훅
│   ├── useClaudeAPI.js
│   ├── useLocalStorage.js
│   ├── useMarkdownExport.js
│   └── useStreamResponse.js
├── utils/                  # 유틸리티 함수
│   ├── api.js             # API 호출 로직
│   ├── markdown.js        # 마크다운 처리
│   ├── export.js          # 내보내기 함수
│   ├── prompts.js         # AI 프롬프트 템플릿
│   └── validation.js      # 입력 검증
├── constants/              # 상수
│   ├── options.js         # 폼 옵션 상수
│   └── config.js          # 앱 설정
├── contexts/               # Context API
│   └── BlogContext.jsx    # 전역 상태 관리
├── App.jsx
└── main.jsx
```

## 네이밍 컨벤션

### 파일명
- **컴포넌트**: PascalCase (예: `BlogSettingsForm.jsx`)
- **유틸리티**: camelCase (예: `api.js`, `markdown.js`)
- **상수**: camelCase (예: `options.js`)
- **훅**: camelCase with 'use' prefix (예: `useClaudeAPI.js`)

### 변수 및 함수
```javascript
// 변수: camelCase
const blogSettings = {};
const generatedContent = "";
const isLoading = false;

// 상수: UPPER_SNAKE_CASE
const API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MAX_CONTENT_LENGTH = 5000;
const DEFAULT_LENGTH = 'medium';

// 함수: camelCase, 동사로 시작
function generateBlog() { }
function handleSubmit() { }
function validateInput() { }
function exportToMarkdown() { }

// Boolean: is/has/should 접두사
const isGenerating = true;
const hasContent = false;
const shouldShowPreview = true;

// 이벤트 핸들러: handle + 동작
const handleTopicChange = (e) => { };
const handleGenerateClick = () => { };
const handleExport = () => { };
```

### React 컴포넌트
```javascript
// Props는 구조 분해 할당 사용
function TopicInput({ value, onChange, placeholder, error }) {
  return (
    <div className="form-group">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'input-error' : 'input'}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

// PropTypes (선택사항)
import PropTypes from 'prop-types';

TopicInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string
};

TopicInput.defaultProps = {
  placeholder: '블로그 주제를 입력하세요',
  error: null
};
```

## 상태 관리

### Context API 사용
```javascript
// contexts/BlogContext.jsx
import { createContext, useContext, useState } from 'react';

const BlogContext = createContext();

export function BlogProvider({ children }) {
  const [settings, setSettings] = useState({
    topic: '',
    subtitle: '',
    length: 'medium',
    difficulty: 'intermediate',
    tone: 'neutral',
    contentOptions: {
      includeCode: false,
      includeDiagrams: false,
      includeTutorial: false,
      includeComparison: false,
      includeUseCases: false,
      includeReferences: false
    }
  });

  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  return (
    <BlogContext.Provider value={{
      settings,
      setSettings,
      generatedContent,
      setGeneratedContent,
      isGenerating,
      setIsGenerating,
      error,
      setError
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within BlogProvider');
  }
  return context;
}
```

### 커스텀 훅
```javascript
// hooks/useClaudeAPI.js
import { useState, useCallback } from 'react';

export function useClaudeAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateContent = useCallback(async (prompt, onChunk) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }],
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullContent += chunk;
        
        if (onChunk) {
          onChunk(chunk);
        }
      }

      return fullContent;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generateContent, isLoading, error };
}
```

## Tailwind CSS 스타일링

### 클래스 순서 규칙
```javascript
// 레이아웃 → 크기 → 간격 → 색상 → 타이포그래피 → 효과
<div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 py-8 bg-white text-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
```

### 조건부 스타일링
```javascript
// 템플릿 리터럴 사용
<button 
  className={`
    px-4 py-2 rounded-md font-medium transition-colors
    ${isGenerating 
      ? 'bg-gray-400 cursor-not-allowed' 
      : 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  `}
  disabled={isGenerating}
>
  {isGenerating ? '생성 중...' : '생성하기'}
</button>

// 복잡한 조건은 함수로 분리
function getButtonClassName(variant, size, disabled) {
  const base = 'rounded-md font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return `${base} ${variants[variant]} ${sizes[size]} ${disabledClass}`;
}
```

### 재사용 가능한 컴포넌트
```javascript
// components/ui/Button.jsx
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick,
  ...props 
}) {
  const baseClass = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-400',
    outline: 'border-2 border-gray-300 hover:border-gray-400 text-gray-700'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`
        ${baseClass} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
```

## API 통합

### 프롬프트 생성
```javascript
// utils/prompts.js
export function buildBlogPrompt(settings) {
  const { topic, subtitle, length, difficulty, tone, contentOptions } = settings;

  const lengthMapping = {
    short: '약 1000자',
    medium: '약 2000자',
    long: '약 3000자 이상'
  };

  const toneMapping = {
    casual: '친근하고 대화체의',
    professional: '전문적이고 공식적인',
    neutral: '중립적인'
  };

  const difficultyMapping = {
    beginner: '입문자를 위한 쉬운 설명',
    intermediate: '중급 개발자를 위한 실용적인 내용',
    advanced: '고급 개발자를 위한 심화 내용'
  };

  let prompt = `당신은 전문 기술 블로그 작가입니다. 다음 요구사항에 맞춰 기술 블로그 글을 작성해주세요.

**주제**: ${topic}`;

  if (subtitle) {
    prompt += `\n**부제**: ${subtitle}`;
  }

  prompt += `
**글 길이**: ${lengthMapping[length]}
**난이도**: ${difficultyMapping[difficulty]}
**톤**: ${toneMapping[tone]}

**포함해야 할 요소**:`;

  if (contentOptions.includeCode) {
    prompt += '\n- 실제 동작하는 코드 예제';
  }
  if (contentOptions.includeDiagrams) {
    prompt += '\n- 다이어그램이나 시각자료에 대한 설명';
  }
  if (contentOptions.includeTutorial) {
    prompt += '\n- 단계별 튜토리얼 형식';
  }
  if (contentOptions.includeComparison) {
    prompt += '\n- 장단점 비교';
  }
  if (contentOptions.includeUseCases) {
    prompt += '\n- 실무 활용 사례';
  }
  if (contentOptions.includeReferences) {
    prompt += '\n- 참고 자료 링크';
  }

  prompt += `

**출력 형식**:
마크다운 형식으로 작성하되, 다음 구조를 따라주세요:
1. 제목 (# 헤더)
2. 서론 (문제 제기 또는 주제 소개)
3. 본문 (2-4개의 주요 섹션, ## 헤더 사용)
4. 결론 (핵심 요약 및 다음 단계)`;

  if (contentOptions.includeReferences) {
    prompt += '\n5. 참고 자료';
  }

  return prompt;
}
```

### 스트리밍 처리
```javascript
// hooks/useStreamResponse.js
import { useState, useCallback } from 'react';

export function useStreamResponse() {
  const [streamedContent, setStreamedContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = useCallback(async (apiCall) => {
    setIsStreaming(true);
    setStreamedContent('');

    try {
      await apiCall((chunk) => {
        setStreamedContent(prev => prev + chunk);
      });
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const resetStream = useCallback(() => {
    setStreamedContent('');
    setIsStreaming(false);
  }, []);

  return {
    streamedContent,
    isStreaming,
    startStream,
    resetStream
  };
}
```

### 에러 처리
```javascript
// utils/api.js
export async function callClaudeAPI(prompt, options = {}) {
  const { onChunk, signal } = options;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
        stream: true
      }),
      signal // AbortController signal for cancellation
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('API 키가 유효하지 않습니다.');
      } else if (response.status === 429) {
        throw new Error('API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else if (response.status === 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      fullContent += chunk;

      if (onChunk) {
        onChunk(chunk);
      }
    }

    return fullContent;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('요청이 취소되었습니다.');
    }
    throw error;
  }
}
```

## 내보내기 기능

### 마크다운 내보내기
```javascript
// utils/export.js
export function exportToMarkdown(content, filename = 'blog-post.md') {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToHTML(markdownContent, filename = 'blog-post.html') {
  // react-markdown을 사용하여 HTML로 변환
  const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog Post</title>
  <style>
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
    }
    code {
      background: #f4f4f4;
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
    pre {
      background: #f4f4f4;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  ${markdownContent}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(content) {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
    return false;
  }
}
```

## LocalStorage 관리

```javascript
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'blog-drafts-history';
const MAX_HISTORY = 5;

export function useLocalStorage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse history:', error);
      }
    }
  }, []);

  const saveDraft = (draft) => {
    const newDraft = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...draft
    };

    const newHistory = [newDraft, ...history].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const deleteDraft = (id) => {
    const newHistory = history.filter(draft => draft.id !== id);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    saveDraft,
    deleteDraft,
    clearHistory
  };
}
```

## 코드 품질

### ESLint 규칙
```javascript
// .eslintrc.js
module.exports = {
  extends: ['react-app'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'warn',
    'react/prop-types': 'off', // PropTypes는 선택사항
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
```

### 주석 작성
```javascript
/**
 * Claude API를 호출하여 블로그 콘텐츠를 생성합니다
 * @param {Object} settings - 블로그 설정 객체
 * @param {Function} onChunk - 스트리밍 청크 콜백
 * @returns {Promise<string>} 생성된 마크다운 콘텐츠
 */
async function generateBlogContent(settings, onChunk) {
  // 구현...
}

// 복잡한 로직에는 설명 추가
// FIXME: API 재시도 로직 개선 필요
// TODO: 캐싱 기능 추가
```

## 성능 최적화

### React.memo 사용
```javascript
// 렌더링 최적화가 필요한 컴포넌트
import React from 'react';

const MarkdownPreview = React.memo(({ content }) => {
  return (
    <div className="markdown-preview">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
});

MarkdownPreview.displayName = 'MarkdownPreview';
```

### useMemo와 useCallback
```javascript
import { useMemo, useCallback } from 'react';

function BlogEditor({ content, onChange }) {
  // 비용이 큰 계산은 메모이제이션
  const wordCount = useMemo(() => {
    return content.split(/\s+/).filter(Boolean).length;
  }, [content]);

  // 콜백 안정화
  const handleChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div>
      <textarea value={content} onChange={handleChange} />
      <span>{wordCount} words</span>
    </div>
  );
}
```

## Git 커밋 메시지

```
feat: 블로그 설정 폼 컴포넌트 추가
fix: API 스트리밍 응답 파싱 오류 수정
style: Tailwind 클래스 정리 및 일관성 개선
refactor: useClaudeAPI 훅으로 API 로직 분리
docs: README에 설치 및 사용법 추가
perf: 마크다운 렌더링 메모이제이션 적용
test: 입력 검증 유틸리티 테스트 추가
```

## 체크리스트

프로젝트 완료 전 확인사항:
- [ ] 모든 입력 필드 검증 구현
- [ ] API 에러 처리 완료
- [ ] 로딩 상태 UI 구현
- [ ] 내보내기 기능 테스트
- [ ] LocalStorage 저장/불러오기 테스트
- [ ] 반응형 디자인 확인 (모바일, 태블릿, 데스크톱)
- [ ] 브라우저 호환성 테스트
- [ ] 접근성(a11y) 기본 요구사항 확인
- [ ] console.log 제거
- [ ] 불필요한 주석 정리
