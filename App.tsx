import React, { useState, useEffect, useMemo } from 'react';
import { fetchSheetData } from './services/googleSheetService';
import type { Task, SortKey, SortDirection } from './types';
import { TABS, TASKS_PER_PAGE } from './constants';
import { TaskTable } from './components/EmployeeTable';
import { Spinner } from './components/Spinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ChecklistIcon } from './components/icons/ChecklistIcon';
import { TaskModal } from './components/TaskModal';

const thaiMonths: { [key: string]: number } = {
  'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
  'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11
};

const parseThaiDate = (dateString: string): Date | null => {
  if (!dateString || typeof dateString !== 'string') return null;
  const parts = dateString.split(' ');
  if (parts.length < 3) return null; // e.g., "5 ต.ค. 68"
  const day = parseInt(parts[0], 10);
  const monthStr = parts[1];
  const yearBE = parseInt(parts[2], 10);
  
  const month = thaiMonths[monthStr];

  if (isNaN(day) || month === undefined || isNaN(yearBE)) return null;

  const yearAD = yearBE < 100 ? 2000 + yearBE : yearBE - 543;
  return new Date(yearAD, month, day);
};


const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTabGid, setActiveTabGid] = useState<string>(TABS[0].gid);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'date', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSheetData(activeTabGid);
        setTasks(data);
        setCurrentPage(1); // Reset to first page when tab changes
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTabGid]);

  const sortedTasks = useMemo(() => {
    const sortableItems = [...tasks];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        let comparison = 0;

        switch (sortConfig.key) {
          case 'date':
          case 'deadline':
          case 'sentDate':
            const dateA = parseThaiDate(aValue as string);
            const dateB = parseThaiDate(bValue as string);
            if (dateA && dateB) {
              comparison = dateA.getTime() - dateB.getTime();
            } else if (dateA) {
              comparison = -1;
            } else if (dateB) {
              comparison = 1;
            } else {
              comparison = String(aValue).localeCompare(String(bValue));
            }
            break;
          default:
            comparison = String(aValue).localeCompare(String(bValue));
            break;
        }

        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return sortableItems;
  }, [tasks, sortConfig]);

  const totalPages = Math.ceil(sortedTasks.length / TASKS_PER_PAGE);
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
    return sortedTasks.slice(startIndex, startIndex + TASKS_PER_PAGE);
  }, [currentPage, sortedTasks]);

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }
    if (paginatedTasks.length > 0) {
      return (
        <TaskTable 
            tasks={paginatedTasks} 
            onSort={handleSort} 
            sortConfig={sortConfig}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onTaskClick={handleTaskClick}
        />
      );
    }
    return <p className="text-center text-gray-500 py-20 px-4">No data found for this tab.</p>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-200 font-sans text-gray-800">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
            <div className="inline-block bg-white p-4 rounded-full shadow-md mb-4">
                <ChecklistIcon className="h-12 w-12 text-blue-500" />
            </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Work Checklist
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Live data from your Google Sheet, organized and accessible.
          </p>
        </header>
        
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTabGid(tab.gid)}
                  className={`whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm focus:outline-none ${
                    activeTabGid === tab.gid
                      ? 'border-blue-700 text-blue-700 font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={activeTabGid === tab.gid ? 'page' : undefined}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
            {renderContent()}
        </div>
        
        <footer className="text-center mt-8 md:mt-12 text-sm text-gray-500">
            <p>Powered by React & Tailwind CSS</p>
        </footer>
      </main>
      <TaskModal 
        task={selectedTask} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default App;