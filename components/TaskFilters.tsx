import React from 'react';
import { FunnelIcon } from './icons/FunnelIcon';

interface TaskFiltersProps {
  filters: { status: string; owner: string; workType: string };
  statusOptions: string[];
  ownerOptions: string[];
  workTypeOptions: string[];
  onFilterChange: (filterType: 'status' | 'owner' | 'workType', value: string) => void;
  onResetFilters: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  statusOptions,
  ownerOptions,
  workTypeOptions,
  onFilterChange,
  onResetFilters,
}) => {
  const hasActiveFilter = filters.status || filters.owner || filters.workType;

  return (
    <div className="p-4 bg-gray-50/50 border-b border-gray-200">
      <div className="flex items-center mb-4">
        <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            name="status"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="owner-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Owner
          </label>
          <select
            id="owner-filter"
            name="owner"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.owner}
            onChange={(e) => onFilterChange('owner', e.target.value)}
          >
            <option value="">All Owners</option>
            {ownerOptions.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </div>
         <div>
          <label htmlFor="workType-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Work Type
          </label>
          <select
            id="workType-filter"
            name="workType"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.workType}
            onChange={(e) => onFilterChange('workType', e.target.value)}
          >
            <option value="">All Work Types</option>
            {workTypeOptions.map((workType) => (
              <option key={workType} value={workType}>
                {workType}
              </option>
            ))}
          </select>
        </div>
        <div className="self-end">
          <button
            onClick={onResetFilters}
            disabled={!hasActiveFilter}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};