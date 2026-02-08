// 입력 검증 유틸리티
import { VALIDATION } from '../constants/config';

/**
 * 블로그 설정 검증
 * @param {Object} settings - 블로그 설정 객체
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateBlogSettings(settings) {
  const errors = {};

  // 주제 검증
  if (!settings.topic || settings.topic.trim().length === 0) {
    errors.topic = '주제를 입력해주세요.';
  } else if (settings.topic.length < VALIDATION.MIN_TOPIC_LENGTH) {
    errors.topic = `주제는 최소 ${VALIDATION.MIN_TOPIC_LENGTH}자 이상이어야 합니다.`;
  } else if (settings.topic.length > VALIDATION.MAX_TOPIC_LENGTH) {
    errors.topic = `주제는 최대 ${VALIDATION.MAX_TOPIC_LENGTH}자까지 입력 가능합니다.`;
  }

  // 부제목 검증
  if (settings.subtitle && settings.subtitle.length > VALIDATION.MAX_SUBTITLE_LENGTH) {
    errors.subtitle = `부제목은 최대 ${VALIDATION.MAX_SUBTITLE_LENGTH}자까지 입력 가능합니다.`;
  }

  // 추가 요청사항 검증
  if (settings.notes && settings.notes.length > VALIDATION.MAX_NOTES_LENGTH) {
    errors.notes = `추가 요청사항은 최대 ${VALIDATION.MAX_NOTES_LENGTH}자까지 입력 가능합니다.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * 이메일 형식 검증
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * URL 형식 검증
 * @param {string} url
 * @returns {boolean}
 */
export function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 문자열 sanitize (XSS 방지)
 * @param {string} str
 * @returns {string}
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';

  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * 파일 이름 sanitize
 * @param {string} filename
 * @returns {string}
 */
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9가-힣\s\-_.]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
}
