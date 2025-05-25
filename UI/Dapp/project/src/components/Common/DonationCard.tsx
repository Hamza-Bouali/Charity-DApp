import React from 'react';
import { Donation } from '../../types';
import { formatAddress, fromWei } from '../../utils/web3';

interface DonationCardProps {
  donation: Donation;
}

const DonationCard: React.FC<DonationCardProps> = ({ donation }) => {
  const formattedDate = new Date(donation.timestamp * 1000).toLocaleString();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {formatAddress(donation.donor)}
        </span>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {parseFloat(fromWei(donation.amount)).toFixed(4)} ETH
        </span>
      </div>
      
      {donation.message && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 italic">
          "{donation.message}"
        </p>
      )}
      
      <div className="text-xs text-gray-400 dark:text-gray-500">
        {formattedDate}
      </div>
    </div>
  );
};

export default DonationCard;