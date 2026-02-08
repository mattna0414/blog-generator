// 마크다운 처리 유틸리티

/**
 * 마크다운에서 제목 추출
 * @param {string} markdown
 * @returns {string} 첫 번째 # 제목
 */
export function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '제목 없음';
}

/**
 * 마크다운에서 섹션 추출
 * @param {string} markdown
 * @returns {Array<{title: string, content: string, level: number}>}
 */
export function extractSections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let currentSection = null;

  lines.forEach(line => {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headerMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }

      currentSection = {
        level: headerMatch[1].length,
        title: headerMatch[2].trim(),
        content: line + '\n'
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * 단어 수 계산
 * @param {string} text
 * @returns {number}
 */
export function countWords(text) {
  // 한글, 영어 모두 고려
  const koreanChars = (text.match(/[가-힣]/g) || []).length;
  const englishWords = text
    .replace(/[가-힣]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0).length;

  return koreanChars + englishWords;
}

/**
 * 글자 수 계산 (공백 제외)
 * @param {string} text
 * @returns {number}
 */
export function countCharacters(text) {
  return text.replace(/\s/g, '').length;
}

/**
 * 예상 읽기 시간 계산 (분)
 * @param {string} text
 * @returns {number}
 */
export function estimateReadingTime(text) {
  const words = countWords(text);
  const wordsPerMinute = 200; // 평균 읽기 속도
  return Math.ceil(words / wordsPerMinute);
}

/**
 * 코드 블록 개수 세기
 * @param {string} markdown
 * @returns {number}
 */
export function countCodeBlocks(markdown) {
  const matches = markdown.match(/```[\s\S]*?```/g);
  return matches ? matches.length : 0;
}

/**
 * 링크 추출
 * @param {string} markdown
 * @returns {Array<{text: string, url: string}>}
 */
export function extractLinks(markdown) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(markdown)) !== null) {
    links.push({
      text: match[1],
      url: match[2]
    });
  }

  return links;
}

/**
 * 마크다운 목차 생성
 * @param {string} markdown
 * @returns {string} 목차 마크다운
 */
export function generateTableOfContents(markdown) {
  const sections = extractSections(markdown);
  const toc = ['## 목차\n'];

  sections.forEach(section => {
    if (section.level >= 2 && section.level <= 3) {
      const indent = '  '.repeat(section.level - 2);
      const link = section.title.toLowerCase().replace(/\s+/g, '-');
      toc.push(`${indent}- [${section.title}](#${link})`);
    }
  });

  return toc.join('\n');
}

/**
 * 마크다운 메타데이터 추출
 * @param {string} markdown
 * @returns {Object} 메타데이터
 */
export function extractMetadata(markdown) {
  return {
    title: extractTitle(markdown),
    wordCount: countWords(markdown),
    characterCount: countCharacters(markdown),
    readingTime: estimateReadingTime(markdown),
    codeBlockCount: countCodeBlocks(markdown),
    linkCount: extractLinks(markdown).length,
    sectionCount: extractSections(markdown).length
  };
}
