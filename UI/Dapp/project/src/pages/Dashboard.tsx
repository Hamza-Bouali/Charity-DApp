import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import StatCard from '../components/Common/StatCard';
import CampaignCard from '../components/Common/CampaignCard';
import DonationCard from '../components/Common/DonationCard';
import { Campaign, Donation, Charity } from '../types';
import { fromWei } from '../utils/web3';
import { Heart, PiggyBank, Users, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { contract, account, isConnected } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCharities: 0,
    totalCampaigns: 0,
    totalDonations: '0',
    activeCampaigns: 0
  });
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!contract) return;
      
      try {
        setLoading(true);
        
        // Get all charities
        const charityAddresses = await contract.methods.getCharities().call();
        
        let allCampaigns: Campaign[] = [];
        let totalDonationAmount = 0;
        
        // Get campaigns for each charity
        for (const charity of charityAddresses) {
          const campaigns = await contract.methods.getCampaigns(charity).call();
          
          // Map campaigns and add charity address
          const mappedCampaigns = campaigns.map((campaign: any, index: number) => ({
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
          
          // Calculate total donations
          for (let i = 0; i < mappedCampaigns.length; i++) {
            totalDonationAmount += parseFloat(fromWei(mappedCampaigns[i].totalDonated));
          }
        }
        
        // Sort campaigns by deadline (newest first)
        allCampaigns.sort((a, b) => b.deadline - a.deadline);
        
        // Count active campaigns
        const activeCampaigns = allCampaigns.filter(c => 
          c.isActive && c.deadline > Date.now() / 1000
        ).length;
        
        // Get recent donations (this is a simplified approach)
        let recentDonations: Donation[] = [];
        if (allCampaigns.length > 0) {
          const sampleCampaign = allCampaigns[0];
          recentDonations = await contract.methods
            .getDonationsToCampaign(sampleCampaign.charity, sampleCampaign.id)
            .call();
        }
        
        // Update state
        setStats({
          totalCharities: charityAddresses.length,
          totalCampaigns: allCampaigns.length,
          totalDonations: totalDonationAmount.toFixed(2),
          activeCampaigns
        });
        
        setRecentCampaigns(allCampaigns.slice(0, 3));
        setRecentDonations(recentDonations.slice(0, 5));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (contract) {
      fetchDashboardData();
    }
  }, [contract]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Connect your wallet to view the dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to connect your Ethereum wallet to access the charity platform
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of platform activity and key metrics
        </p>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Charities" 
            value={stats.totalCharities} 
            icon={<Users size={24} />} 
            change={{ value: 5, isPositive: true }}
          />
          <StatCard 
            title="Active Campaigns" 
            value={stats.activeCampaigns} 
            icon={<PiggyBank size={24} />} 
            change={{ value: 12, isPositive: true }}
          />
          <StatCard 
            title="Total Campaigns" 
            value={stats.totalCampaigns} 
            icon={<TrendingUp size={24} />} 
          />
          <StatCard 
            title="Total Donations (ETH)" 
            value={stats.totalDonations} 
            icon={<Heart size={24} />} 
            change={{ value: 8, isPositive: true }}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Campaigns
            </h2>
            <a href="/campaigns" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </a>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2].map(i => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentCampaigns.length > 0 ? (
                recentCampaigns.map((campaign, index) => (
                  <CampaignCard key={index} campaign={campaign} />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 col-span-2">
                  No active campaigns found
                </p>
              )}
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Donations
            </h2>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="flex justify-between mb-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentDonations.length > 0 ? (
                recentDonations.map((donation, index) => (
                  <DonationCard key={index} donation={donation} />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No recent donations found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;