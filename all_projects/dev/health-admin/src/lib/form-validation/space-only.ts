import createDOMPurify from 'dompurify';

export  function SpaceOnly(value: string)  {
  const DOMPurify = createDOMPurify(window);

  const text = DOMPurify.sanitize(value, {
    USE_PROFILES: { html: false },
  });

  if (text.trim().length) {
    return value;
  }

  return null;
}

export default SpaceOnly;
