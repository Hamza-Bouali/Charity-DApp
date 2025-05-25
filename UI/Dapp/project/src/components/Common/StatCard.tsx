import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              {change.isPositive ? (
                <TrendingUp size={16} className="text-green-500 mr-1" />
              ) : (
                <TrendingDown size={16} className="text-red-500 mr-1" />
              )}
              <span className={`text-xs font-medium ${
                change.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;