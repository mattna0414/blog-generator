// AI 프롬프트 템플릿

/**
 * 블로그 생성을 위한 프롬프트 구축
 * @param {Object} settings - 블로그 설정 객체
 * @returns {string} 생성된 프롬프트
 */
export function buildBlogPrompt(settings) {
  const { topic, subtitle, length, difficulty, tone, contentOptions, targetAudience, techStack, notes } = settings;

  const lengthMapping = {
    short: '약 1000자 정도의 간결한 글',
    medium: '약 2000자 정도의 적당한 길이',
    long: '약 3000자 이상의 상세한 글'
  };

  const toneMapping = {
    casual: '친근하고 대화체의 편안한 톤',
    professional: '전문적이고 공식적인 격식있는 톤',
    neutral: '중립적이고 객관적인 톤'
  };

  const difficultyMapping = {
    beginner: '입문자를 위한 쉬운 설명과 기초 개념 중심',
    intermediate: '중급 개발자를 위한 실용적인 내용과 실전 예제',
    advanced: '고급 개발자를 위한 심화 내용과 최적화 기법'
  };

  let prompt = `당신은 전문 기술 블로그 작가입니다. 다음 요구사항에 맞춰 완성도 높은 기술 블로그 글을 마크다운 형식으로 작성해주세요.

**주제**: ${topic}`;

  if (subtitle) {
    prompt += `\n**부제**: ${subtitle}`;
  }

  prompt += `

**글 길이**: ${lengthMapping[length]}
**난이도**: ${difficultyMapping[difficulty]}
**문체 톤**: ${toneMapping[tone]}`;

  // 콘텐츠 옵션 추가
  const selectedOptions = [];
  if (contentOptions.includeCode) selectedOptions.push('실제 동작하는 코드 예제');
  if (contentOptions.includeDiagrams) selectedOptions.push('다이어그램이나 시각자료에 대한 설명');
  if (contentOptions.includeTutorial) selectedOptions.push('단계별 튜토리얼 형식');
  if (contentOptions.includeComparison) selectedOptions.push('장단점 비교 분석');
  if (contentOptions.includeUseCases) selectedOptions.push('실무 활용 사례');
  if (contentOptions.includeReferences) selectedOptions.push('참고 자료 링크');

  if (selectedOptions.length > 0) {
    prompt += `\n\n**포함해야 할 요소**:\n${selectedOptions.map(opt => `- ${opt}`).join('\n')}`;
  }

  // 추가 요구사항
  if (targetAudience) {
    prompt += `\n\n**대상 독자**: ${targetAudience}`;
  }

  if (techStack) {
    prompt += `\n**사용 기술 스택**: ${techStack}`;
  }

  if (notes) {
    prompt += `\n**추가 요청사항**: ${notes}`;
  }

  prompt += `

**출력 형식**:
마크다운 형식으로 작성하되, 다음 구조를 따라주세요:

1. **제목** (# 헤더 1개만)
2. **서론** (문제 제기 또는 주제 소개, 2-3 문단)
3. **본문** (2-4개의 주요 섹션, ## 헤더 사용)
   - 각 섹션은 명확한 제목과 함께
   - 코드 예제는 언어를 명시한 코드 블록 사용
   - 필요시 ### 소제목 활용
4. **결론** (핵심 내용 요약 및 다음 단계 제안)`;

  if (contentOptions.includeReferences) {
    prompt += `\n5. **참고 자료** (관련 문서, 튜토리얼, 공식 문서 등의 링크)`;
  }

  prompt += `

**작성 가이드라인**:
- 명확하고 이해하기 쉬운 설명
- 실용적이고 적용 가능한 내용
- 적절한 예제와 설명
- 마크다운 문법을 정확히 사용
- 코드 블록에는 언어 이름 명시 (예: \`\`\`javascript)

이제 위 요구사항에 맞춰 완성도 높은 기술 블로그 글을 작성해주세요.`;

  return prompt;
}

/**
 * 섹션 재생성을 위한 프롬프트 구축
 * @param {string} fullContent - 전체 블로그 내용
 * @param {string} sectionTitle - 재작성할 섹션 제목
 * @param {string} reason - 재작성 이유
 * @returns {string} 생성된 프롬프트
 */
export function buildSectionRegeneratePrompt(fullContent, sectionTitle, reason = '') {
  let prompt = `다음은 작성된 기술 블로그 글입니다:

${fullContent}

---

이 블로그 글에서 "${sectionTitle}" 섹션만 다시 작성해주세요.`;

  if (reason) {
    prompt += `\n\n**재작성 이유**: ${reason}`;
  }

  prompt += `

**요구사항**:
- 원래 블로그의 톤과 스타일을 유지
- 전체 맥락과 자연스럽게 연결
- 다른 섹션과의 일관성 유지
- 마크다운 형식 사용

재작성된 "${sectionTitle}" 섹션만 출력해주세요 (섹션 제목 포함).`;

  return prompt;
}

/**
 * 길이 조정을 위한 프롬프트 구축
 * @param {string} content - 원본 내용
 * @param {string} direction - 'shorter' 또는 'longer'
 * @returns {string} 생성된 프롬프트
 */
export function buildLengthAdjustPrompt(content, direction) {
  const action = direction === 'shorter' ? '더 간결하게 요약' : '더 상세하게 확장';

  return `다음 기술 블로그 글을 ${action}해주세요:

${content}

---

**요구사항**:
- 핵심 내용과 의미는 유지
- 원본의 톤과 스타일 유지
- 마크다운 형식 유지
- ${direction === 'shorter' ? '불필요한 반복 제거, 핵심만 남기기' : '추가 설명, 예제, 세부사항 보강'}

조정된 전체 글을 출력해주세요.`;
}

/**
 * 톤 변경을 위한 프롬프트 구축
 * @param {string} content - 원본 내용
 * @param {string} newTone - 새로운 톤 ('casual', 'professional', 'neutral')
 * @returns {string} 생성된 프롬프트
 */
export function buildToneChangePrompt(content, newTone) {
  const toneDescriptions = {
    casual: '친근하고 대화체의 편안한 톤',
    professional: '전문적이고 공식적인 격식있는 톤',
    neutral: '중립적이고 객관적인 톤'
  };

  return `다음 기술 블로그 글의 톤을 "${toneDescriptions[newTone]}"으로 변경해주세요:

${content}

---

**요구사항**:
- 내용과 구조는 그대로 유지
- 문체와 표현만 새로운 톤에 맞게 조정
- 마크다운 형식 유지
- 기술적 정확성 유지

톤이 변경된 전체 글을 출력해주세요.`;
}
