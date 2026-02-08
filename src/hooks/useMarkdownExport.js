import { useCallback, useState } from 'react';
import { exportToMarkdown, exportToHTML, copyToClipboard, generateFilenameFromTopic } from '../utils/export';

export function useMarkdownExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const downloadMarkdown = useCallback(async (content, topic = '') => {
    setIsExporting(true);
    setExportError(null);

    try {
      const filename = topic ? generateFilenameFromTopic(topic) : 'blog-post';
      exportToMarkdown(content, filename);
      return true;
    } catch (error) {
      console.error('Markdown export error:', error);
      setExportError('마크다운 파일 다운로드에 실패했습니다.');
      return false;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const downloadHTML = useCallback(async (content, topic = '') => {
    setIsExporting(true);
    setExportError(null);

    try {
      const filename = topic ? generateFilenameFromTopic(topic) : 'blog-post';
      exportToHTML(content, filename);
      return true;
    } catch (error) {
      console.error('HTML export error:', error);
      setExportError('HTML 파일 다운로드에 실패했습니다.');
      return false;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const copyContent = useCallback(async (content) => {
    setIsExporting(true);
    setExportError(null);

    try {
      const success = await copyToClipboard(content);
      if (!success) {
        setExportError('클립보드 복사에 실패했습니다.');
      }
      return success;
    } catch (error) {
      console.error('Copy error:', error);
      setExportError('클립보드 복사에 실패했습니다.');
      return false;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    downloadMarkdown,
    downloadHTML,
    copyContent,
    isExporting,
    exportError,
    clearExportError: () => setExportError(null)
  };
}
