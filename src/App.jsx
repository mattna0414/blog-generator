import { useState } from 'react';
import { BlogProvider, useBlog } from './contexts/BlogContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MainContainer, TwoColumnLayout } from './components/layout/MainContainer';
import { BlogSettingsForm } from './components/forms/BlogSettingsForm';
import { GenerateButton } from './components/features/GenerateButton';
import { ProgressIndicator } from './components/features/ProgressIndicator';
import { ExportMenu } from './components/features/ExportMenu';
import { HistoryDrawer } from './components/features/HistoryDrawer';
import { MarkdownEditor } from './components/editor/MarkdownEditor';
import { MarkdownPreview } from './components/editor/MarkdownPreview';
import { EditorToolbar } from './components/editor/EditorToolbar';
import { useClaudeAPI } from './hooks/useClaudeAPI';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useMarkdownExport } from './hooks/useMarkdownExport';
import { validateBlogSettings } from './utils/validation';
import { buildBlogPrompt } from './utils/prompts';
import { hasValidAPIKey } from './utils/api';
import { AlertCircle } from 'lucide-react';

function AppContent() {
  const {
    settings,
    generatedContent,
    setGeneratedContent,
    isGenerating,
    setIsGenerating,
    error,
    setError,
    clearError,
    progress,
    setProgress
  } = useBlog();

  const { generate, cancel } = useClaudeAPI();
  const { saveDraft } = useLocalStorage();
  const { downloadMarkdown, downloadHTML, copyContent } = useMarkdownExport();

  const [validationErrors, setValidationErrors] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    console.log('Generate button clicked');
    clearError();
    setValidationErrors({});

    // 검증
    const validation = validateBlogSettings(settings);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    // API 키 확인
    if (!hasValidAPIKey(settings.aiProvider)) {
      const providerName = settings.aiProvider === 'gemini' ? 'Gemini' : 'Claude';
      const keyName = settings.aiProvider === 'gemini' ? 'VITE_GEMINI_API_KEY' : 'VITE_ANTHROPIC_API_KEY';
      setError(`${providerName} API 키가 설정되지 않았습니다. .env 파일에 ${keyName}를 설정해주세요.`);
      return;
    }

    setIsGenerating(true);
    setProgress('프롬프트 준비 중...');
    setGeneratedContent('');
    setShowResults(true);

    try {
      const prompt = buildBlogPrompt(settings);
      setProgress('블로그 글 생성 중...');

      const content = await generate(prompt, (chunk) => {
        setGeneratedContent(prev => prev + chunk);
      }, settings.aiProvider);

      // 생성 완료 후 히스토리에 저장
      saveDraft({
        settings,
        content,
        metadata: {
          generatedAt: new Date().toISOString()
        }
      });

      setProgress('');
    } catch (err) {
      console.error('Generation error:', err);
      if (err.message !== '요청이 취소되었습니다.') {
        setError(err.message || '블로그 생성 중 오류가 발생했습니다.');
      }
    } finally {
      setIsGenerating(false);
      setProgress('');
    }
  };

  const handleCancel = () => {
    cancel();
    setIsGenerating(false);
    setProgress('');
  };

  const handleLoadDraft = (draft) => {
    setGeneratedContent(draft.content);
    setShowResults(true);
  };

  const handleRegenerate = () => {
    console.log('ㅁㅁ');
    setShowResults(false);
    setGeneratedContent('');
    setTimeout(() => handleGenerate(), 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onShowHistory={() => setShowHistory(true)} />

      <MainContainer>
        {!showResults ? (
          // 입력 폼 섹션
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                블로그 설정
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-800 font-medium">오류</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <BlogSettingsForm errors={validationErrors} />

              <div className="mt-6 pt-6 border-t border-gray-200">
                <ProgressIndicator
                  message={progress}
                  isVisible={isGenerating}
                  provider={settings.aiProvider === 'gemini' ? 'Gemini' : 'Claude'}
                />

                <div className="mt-4">
                  <GenerateButton
                    onClick={handleGenerate}
                    onCancel={handleCancel}
                    isGenerating={isGenerating}
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 결과 표시 섹션
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                생성된 블로그 초안
              </h2>
              <div className="flex items-center space-x-3">
                <ExportMenu
                  onDownloadMd={() => downloadMarkdown(generatedContent, settings.topic)}
                  onDownloadHtml={() => downloadHTML(generatedContent, settings.topic)}
                  onCopy={() => copyContent(generatedContent)}
                  disabled={isGenerating || !generatedContent}
                />
                <GenerateButton
                  onClick={handleRegenerate}
                  onCancel={handleCancel}
                  isGenerating={isGenerating}
                  disabled={isGenerating}
                />
              </div>
            </div>

            {isGenerating && (
              <ProgressIndicator
                message={progress}
                isVisible={true}
                provider={settings.aiProvider === 'gemini' ? 'Gemini' : 'Claude'}
              />
            )}

            <TwoColumnLayout
              left={
                <div className="h-[calc(100vh-300px)] flex flex-col">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">마크다운 편집기</h3>
                  </div>
                  <MarkdownEditor
                    content={generatedContent}
                    onChange={setGeneratedContent}
                  />
                </div>
              }
              right={
                <div className="h-[calc(100vh-300px)] flex flex-col overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">미리보기</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <MarkdownPreview content={generatedContent} />
                  </div>
                </div>
              }
            />
          </div>
        )}
      </MainContainer>

      <Footer />

      <HistoryDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadDraft={handleLoadDraft}
      />
    </div>
  );
}

function App() {
  return (
    <BlogProvider>
      <AppContent />
    </BlogProvider>
  );
}

export default App;
