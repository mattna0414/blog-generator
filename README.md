# 기술 블로그 초안 생성기

Claude AI를 활용하여 완성도 높은 기술 블로그 글을 자동으로 생성하는 웹 애플리케이션입니다.

## 주요 기능

- 🤖 Claude API를 통한 고품질 기술 블로그 자동 생성
- ⚡ 실시간 스트리밍으로 생성 과정 확인
- ✏️ 생성된 마크다운 편집 및 실시간 미리보기
- 💾 로컬 스토리지를 통한 히스토리 관리 (최근 5개)
- 📥 마크다운(.md) 및 HTML 파일 다운로드
- 📋 클립보드 복사 기능
- 🎨 반응형 디자인

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 Claude API 키를 설정하세요:

```bash
cp .env.example .env
```

`.env` 파일 편집:

```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

API 키는 [Anthropic Console](https://console.anthropic.com/)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 으로 접속하세요.

### 4. 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 사용 방법

1. **블로그 주제 입력**: 작성하고 싶은 기술 블로그의 주제를 입력하세요
2. **옵션 선택**: 
   - 글 길이 (짧게/보통/길게)
   - 난이도 (입문자용/중급/고급)
   - 문체 톤 (친근함/전문적/중립적)
   - 포함할 콘텐츠 요소 (코드 예제, 다이어그램, 튜토리얼 등)
3. **생성**: "블로그 초안 생성하기" 버튼을 클릭
4. **편집 및 미리보기**: 생성된 마크다운을 편집하고 실시간으로 미리보기
5. **내보내기**: 마크다운 또는 HTML 파일로 다운로드하거나 클립보드에 복사

## 기술 스택

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Markdown**: react-markdown + react-syntax-highlighter
- **Icons**: Lucide React
- **API**: Claude Sonnet 4 (Anthropic API)

## 프로젝트 구조

```
src/
├── components/
│   ├── forms/          # 입력 폼 컴포넌트
│   ├── editor/         # 마크다운 에디터 및 미리보기
│   ├── layout/         # 레이아웃 컴포넌트
│   ├── ui/             # 재사용 가능한 UI 컴포넌트
│   └── features/       # 주요 기능 컴포넌트
├── hooks/              # 커스텀 React 훅
├── utils/              # 유틸리티 함수
├── constants/          # 상수 및 설정
├── contexts/           # React Context
├── App.jsx
└── main.jsx
```

## 라이선스

MIT License

## 기여

이슈 제기나 풀 리퀘스트는 언제든지 환영합니다!
