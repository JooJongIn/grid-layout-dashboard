import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export function HtmlRenderer({ data, className }) {
  const [htmlContent, setHtmlContent] = useState('<p>HTML 콘텐츠를 로드 중입니다...</p>');

  useEffect(() => {
    if (data?.html) {
      setHtmlContent(data.html);
    } else if (typeof data === 'string' && data.trim().startsWith('<')) {
      setHtmlContent(data);
    } else {
      setHtmlContent('<p>표시할 HTML 콘텐츠가 없습니다.</p>');
    }
  }, [data]);
  
  return (
    <HtmlContainer 
      className={className}
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
    />
  );
}

const HtmlContainer = styled.div`
  width: 100%;
  height: 100%;
  word-break: break-word;
  overflow: auto;
`;
