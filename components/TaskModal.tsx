import React, { useEffect } from 'react';
import type { Task } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
}

const getStatusClass = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    if (status.includes('Submitted')) return 'bg-purple-100 text-purple-800';
    if (status.includes('กำลังทำ')) return 'bg-green-100 text-green-800';
    if (status.includes('ยังไม่')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
};

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!task) {
    return null;
  }
  
  const DetailItem: React.FC<{ label: string; value: string | React.ReactNode; fullWidth?: boolean }> = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? 'col-span-1 sm:col-span-2' : ''}>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm sm:text-base text-gray-900 break-words">{value || '-'}</dd>
    </div>
  );

  return (
    <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50 transition-opacity animate-fade-in"
        onClick={onClose}
        style={{ animationDuration: '150ms' }}
    >
        <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all animate-slide-in"
            onClick={(e) => e.stopPropagation()}
            style={{ animationDuration: '300ms' }}
        >
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
                <button 
                    onClick={onClose} 
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Close"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="p-4 sm:p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6">
                    <DetailItem label="รายละเอียดงาน" value={task.details} fullWidth={true} />
                    
                    <DetailItem label="สถานะ" value={
                        task.status ? (
                            <span className={`px-2.5 py-1 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full ${getStatusClass(task.status)}`}>
                                {task.status}
                            </span>
                        ) : '-'
                    } />
                    <DetailItem label="เจ้าของงาน" value={task.owner} />
                    <DetailItem label="ประเภทงาน" value={task.workType} />
                    <DetailItem label="ID" value={task.id} />

                    <DetailItem label="วันเดือนปี" value={task.date} />
                    <DetailItem label="Deadline" value={task.deadline} />
                    <DetailItem label="วันที่ส่งให้พี่" value={task.sentDate} />
                    <DetailItem label="รอบงาน" value={task.round} />
                </dl>

                {task.fileLink && task.fileLink.startsWith('http') && (
                     <div className="mt-5 sm:mt-6 pt-5 border-t border-gray-200">
                        <a 
                            href={task.fileLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block w-full text-center px-4 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            View File / Link
                        </a>
                     </div>
                )}
            </div>
        </div>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slide-in {
                from { transform: translateY(-20px) scale(0.98); opacity: 0; }
                to { transform: translateY(0) scale(1); opacity: 1; }
            }
            .animate-fade-in { animation-name: fade-in; }
            .animate-slide-in { animation-name: slide-in; }
        `}</style>
    </div>
  );
};