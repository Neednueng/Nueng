import React from 'react';
import type { Task, SortKey, SortDirection } from '../types';

interface TaskTableProps {
  tasks: Task[];
  onSort: (key: SortKey) => void;
  sortConfig: { key: SortKey; direction: SortDirection };
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onTaskClick: (task: Task) => void;
}

const getStatusClass = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    if (status.includes('Submitted')) return 'bg-purple-100 text-purple-800';
    if (status.includes('กำลังทำ')) return 'bg-green-100 text-green-800';
    if (status.includes('ยังไม่')) return 'bg-blue-100 text-blue-800';
    // Add more status conditions here if needed
    return 'bg-gray-100 text-gray-800';
};


export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onSort, sortConfig, currentPage, totalPages, onPageChange, onTaskClick }) => {
  const headers: { label: string; key: SortKey }[] = [
    { label: 'วันเดือนปี', key: 'date' },
    { label: 'ID', key: 'id' },
    { label: 'สถานะ', key: 'status' },
    { label: 'ประเภทงาน', key: 'workType' },
    { label: 'เจ้าของงาน', key: 'owner' },
    { label: 'Deadline', key: 'deadline' },
    { label: 'วันที่ส่งให้พี่', key: 'sentDate' },
    { label: 'รอบงาน', key: 'round' },
    { label: 'ไฟล์/ลิงค์', key: 'fileLink' },
  ];

  const SortArrow: React.FC<{ direction: SortDirection }> = ({ direction }) => (
    <span className="w-4 h-4 ml-1.5 text-blue-600">
      {direction === 'ascending' ? '▲' : '▼'}
    </span>
  );

  const Pagination = () => {
    if (totalPages <= 1) {
      return null;
    }
  
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
    return (
      <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" aria-label="Pagination">
        <div className="flex-1 flex justify-between sm:justify-end items-center">
            <div className="sm:hidden">
                <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </p>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
            <div className="flex sm:hidden">
                 <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Prev
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
      </nav>
    );
  };
  
  const MobileCardView: React.FC = () => (
    <div className="p-4 bg-gray-50 md:hidden">
        {tasks.map((task, index) => (
            <div 
                key={`${task.id}-${index}`} 
                className="bg-white rounded-lg shadow p-4 mb-4 ring-1 ring-black ring-opacity-5 cursor-pointer hover:bg-sky-100 transition-colors duration-200"
                onClick={() => onTaskClick(task)}
            >
                <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-semibold text-gray-800 break-words flex-1 pr-2 line-clamp-2">{task.details || 'No Details'}</p>
                    {task.status && (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${getStatusClass(task.status)}`}>
                            {task.status}
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                    <div>
                        <span className="font-medium text-gray-500">วันเดือนปี:</span> {task.date || '-'}
                    </div>
                     <div>
                        <span className="font-medium text-gray-500">เจ้าของงาน:</span> {task.owner || '-'}
                    </div>
                    <div>
                        <span className="font-medium text-gray-500">Deadline:</span> {task.deadline || '-'}
                    </div>
                    <div>
                        <span className="font-medium text-gray-500">ประเภทงาน:</span> {task.workType || '-'}
                    </div>
                </div>
                {task.fileLink && task.fileLink.startsWith('http') && (
                     <div className="mt-4">
                        <a href={task.fileLink} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-800 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                            View Link
                        </a>
                     </div>
                )}
            </div>
        ))}
    </div>
  );

  const DesktopTableView: React.FC = () => (
     <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  aria-sort={sortConfig.key === header.key ? sortConfig.direction : 'none'}
                >
                  <button
                    type="button"
                    onClick={() => onSort(header.key)}
                    className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  >
                    <span className="group-hover:text-gray-800 transition-colors duration-200">{header.label}</span>
                    {sortConfig.key === header.key ? (
                      <SortArrow direction={sortConfig.direction} />
                    ) : (
                      <span className="w-4 h-4 ml-1.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true">
                        ↕
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {tasks.map((task, index) => (
              <tr 
                key={`${task.id}-${index}`} 
                className="odd:bg-white even:bg-slate-50 hover:bg-sky-100 transition-colors duration-200 border-b border-gray-200 cursor-pointer"
                onClick={() => onTaskClick(task)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.status && (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(task.status)}`}>
                          {task.status}
                      </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate" title={task.workType}>{task.workType}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-[150px] truncate" title={task.owner}>{task.owner}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.deadline}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.sentDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.round}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-[250px] truncate">
                  {task.fileLink && task.fileLink.startsWith('http') ? (
                    <a href={task.fileLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200" title={task.fileLink}>
                      View Link
                    </a>
                  ) : (
                    <span title={task.fileLink}>{task.fileLink}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );


  return (
    <>
      <MobileCardView />
      <DesktopTableView />
      <Pagination />
    </>
  );
};