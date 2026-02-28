'use client';

import { useRef, useEffect } from 'react';

/**
 * フルHTML記事をレンダリングし、含まれる<script>タグを
 * クライアントサイドナビゲーション時にも実行するコンポーネント。
 *
 * dangerouslySetInnerHTML ではNext.jsのSPA遷移時に<script>が
 * 実行されないため、useEffectで手動実行する。
 */
export default function FullHtmlArticle({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // dangerouslySetInnerHTML で挿入済みの <script> タグを取得
    const scripts = container.querySelectorAll('script');
    scripts.forEach((originalScript) => {
      // 新しい <script> 要素を作成して DOM に挿入し直すことで実行させる
      const newScript = document.createElement('script');
      // 属性をコピー
      Array.from(originalScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      // インラインスクリプトのテキストをコピー
      newScript.textContent = originalScript.textContent;
      originalScript.parentNode?.replaceChild(newScript, originalScript);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: '100vh' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
