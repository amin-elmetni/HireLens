import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EmojiPicker from 'emoji-picker-react';
import '../../styles/richtext.css';

const RichTextCommentInput = ({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = 'Add comment...',
}) => {
  const textareaRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

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

    onChange(newText);

    // Set cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Handle emoji selection
  const onEmojiClick = emojiData => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = value.substring(0, start) + emojiData.emoji + value.substring(end);

    onChange(newText);
    setShowEmojiPicker(false);

    // Set cursor position after emoji
    setTimeout(() => {
      const newPos = start + emojiData.emoji.length;
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // Handle cursor position tracking
  const handleSelectionChange = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      setCursorPosition(textarea.selectionStart);
    }
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

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(e);
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className='bg-gray-100 rounded-xl p-4 mb-8 shadow-sm'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-1'
      >
        <div className='relative'>
          <textarea
            ref={textareaRef}
            className='w-full border-none h-16 bg-transparent resize-none text-base p-0 focus:outline-none'
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onSelect={handleSelectionChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={2}
          />
          {showEmojiPicker && (
            <div className='emoji-picker-container absolute top-full left-0 z-50 mt-2'>
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={320}
                height={400}
              />
            </div>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex gap-1 text-gray-500'>
            <button
              type='button'
              title='Bold (Ctrl+B)'
              onClick={() => applyFormat('bold')}
              className='rounded-full hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center cursor-pointer w-8 h-8 transition-colors'
              disabled={disabled}
            >
              <FontAwesomeIcon icon='fa-solid fa-bold' />
            </button>
            <button
              type='button'
              title='Italic (Ctrl+I)'
              onClick={() => applyFormat('italic')}
              className='rounded-full hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center cursor-pointer w-8 h-8 transition-colors'
              disabled={disabled}
            >
              <FontAwesomeIcon icon='fa-solid fa-italic' />
            </button>
            <button
              type='button'
              title='Underline (Ctrl+U)'
              onClick={() => applyFormat('underline')}
              className='rounded-full hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center cursor-pointer w-8 h-8 transition-colors'
              disabled={disabled}
            >
              <FontAwesomeIcon icon='fa-solid fa-underline' />
            </button>
            <button
              type='button'
              title='Emoji'
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`rounded-full hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center cursor-pointer w-8 h-8 transition-colors ${
                showEmojiPicker ? 'bg-gray-200 text-black' : ''
              }`}
              disabled={disabled}
            >
              <FontAwesomeIcon
                icon='fa-regular fa-face-smile'
                className='text-lg'
              />
            </button>
          </div>
          <button
            className='bg-primary hover:bg-primary/85 text-white font-semibold rounded-full px-6 py-2 transition cursor-pointer disabled:opacity-50'
            type='submit'
            disabled={disabled || !value.trim()}
          >
            {disabled ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Format Preview */}
      {value && (
        <div className='mt-2 pt-2 border-t border-gray-200'>
          <div className='comment-preview-label'>Preview:</div>
          <div className='comment-preview'>
            <FormattedText text={value} />
          </div>
        </div>
      )}
    </div>
  );
};

// Component to render formatted text
const FormattedText = ({ text, className = '' }) => {
  const formatText = text => {
    if (!text) return '';

    // Escape HTML first to prevent XSS
    let escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    // Handle bold (**text**)
    escapedText = escapedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Handle italic (*text*) - but not if it's part of **text**
    escapedText = escapedText.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

    // Handle underline (__text__)
    escapedText = escapedText.replace(/__(.*?)__/g, '<u>$1</u>');

    // Handle line breaks
    escapedText = escapedText.replace(/\n/g, '<br />');

    return escapedText;
  };

  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: formatText(text) }}
    />
  );
};

export default RichTextCommentInput;
export { FormattedText };
