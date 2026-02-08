# 기술 블로그 초안 자동 생성 웹페이지 개발 계획서

## 프로젝트 개요
사용자가 주제와 옵션을 입력하면 Claude API가 자동으로 완성도 높은 기술 블로그 초안을 생성해주는 웹 애플리케이션

## 핵심 기능

### 1. 블로그 설정 입력 폼
**기본 정보**
- 블로그 주제/제목 (필수)
- 부제목 또는 간단한 설명 (선택)

**스타일 옵션**
- 글 길이: 짧게(~1000자) / 보통(~2000자) / 길게(~3000자 이상)
- 난이도: 입문자용 / 중급 개발자용 / 고급/전문가용
- 톤: 친근하고 대화체 / 전문적이고 공식적 / 중립적

**콘텐츠 요소 선택** (다중 선택 가능)
- [ ] 코드 예제 포함
- [ ] 다이어그램/시각자료 설명
- [ ] 단계별 튜토리얼 형식
- [ ] 장단점 비교
- [ ] 실무 활용 사례
- [ ] 참고 자료 링크

**추가 옵션**
- 대상 독자층 지정
- 특정 프레임워크/기술 스택 명시
- 피해야 할 내용이나 주의사항

### 2. AI 자동 생성
- Claude Sonnet 4.5 API를 활용한 전체 블로그 글 생성
- 스트리밍 응답으로 실시간 작성 과정 표시
- 진행 상황 표시 (제목 작성 중 → 서론 작성 중 → 본문 작성 중...)
- 취소 기능

### 3. 결과 화면
**좌측: 마크다운 소스**
- 생성된 마크다운 텍스트
- 편집 가능한 텍스트 에디어
- 섹션별 재생성 버튼

**우측: 실시간 미리보기**
- 마크다운 렌더링 결과
- 코드 하이라이팅
- 반응형 미리보기

### 4. 수정 및 개선
- 전체 재생성 (새로운 버전)
- 특정 섹션만 재작성
- 길이 조정 요청
- 톤 변경 요청

### 5. 내보내기 및 저장
- 마크다운(.md) 파일 다운로드
- HTML 파일 다운로드
- 클립보드에 복사
- 로컬 스토리지에 임시 저장
- 생성 히스토리 관리 (최근 5개)

## 기술 스택

### Frontend
- **React 18+**: UI 프레임워크
- **Tailwind CSS**: 스타일링
- **Lucide React**: 아이콘
- **react-markdown**: 마크다운 렌더링
- **react-syntax-highlighter**: 코드 하이라이팅

### API
- **Claude API**: 콘텐츠 생성
- **Fetch API**: 스트리밍 처리

### 상태 관리
- React Hooks (useState, useReducer, useContext)
- LocalStorage for 히스토리

## 개발 단계

### Phase 1: 기본 UI 구축 (1-2일)
- [ ] 프로젝트 초기 설정 (Vite + React)
- [ ] Tailwind CSS 설정
- [ ] 기본 레이아웃 구성
- [ ] 입력 폼 컴포넌트 작성
- [ ] 옵션 선택 UI 구현

### Phase 2: API 연동 (2-3일)
- [ ] Claude API 통합
- [ ] 스트리밍 응답 처리 로직
- [ ] 프롬프트 엔지니어링
- [ ] 에러 핸들링
- [ ] 로딩 상태 관리

### Phase 3: 결과 표시 및 편집 (2일)
- [ ] 마크다운 에디터 구현
- [ ] 실시간 미리보기
- [ ] 코드 하이라이팅 적용
- [ ] 섹션별 재생성 기능

### Phase 4: 내보내기 및 저장 (1일)
- [ ] 파일 다운로드 기능
- [ ] 클립보드 복사
- [ ] LocalStorage 저장/불러오기
- [ ] 히스토리 관리

### Phase 5: 최적화 및 마무리 (1일)
- [ ] 반응형 디자인 개선
- [ ] 성능 최적화
- [ ] 사용자 가이드 추가
- [ ] 버그 수정

## 주요 컴포넌트 구조

```
App
├── Header
│   ├── Logo
│   └── SavedDraftsButton
├── MainContainer
│   ├── InputSection (생성 전)
│   │   ├── BlogSettingsForm
│   │   │   ├── TopicInput
│   │   │   ├── LengthSelector
│   │   │   ├── DifficultySelector
│   │   │   ├── ToneSelector
│   │   │   └── ContentOptionsCheckboxes
│   │   └── GenerateButton
│   │
│   └── ResultSection (생성 후)
│       ├── EditorPanel
│       │   ├── MarkdownEditor
│       │   ├── SectionActions (재생성 버튼들)
│       │   └── EditToolbar
│       ├── PreviewPanel
│       │   └── MarkdownPreview (react-markdown)
│       └── ActionBar
│           ├── RegenerateButton
│           ├── ExportDropdown
│           └── SaveButton
└── Footer
    └── HistoryDrawer
```

## 데이터 모델

### BlogSettings (입력 폼)
```javascript
{
  topic: string,              // "React 성능 최적화 기법"
  subtitle: string,           // optional
  length: 'short' | 'medium' | 'long',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  tone: 'casual' | 'professional' | 'neutral',
  contentOptions: {
    includeCode: boolean,
    includeDiagrams: boolean,
    includeTutorial: boolean,
    includeComparison: boolean,
    includeUseCases: boolean,
    includeReferences: boolean
  },
  targetAudience: string,     // optional
  techStack: string[],        // optional
  notes: string               // optional
}
```

### GeneratedBlog
```javascript
{
  id: string,
  createdAt: timestamp,
  settings: BlogSettings,
  content: string,            // 마크다운 텍스트
  metadata: {
    wordCount: number,
    generationTime: number,
    model: string
  }
}
```

### History
```javascript
{
  drafts: GeneratedBlog[],    // 최대 5개
  lastAccessed: timestamp
}
```

## AI 프롬프트 전략

### 메인 생성 프롬프트 구조
```
당신은 전문 기술 블로그 작가입니다. 다음 요구사항에 맞춰 기술 블로그 글을 작성해주세요.

**주제**: {topic}
**부제**: {subtitle}
**글 길이**: {length에 따른 목표 글자 수}
**난이도**: {difficulty}
**톤**: {tone}

**포함해야 할 요소**:
{contentOptions에서 선택된 항목들}

**추가 요구사항**:
- 대상 독자: {targetAudience}
- 기술 스택: {techStack}
- 기타 참고사항: {notes}

**출력 형식**:
마크다운 형식으로 작성하되, 다음 구조를 따라주세요:
1. 제목 (# 헤더)
2. 서론 (문제 제기 또는 주제 소개)
3. 본문 (2-4개의 주요 섹션, ## 헤더 사용)
4. 결론 (핵심 요약 및 다음 단계)
5. 참고 자료 (선택한 경우)

코드 예제가 필요한 경우 실제 동작하는 코드를 포함해주세요.
```

### 섹션 재생성 프롬프트
```
다음 블로그 글에서 "{section_title}" 섹션만 다시 작성해주세요.

**전체 맥락**:
{전체 블로그 내용}

**재작성 요청 섹션**: {section_title}
**재작성 이유**: {사용자가 입력한 이유 또는 자동}

원래 블로그의 톤과 스타일을 유지하면서 해당 섹션만 개선해주세요.
```

## 성능 고려사항

### API 호출 최적화
- 요청 debounce (연속 재생성 방지)
- 요청 취소 기능 (AbortController)
- 에러 시 재시도 로직 (최대 3회)

### UI 성능
- 마크다운 렌더링 메모이제이션
- 큰 텍스트 편집 시 debounce
- Virtual scrolling (긴 글의 경우)

### 저장 공간
- LocalStorage 5MB 제한 고려
- 오래된 히스토리 자동 삭제
- 압축 저장 고려 (선택)

## 에러 처리

### API 에러
- 네트워크 에러: 재시도 옵션 제공
- 인증 에러: API 키 확인 안내
- Rate limit: 대기 시간 표시
- 타임아웃: 길이 줄이기 제안

### 사용자 입력 에러
- 필수 필드 검증
- 글자 수 제한
- 부적절한 내용 필터링 (기본적인 수준)

## 향후 확장 기능
- [ ] 사용자 계정 시스템
- [ ] 클라우드 저장
- [ ] 템플릿 라이브러리
- [ ] SEO 점수 분석
- [ ] 다국어 블로그 생성
- [ ] 이미지 자동 생성 통합
- [ ] 블로그 플랫폼 직접 업로드 (Medium, Dev.to 등)
- [ ] 협업 기능
- [ ] 버전 관리

## 예상 프로젝트 타임라인
- **총 개발 기간**: 7-10일
- **MVP 완성**: 5일
- **테스트 및 개선**: 2-3일
- **배포 준비**: 1-2일
