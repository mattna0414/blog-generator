// 파일 다운로드 및 클립보드 복사 유틸리티
import { sanitizeFilename } from './validation';

/**
 * 마크다운 파일로 다운로드
 * @param {string} content - 마크다운 콘텐츠
 * @param {string} filename - 파일명 (기본값: 'blog-post.md')
 */
export function exportToMarkdown(content, filename = 'blog-post.md') {
  const sanitizedFilename = sanitizeFilename(filename);
  const finalFilename = sanitizedFilename.endsWith('.md')
    ? sanitizedFilename
    : `${sanitizedFilename}.md`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  downloadBlob(blob, finalFilename);
}

/**
 * HTML 파일로 다운로드
 * @param {string} markdownContent - 마크다운 콘텐츠
 * @param {string} filename - 파일명 (기본값: 'blog-post.html')
 */
export function exportToHTML(markdownContent, filename = 'blog-post.html') {
  const sanitizedFilename = sanitizeFilename(filename);
  const finalFilename = sanitizedFilename.endsWith('.html')
    ? sanitizedFilename
    : `${sanitizedFilename}.html`;

  // 간단한 마크다운을 HTML로 변환
  const htmlContent = markdownToSimpleHTML(markdownContent);

  const fullHTML = `<!DOCTYPE html>
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      border-bottom: 3px solid #333;
      padding-bottom: 0.5rem;
    }
    h2 {
      font-size: 2rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid #666;
      padding-bottom: 0.3rem;
    }
    h3 {
      font-size: 1.5rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    p {
      margin-bottom: 1rem;
    }
    code {
      background: #f4f4f4;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
    }
    pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
      margin-bottom: 1rem;
    }
    pre code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
    ul, ol {
      margin-bottom: 1rem;
      padding-left: 2rem;
    }
    li {
      margin-bottom: 0.5rem;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 1rem;
      margin-left: 0;
      color: #666;
      font-style: italic;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, finalFilename);
}

/**
 * 클립보드에 복사
 * @param {string} content - 복사할 콘텐츠
 * @returns {Promise<boolean>} 성공 여부
 */
export async function copyToClipboard(content) {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('클립보드 복사 실패:', error);

    // Fallback: textarea 사용
    try {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (fallbackError) {
      console.error('Fallback 복사도 실패:', fallbackError);
      return false;
    }
  }
}

/**
 * Blob을 파일로 다운로드
 * @param {Blob} blob
 * @param {string} filename
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * 간단한 마크다운을 HTML로 변환
 * @param {string} markdown
 * @returns {string}
 */
function markdownToSimpleHTML(markdown) {
  let html = markdown;

  // 코드 블록 (```)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // 인라인 코드 (`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 헤더
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 볼드
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 이탤릭
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 링크
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 리스트
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // 번호 리스트
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

  // 단락
  html = html.split('\n\n').map(para => {
    if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<pre')) {
      return para;
    }
    return `<p>${para}</p>`;
  }).join('\n');

  return html;
}

/**
 * HTML 이스케이프
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 주제로부터 파일명 생성
 * @param {string} topic
 * @returns {string}
 */
export function generateFilenameFromTopic(topic) {
  return sanitizeFilename(topic) || 'blog-post';
}
