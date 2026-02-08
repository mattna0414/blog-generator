// AI API 호출 로직 (Claude & Gemini)
import { API_CONFIG } from '../constants/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateContent(prompt, options = {}) {
  const { onChunk, onError, signal, provider = 'gemini' } = options;

  if (provider === 'gemini') {
    return generateWithGemini(prompt, { onChunk, onError, signal });
  }
  return generateWithClaude(prompt, { onChunk, onError, signal });
}

async function generateWithClaude(prompt, { onChunk, onError, signal }) {
  try {
    const response = await fetch(API_CONFIG.ANTHROPIC.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: API_CONFIG.ANTHROPIC.MODEL,
        max_tokens: API_CONFIG.ANTHROPIC.MAX_TOKENS,
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

async function generateWithGemini(prompt, { onChunk, onError, signal }) {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new APIError(401, 'Gemini API 키가 설정되지 않았습니다.');
    }

    // Initialize Google Generative AI with official SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: API_CONFIG.GEMINI.TEMPERATURE,
        maxOutputTokens: API_CONFIG.GEMINI.MAX_TOKENS
      }
    });

    // Handle abort signal
    let aborted = false;
    if (signal) {
      signal.addEventListener('abort', () => {
        aborted = true;
      });
    }

    // Stream generate content
    const result = await model.generateContentStream(prompt);
    let fullContent = '';

    for await (const chunk of result.stream) {
      if (aborted) {
        throw new Error('요청이 취소되었습니다.');
      }

      const text = chunk.text();
      if (text) {
        fullContent += text;
        if (onChunk) onChunk(text);
      }
    }

    return fullContent;
  } catch (error) {
    if (error.message === '요청이 취소되었습니다.' || error.name === 'AbortError') {
      throw new Error('요청이 취소되었습니다.');
    }

    // Handle Gemini API errors
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
      throw new APIError(401, 'Gemini API 키가 유효하지 않습니다.');
    }

    if (onError) onError(error);
    throw new Error(error.message || 'Gemini API 호출 중 오류가 발생했습니다.');
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

export function hasValidAPIKey(provider = 'gemini') {
  if (provider === 'gemini') {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    return !!(apiKey && apiKey.length > 0);
  }
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  return !!(apiKey && apiKey.length > 0);
}
