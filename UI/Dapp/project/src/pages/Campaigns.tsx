import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import CampaignCard from '../components/Common/CampaignCard';
import { Campaign } from '../types';
import { Search, Filter } from 'lucide-react';

const Campaigns: React.FC = () => {
  const { contract, isConnected } = useWeb3();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!contract) return;
      
      try {
        setLoading(true);
        
        // Get all charities
        const charityAddresses = await contract.methods.getCharities().call();
        let allCampaigns: Campaign[] = [];
        
        // Get campaigns for each charity
        for (const charity of charityAddresses) {
          const charityCampaigns = await contract.methods.getCampaigns(charity).call();
          
          // Map campaigns and add charity address
          const mappedCampaigns = charityCampaigns.map((campaign: any, index: number) => ({
            id: index,
            title: campaign.title,
            description: campaign.description,
            goalAmount: campaign.goalAmount,
            totalDonated: campaign.totalDonated,
            deadline: parseInt(campaign.deadline),
            isActive: campaign.isActive,
            charity
          }));
          
          allCampaigns = [...allCampaigns, ...mappedCampaigns];
        }
        
        // Sort campaigns by deadline (newest first)
        allCampaigns.sort((a, b) => b.deadline - a.deadline);
        
        setCampaigns(allCampaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contract) {
      fetchCampaigns();
    }
  }, [contract]);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = Date.now() / 1000;
    const isActive = campaign.isActive && campaign.deadline > now;
    
    switch (filter) {
      case 'active':
        return matchesSearch && isActive;
      case 'completed':
        return matchesSearch && !isActive;
      default:
        return matchesSearch;
    }
  });

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Please connect your wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You need to connect your wallet to view campaigns
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Browse and support charitable campaigns
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Campaigns</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign, index) => (
              <CampaignCard key={index} campaign={campaign} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No campaigns found matching your criteria
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Campaigns;