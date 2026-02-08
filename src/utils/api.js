// Claude API 호출 로직
import { API_CONFIG } from '../constants/config';

export async function generateContent(prompt, options = {}) {
  const { onChunk, onError, signal } = options;

  try {
    const response = await fetch(API_CONFIG.ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: API_CONFIG.MODEL,
        max_tokens: API_CONFIG.MAX_TOKENS,
        messages: [{ role: 'user', content: prompt }],
        stream: true
      }),
      signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(response.status, errorData.error?.message || `API Error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta') {
              const text = parsed.delta?.text || '';
              if (text) {
                fullContent += text;
                if (onChunk) onChunk(text);
              }
            }
          } catch (e) {}
        }
      }
    }

    return fullContent;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('요청이 취소되었습니다.');
    }
    if (onError) onError(error);
    throw error;
  }
}

export class APIError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }

  getUserMessage() {
    switch (this.status) {
      case 401: return 'API 키가 유효하지 않습니다.';
      case 429: return 'API 호출 한도를 초과했습니다.';
      case 500:
      case 502:
      case 503: return '서버 오류가 발생했습니다.';
      default: return this.message || 'API 호출 중 오류가 발생했습니다.';
    }
  }
}

export function hasValidAPIKey() {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  return !!(apiKey && apiKey.length > 0);
}
