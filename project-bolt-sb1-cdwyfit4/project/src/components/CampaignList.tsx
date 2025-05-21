import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, AlertCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { formatEther, formatDate, daysLeft, calculateProgressPercentage } from '../utils/helpers';
import CampaignCard from './CampaignCard';

interface Campaign {
  title: string;
  description: string;
  goalAmount: string;
  totalDonated: string;
  deadline: number;
  isActive: boolean;
}

interface CampaignWithAddress extends Campaign {
  charity: string;
  id: number;
}

const CampaignList: React.FC = () => {
  const { web3, contract, isConnected } = useWallet();
  const [campaigns, setCampaigns] = useState<CampaignWithAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAllCampaigns = async () => {
    if (!isConnected || !contract) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const charityAddresses = await contract.methods.getCharities().call();
      const allCampaigns: CampaignWithAddress[] = [];
      
      for (const address of charityAddresses) {
        const charityCampaigns = await contract.methods.getCampaigns(address).call();
        
        charityCampaigns.forEach((campaign: Campaign, index: number) => {
          allCampaigns.push({
            ...campaign,
            charity: address,
            id: index
          });
        });
      }
      
      // Filter active campaigns and sort by deadline (closest first)
      const activeCampaigns = allCampaigns
        .filter(c => c.isActive && parseInt(c.deadline) > Math.floor(Date.now() / 1000))
        .sort((a, b) => parseInt(a.deadline) - parseInt(b.deadline));
      
      setCampaigns(activeCampaigns);
      setLoading(false);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      setError('Failed to load campaigns. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && contract) {
      loadAllCampaigns();
    }
  }, [isConnected, contract]);

  return (
    <div className="animate-fadeIn">
      {error && (
        <div className="flex items-center p-4 mb-4 rounded-lg bg-red-50 text-red-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Active Campaigns</h3>
        <button
          onClick={loadAllCampaigns}
          disabled={loading}
          className="btn px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm disabled:bg-blue-400"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => (
            <CampaignCard key={`${campaign.charity}-${campaign.id}`} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No active campaigns found</p>
          {isConnected && (
            <p className="text-sm text-gray-500">
              Be the first to create a campaign and start raising funds for a good cause.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignList;