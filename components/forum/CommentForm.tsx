'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Smile, 
  List, 
  ListOrdered,
  Quote,
  LinkIcon
} from 'lucide-react';

interface CommentFormProps {
  topicId: string;
  parentId?: string;
  onSubmit: (comment: { body: string, bodyHtml: string }) => Promise<any>;
  onCancel?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  topicId, 
  parentId, 
  onSubmit,
  onCancel
}) => {
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Format text functions
  const formatText = (command: string, value: string = '') => {
    const textarea = document.getElementById('comment-body') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end);
    let newText = '';
    let newCursorPos = start;
    
    switch (command) {
      case 'bold':
        newText = `**${selectedText}**`;
        newCursorPos = start + 2;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        newCursorPos = start + 1;
        break;
      case 'underline':
        newText = `__${selectedText}__`;
        newCursorPos = start + 2;
        break;
      case 'list':
        newText = `
- ${selectedText.replace(/\n/g, `
- `)}`;
        newCursorPos = start + 3;
        break;
      case 'orderedList':
        newText = `
1. ${selectedText.replace(/\n/g, `
2. `)}`;
        newCursorPos = start + 4;
        break;
      case 'quote':
        newText = `
> ${selectedText.replace(/\n/g, `
> `)}`;
        newCursorPos = start + 3;
        break;
      default:
        return;
    }
    
    const newBody = body.substring(0, start) + newText + body.substring(end);
    setBody(newBody);
    
    // Set cursor position after formatting
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };
  
  // Convert markdown to HTML for display
  const convertMarkdownToHtml = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/__(.*?)__/g, '<u>$1</u>') // Underline
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/^- (.*?)(?=<br>|$)/gm, '<li>$1</li>') // Unordered list items
      .replace(/^(\d+)\. (.*?)(?=<br>|$)/gm, '<li>$2</li>') // Ordered list items
      .replace(/(<li>.*<\/li>)+/g, (match) => {
        if (match.includes('<li>') && !match.includes('<ol>') && !match.includes('<ul>')) {
          if (match.match(/^\d+\./)) {
            return `<ol>${match}</ol>`;
          } else {
            return `<ul>${match}</ul>`;
          }
        }
        return match;
      })
      .replace(/> (.*?)(?=<br>|$)/g, '<blockquote>$1</blockquote>'); // Quotes
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!body.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const bodyHtml = convertMarkdownToHtml(body);
      await onSubmit({ body, bodyHtml });
      setBody('');
    } catch (err) {
      setError('Failed to submit comment. Please try again.');
      console.error('Comment submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Formatting toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
          <button 
            type="button" 
            onClick={() => formatText('bold')}
            className="p-1 rounded hover:bg-gray-200"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => formatText('italic')}
            className="p-1 rounded hover:bg-gray-200"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => formatText('underline')}
            className="p-1 rounded hover:bg-gray-200"
            title="Underline"
          >
            <Underline size={16} />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button 
            type="button" 
            onClick={() => formatText('list')}
            className="p-1 rounded hover:bg-gray-200"
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => formatText('orderedList')}
            className="p-1 rounded hover:bg-gray-200"
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
          <button 
            type="button" 
            onClick={() => formatText('quote')}
            className="p-1 rounded hover:bg-gray-200"
            title="Quote"
          >
            <Quote size={16} />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button 
            type="button" 
            className="p-1 rounded hover:bg-gray-200"
            title="Emoji"
          >
            <Smile size={16} />
          </button>
        </div>
        
        {/* Textarea */}
        <textarea
          id="comment-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          className="w-full p-3 border-0 focus:ring-0 resize-none"
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      <div className="mt-3 flex justify-end gap-2">
        {onCancel && (
          <Button 
            variant="outline"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button 
          variant="primary"
          type="submit"
          disabled={isSubmitting || !body.trim()}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;