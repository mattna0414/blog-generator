// 폼 옵션 상수 정의

export const LENGTH_OPTIONS = [
  { value: 'short', label: '짧게', description: '~1000자' },
  { value: 'medium', label: '보통', description: '~2000자' },
  { value: 'long', label: '길게', description: '~3000자 이상' }
];

export const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: '입문자용', description: '쉬운 설명과 기초 개념' },
  { value: 'intermediate', label: '중급 개발자용', description: '실용적인 내용과 예제' },
  { value: 'advanced', label: '고급/전문가용', description: '심화 내용과 최적화' }
];

export const TONE_OPTIONS = [
  { value: 'casual', label: '친근하고 대화체', description: '편안한 말투' },
  { value: 'professional', label: '전문적이고 공식적', description: '격식있는 문체' },
  { value: 'neutral', label: '중립적', description: '객관적인 톤' }
];

export const AI_PROVIDER_OPTIONS = [
  // { value: 'claude', label: 'Claude (Anthropic)', description: '고품질 장문 생성' },
  { value: 'gemini', label: 'Gemini (Google)', description: '무료 API 지원' }
];

export const CONTENT_OPTIONS = [
  { id: 'includeCode', label: '코드 예제 포함', description: '실제 동작하는 코드' },
  { id: 'includeDiagrams', label: '다이어그램/시각자료 설명', description: '구조와 흐름 설명' },
  { id: 'includeTutorial', label: '단계별 튜토리얼 형식', description: '따라하기 쉬운 단계' },
  { id: 'includeComparison', label: '장단점 비교', description: '다양한 접근법 비교' },
  { id: 'includeUseCases', label: '실무 활용 사례', description: '실제 프로젝트 예시' },
  { id: 'includeReferences', label: '참고 자료 링크', description: '추가 학습 자료' }
];

export const DEFAULT_SETTINGS = {
  topic: '',
  subtitle: '',
  length: 'medium',
  difficulty: 'intermediate',
  tone: 'neutral',
  aiProvider: 'gemini',
  contentOptions: {
    includeCode: false,
    includeDiagrams: false,
    includeTutorial: false,
    includeComparison: false,
    includeUseCases: false,
    includeReferences: false
  },
  targetAudience: '',
  techStack: '',
  notes: ''
};
