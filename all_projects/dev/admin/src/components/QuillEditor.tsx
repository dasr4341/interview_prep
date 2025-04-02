/* eslint-disable react-hooks/exhaustive-deps */
import ReactQuill from 'react-quill';
import React, { useEffect, useRef } from 'react';

import 'react-quill/dist/quill.snow.css'; // Add css for snow theme
import '../scss/modules/_editor.scss';
import '../scss/components/_email-content.scss';


export default function QuillEditor({
  onChange,
  defaultValue,
  placeholder,
  className,
  theme,
  onBlur,
  onDropHandle
}: {
  onChange: (value: { html: string;  }) => void;
  onDropHandle?: any;
  defaultValue?: string;
  theme?: string;
  placeholder?: string;
  className?: string;
  onBlur?: () => void;
}): JSX.Element {
  const editor = useRef<any>();

  const modules = {
    toolbar: [['bold', 'italic', 'underline'], ['clean']],
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
  };

  useEffect(() => {
    if (defaultValue) {
      const delta = editor.current.editor.clipboard.convert(defaultValue);
      editor.current.editor.setContents(delta, 'silent');
    }
  }, [defaultValue]);

  return (
    <div
      className={`w-100 flex flex-col flex-1 email-content ${className}`}
      onDrop={(ev) => {
        ev.preventDefault();
        const data = ev.dataTransfer.getData('text');
        const selection = editor.current.editor?.getSelection(true);
        editor.current.editor?.insertText(selection?.index || 0, data);
        if (onDropHandle) {
          onDropHandle();
        }
      }}>
      <ReactQuill
        ref={editor as unknown as any}
        theme={theme ? theme : 'snow'}
        modules={{ ...modules }}
        onBlur={() => onBlur && onBlur()}
        onChange={() => {
          if (editor.current.editor) {
            const html = editor.current.editor.root.innerHTML;
            onChange({ html });
          }
        }}
        placeholder={placeholder}
      />
    </div>
  );
}
