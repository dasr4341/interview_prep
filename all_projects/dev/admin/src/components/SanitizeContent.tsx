import React from 'react';
import createDOMPurify from 'dompurify';

export default function SanitizeContent({ html } : { html: any }) {

  const DOMPurify = createDOMPurify(window);

  const text = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: false },
  });

  return (
    <>{text}</>
  );
}
