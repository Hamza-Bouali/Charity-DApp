import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Campaign } from '../types';
import { fromWei, formatDate, toWei } from '../utils/web3';
import { PlusCircle, AlertTriangle } from 'lucide-react';

const MyCampaigns: React.FC = () => {
  const { contract, account, isConnected, isCharity } = useWeb3();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    duration: ''
  });

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      if (!contract || !account) return;
      
      try {
        setLoading(true);
        const campaigns = await contract.methods.getCampaigns(account).call();
        
        const mappedCampaigns = campaigns.map((campaign: any, index: number) => ({
          id: index,
          title: campaign.title,
          description: campaign.description,
          goalAmount: campaign.goalAmount,
          totalDonated: campaign.totalDonated,
          deadline: parseInt(campaign.deadline),
          isActive: campaign.isActive,
          charity: account
        }));
        
        setCampaigns(mappedCampaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contract && account) {
      fetchMyCampaigns();
    }
  }, [contract, account]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contract || !account) return;

    try {
      const { title, description, goalAmount, duration } = formData;

      await contract.methods
        .createCampaign(
          title,
          description,
          toWei(goalAmount),
          parseInt(duration)
        )
        .send({ from: account });

      setShowCreateForm(false);
      setFormData({ title: '', description: '', goalAmount: '', duration: '' });

      // Refresh campaigns
      const newCampaigns = await contract.methods.getCampaigns(account).call();
      setCampaigns(newCampaigns);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const handleToggleCampaign = async (campaignId: number) => {
    if (!contract || !account) return;
    
    try {
      await contract.methods.toggleCampaignStatus(campaignId).send({ from: account });
      
      // Refresh campaigns
      const newCampaigns = await contract.methods.getCampaigns(account).call();
      setCampaigns(newCampaigns);
    } catch (error) {
      console.error('Error toggling campaign:', error);
    }
  };

  const handleWithdraw = async (campaignId: number) => {
    if (!contract || !account) return;
    
    try {
      await contract.methods.withdrawCampaignFunds(campaignId).send({ from: account });
      
      // Refresh campaigns
      const newCampaigns = await contract.methods.getCampaigns(account).call();
      setCampaigns(newCampaigns);
    } catch (error) {
      console.error('Error withdrawing funds:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Please connect your wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You need to connect your wallet to manage campaigns
        </p>
      </div>
    );
  }

  if (!isCharity) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Charity Access Required
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Only registered charities can create and manage campaigns. Please register as a charity first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Campaigns</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your charitable campaigns
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <PlusCircle size={20} className="mr-2" />
          Create Campaign
        </button>
      </div>
      
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className=" dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold  dark:text-white mb-4">
              Create New Campaign
            </h2>
            
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Amount (ETH)
                </label>
                <input
                  type="number"
                  name="goalAmount"
                  value={formData.goalAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (days)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : campaigns.length > 0 ? (
        <div className="space-y-4">
          {campaigns.map((campaign, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {campaign.description}
                    </p>
                  </div>
                  
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    campaign.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {campaign.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Goal</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {fromWei(campaign.goalAmount)} ETH
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Raised</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {fromWei(campaign.totalDonated)} ETH
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Deadline</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDate(campaign.deadline)}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleToggleCampaign(campaign.id)}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      campaign.isActive
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {campaign.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => handleWithdraw(campaign.id)}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Withdraw Funds
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            You haven't created any campaigns yet
          </p>
        </div>
      )}
    </div>
  );
};

export default MyCampaigns;