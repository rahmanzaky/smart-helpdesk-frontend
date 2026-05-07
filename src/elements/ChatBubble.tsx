/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon } from 'lucide-react';

interface ChatBubbleProps {
  role: 'user' | 'bot';
  content: string;
  timestamp?: string;
  imageUrl?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content, imageUrl }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-6 group`}
    >
      {!isUser && (
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
          Chatbot
        </span>
      )}
      
      <div
        className={`max-w-[85%] lg:max-w-[70%] p-5 rounded-2xl ${
          isUser
            ? 'bg-blue-100 text-blue-950 rounded-tr-none'
            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
          {content}
        </p>
        
        {imageUrl && (
          <div className="mt-4 rounded-xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center border border-white/20">
             <div className="text-white/40 flex flex-col items-center">
                <ImageIcon className="w-12 h-12 mb-2" />
                <span className="text-xs uppercase tracking-widest font-bold opacity-50 text-center">Image Attachment</span>
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
