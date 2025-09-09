import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/richtext.css';

const SimpleRichTextEditor = ({ value, onChange, disabled, className = '', rows = 2 }) => {
  const textareaRef = useRef(null);

  // Handle formatting actions
  const applyFormat = format => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText;
    let newCursorPos;

    switch (format) {
      case 'bold':
        if (selectedText) {
          newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
          newCursorPos = end + 4;
        } else {
          newText = value.substring(0, start) + '****' + value.substring(end);
          newCursorPos = start + 2;
        }
        break;
      case 'italic':
        if (selectedText) {
          newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
          newCursorPos = end + 2;
        } else {
          newText = value.substring(0, start) + '**' + value.substring(end);
          newCursorPos = start + 1;
        }
        break;
      case 'underline':
        if (selectedText) {
          newText = value.substring(0, start) + `__${selectedText}__` + value.substring(end);
          newCursorPos = end + 4;
        } else {
          newText = value.substring(0, start) + '____' + value.substring(end);
          newCursorPos = start + 2;
        }
        break;
      default:
        return;
    }

    onChange({ target: { value: newText } });

    // Set cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = e => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          applyFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          applyFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          applyFormat('underline');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <textarea
        ref={textareaRef}
        className={`border rounded text-sm ${className}`}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={rows}
      />
      <div className='format-toolbar'>
        <button
          type='button'
          title='Bold (Ctrl+B)'
          onClick={() => applyFormat('bold')}
          className='format-button'
          disabled={disabled}
        >
          <FontAwesomeIcon icon='fa-solid fa-bold' />
        </button>
        <button
          type='button'
          title='Italic (Ctrl+I)'
          onClick={() => applyFormat('italic')}
          className='format-button'
          disabled={disabled}
        >
          <FontAwesomeIcon icon='fa-solid fa-italic' />
        </button>
        <button
          type='button'
          title='Underline (Ctrl+U)'
          onClick={() => applyFormat('underline')}
          className='format-button'
          disabled={disabled}
        >
          <FontAwesomeIcon icon='fa-solid fa-underline' />
        </button>
      </div>
    </div>
  );
};

export default SimpleRichTextEditor;
