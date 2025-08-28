// FILE: components/messages/MessageComposer.tsx
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { toast } from 'sonner';

interface MessageComposerProps {
  receiverId: string;
  onMessageSent?: () => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ receiverId, onMessageSent }) => {
  const [content, setContent] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId,
          content,
          isPremium
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Message sent successfully');
        setContent('');
        if (onMessageSent) {
          onMessageSent();
        }
      } else {
        toast.error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      <div className="mb-3">
        <Textarea
          placeholder="Type your message here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="premium-message"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="premium-message" className="ml-2 text-sm text-gray-700">
            Premium Message
          </label>
          {isPremium && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
              Subscriber Only
            </span>
          )}
        </div>
        
        <Button 
          onClick={handleSend} 
          disabled={isSending || !content.trim()}
          variant="primary"
        >
          {isSending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
};

export default MessageComposer;