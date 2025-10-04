
import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="flex flex-col justify-center items-center text-center py-20 px-4">
    <AlertTriangleIcon className="h-12 w-12 text-red-400 mb-4"/>
    <h3 className="text-lg font-semibold text-red-600">An Error Occurred</h3>
    <p className="text-red-500 mt-2">{message}</p>
  </div>
);
