import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Campaign } from '../../types';
import { formatAddress, fromWei, formatDate } from '../../utils/web3';
import { Calendar, Target } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const navigate = useNavigate();
  
  const goalAmount = parseFloat(fromWei(campaign.goalAmount));
  const totalDonated = parseFloat(fromWei(campaign.totalDonated));
  const progressPercent = Math.min(Math.round((totalDonated / goalAmount) * 100), 100);
  
  const handleClick = () => {
    navigate(`/campaigns/${campaign.id}`);
  };
  
  const isExpired = campaign.deadline < Date.now() / 1000;
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
            {campaign.title}
          </h3>
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
            campaign.isActive && !isExpired
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {campaign.isActive && !isExpired ? 'Active' : 'Inactive'}
          </div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {campaign.description}
        </p>
        
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center mr-4">
            <Calendar size={14} className="mr-1" />
            <span>Ends: {formatDate(campaign.deadline)}</span>
          </div>
          <div className="flex items-center">
            <Target size={14} className="mr-1" />
            <span>By: {formatAddress(campaign.charity)}</span>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {totalDonated.toFixed(2)} ETH
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              of {goalAmount.toFixed(2)} ETH
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;