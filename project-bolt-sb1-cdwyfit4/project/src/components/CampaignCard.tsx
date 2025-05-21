import React from 'react';
import { Clock, Target, HeartHandshake } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { formatEther, daysLeft, calculateProgressPercentage, truncateAddress } from '../utils/helpers';

interface CampaignProps {
  campaign: {
    charity: string;
    id: number;
    title: string;
    description: string;
    goalAmount: string;
    totalDonated: string;
    deadline: number;
    isActive: boolean;
  };
}

const CampaignCard: React.FC<CampaignProps> = ({ campaign }) => {
  const { web3 } = useWallet();
  
  const goal = web3 ? formatEther(campaign.goalAmount, web3) : '0';
  const raised = web3 ? formatEther(campaign.totalDonated, web3) : '0';
  const progressPercentage = calculateProgressPercentage(raised, goal);
  const remainingDays = daysLeft(parseInt(campaign.deadline.toString()));
  
  return (
    <div className="campaign-card bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="h-2 bg-gray-200">
        <div 
          className="h-2 bg-blue-600 progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <div className="flex items-center">
            <HeartHandshake className="h-3 w-3 mr-1" />
            <span>Charity: {truncateAddress(campaign.charity)}</span>
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{remainingDays} days left</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
        
        <div className="mt-4">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="font-medium text-gray-700">Progress</span>
            <span className="font-bold text-blue-600">{progressPercentage.toFixed(0)}%</span>
          </div>
          
          <div className="mt-4 flex justify-between">
            <div>
              <p className="text-xs text-gray-500">Raised</p>
              <p className="text-sm font-bold text-gray-900">{raised} ETH</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Goal</p>
              <p className="text-sm font-bold text-gray-900">{goal} ETH</p>
            </div>
          </div>
        </div>
        
        <button 
          className="mt-4 w-full btn py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm"
          onClick={() => {
            document.getElementById('donateTo')?.setAttribute('value', campaign.charity);
            document.getElementById('donateCampaignId')?.setAttribute('value', campaign.id.toString());
            document.querySelector('[data-tab="donate"]')?.click();
          }}
        >
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;