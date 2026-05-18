import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';
import { motion } from 'motion/react';

export interface ActivityDetail {
  title: string;
  status: string;
  time: string;
}

export interface ActivityLog {
  id: string;
  name: string;
  employeeId: string;
  chats: number;
  lastTime: string;
  initials: string;
  details: ActivityDetail[];
}

interface ActivityCardProps {
  log: ActivityLog;
  onDetailClick?: (detail: ActivityDetail) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ log, onDetailClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#004aad] dark:text-blue-400 font-extrabold text-sm">
          {log.initials}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{log.name}</h3>
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{log.employeeId}</p>
        </div>
        <button 
           onClick={() => setIsExpanded(!isExpanded)}
           className="lg:hidden p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-400"
        >
           {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6 cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
         <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{log.chats} Chats • {log.lastTime}</span>
         <ChevronDown className={`hidden lg:block w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>

      {/* Scrollable List for Desktop, Expandable for Mobile */}
      <div className={`
        flex-1 space-y-4 overflow-hidden transition-all duration-300
        ${isExpanded ? 'max-h-[500px] lg:max-h-[220px] opacity-100 mt-2' : 'max-h-0 lg:max-h-[220px] opacity-0 lg:opacity-100'}
      `}>
        <div className="lg:max-h-[220px] lg:overflow-y-auto pr-2 custom-scrollbar">
          {log.details.map((detail, idx) => (
            <div 
              key={idx} 
              onClick={() => onDetailClick?.(detail)}
              className="group/item flex items-center justify-between p-3 rounded-2xl hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800 mb-2"
            >
               <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{detail.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{detail.status} {detail.time}</p>
               </div>
               <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover/item:text-[#004aad] dark:group-hover/item:text-blue-400 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;