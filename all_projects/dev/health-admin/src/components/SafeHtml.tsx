import React, { useEffect, useState } from 'react';
import createDOMPurify from 'dompurify';
import Humanize from 'humanize-plus';


export default function SafeHtml({
  rawHtml,
  className,
  truncate,
  id
}: {
  rawHtml: string;
  className?: string;
  truncate?: number;
  id?: string;
}) {
  const [html, setHtml] = useState<any>('');

  useEffect(() => {
    const DOMPurify = createDOMPurify(window);
    if (rawHtml) {
      let formatHtml: any = DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: truncate ? false : true },
      });
      if (truncate) {
        formatHtml = Humanize.truncate(formatHtml, 100, ' ...');
      }
      setHtml(formatHtml);
    }

    
    // 
  }, [window, rawHtml]);

  return (
    <div
      className={`${className ? className : ''}`}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
      data-test-id={id}></div>
  );
}
