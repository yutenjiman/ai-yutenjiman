import { marked } from 'marked';
import React from 'react';

export function formatResponse(response: unknown): React.ReactElement {
  if (!response) {
    return React.createElement('div', null, '応答がありません。');
  }
  
  let content: string;
  if (typeof response === 'string') {
    content = response;
  } else if (typeof response === 'object') {
    content = JSON.stringify(response, null, 2);
  } else {
    content = String(response);
  }
  
  // 改行をマークダウンの改行として処理する
  const html = marked(content, { breaks: true });
  return React.createElement('div', {
    className: 'markdown-content',
    dangerouslySetInnerHTML: { __html: html }
  });
}