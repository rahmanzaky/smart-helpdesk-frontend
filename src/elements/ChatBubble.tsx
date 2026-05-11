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
          <div className="mt-4 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
             {imageUrl === 'placeholder' ? (
                <div className="aspect-video flex flex-col items-center justify-center p-8 text-gray-300">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span className="text-xs uppercase tracking-widest font-black opacity-50 px-4 text-center">Image Attachment</span>
                </div>
             ) : (
                <img 
                  src={imageUrl} 
                  alt="Attachment" 
                  className="w-full h-auto object-cover max-h-[300px]"
                />
             )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
