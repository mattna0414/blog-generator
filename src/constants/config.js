// 앱 설정 상수

export const API_CONFIG = {
  ANTHROPIC: {
    API_URL: 'https://api.anthropic.com/v1/messages',
    MODEL: 'claude-sonnet-4-20250514',
    MAX_TOKENS: 4000,
    TEMPERATURE: 1.0
  },
  GEMINI: {
    // MODEL: 'gemini-1.5-flash-latest',
    MODEL: 'gemini-2.5-flash-lite',
    MAX_TOKENS: 8000,
    TEMPERATURE: 1.0
  }
};

export const STORAGE_CONFIG = {
  STORAGE_KEY: 'blog-drafts-history',
  MAX_HISTORY: 5
};

export const UI_CONFIG = {
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000
};

export const VALIDATION = {
  MIN_TOPIC_LENGTH: 5,
  MAX_TOPIC_LENGTH: 200,
  MAX_SUBTITLE_LENGTH: 300,
  MAX_NOTES_LENGTH: 1000
};

export const APP_INFO = {
  NAME: '기술 블로그 초안 생성기',
  VERSION: '1.0.0',
  DESCRIPTION: 'Claude AI를 활용한 기술 블로그 자동 생성 도구'
};
