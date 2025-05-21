import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { PieChart, BarChart2, Users, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { formatEther } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { web3, contract, account } = useWallet();
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalDonations: '0',
    activeCampaigns: 0,
    totalDonors: 0,
    recentDonations: [],
    topCampaigns: []
  });

  useEffect(() => {
    if (contract) {
      loadDashboardData();
    }
  }, [contract]);

  const loadDashboardData = async () => {
    try {
      const charities = await contract.methods.getCharities().call();
      let totalCampaigns = 0;
      let activeCampaigns = 0;
      let totalDonations = BigInt(0);
      const donorSet = new Set();
      const campaignStats = [];

      for (const charity of charities) {
        const campaigns = await contract.methods.getCampaigns(charity).call();
        totalCampaigns += campaigns.length;
        
        for (const [index, campaign] of campaigns.entries()) {
          if (campaign.isActive) activeCampaigns++;
          totalDonations += BigInt(campaign.totalDonated);
          
          const donations = await contract.methods.getDonationsToCampaign(charity, index).call();
          donations.forEach(donation => donorSet.add(donation.donor));
          
          campaignStats.push({
            title: campaign.title,
            totalDonated: campaign.totalDonated,
            goalAmount: campaign.goalAmount,
            charity
          });
        }
      }

      const topCampaigns = campaignStats
        .sort((a, b) => BigInt(b.totalDonated) - BigInt(a.totalDonated))
        .slice(0, 5);

      setStats({
        totalCampaigns,
        totalDonations: totalDonations.toString(),
        activeCampaigns,
        totalDonors: donorSet.size,
        recentDonations: [],
        topCampaigns
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Campaigns</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.totalCampaigns}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Donations</p>
              <h3 className="text-xl font-bold text-gray-900">
                {web3 ? formatEther(stats.totalDonations, web3) : '0'} ETH
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.activeCampaigns}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Donors</p>
              <h3 className="text-xl font-bold text-gray-900">{stats.totalDonors}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Top Campaigns</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.topCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{campaign.title}</p>
                  <p className="text-sm text-gray-500">
                    {web3 ? formatEther(campaign.totalDonated, web3) : '0'} ETH raised
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Goal</p>
                  <p className="font-medium text-gray-900">
                    {web3 ? formatEther(campaign.goalAmount, web3) : '0'} ETH
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Statistics</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Campaign Success Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalCampaigns ? 
                    ((Number(stats.activeCampaigns) / Number(stats.totalCampaigns)) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ 
                    width: `${stats.totalCampaigns ? 
                      (Number(stats.activeCampaigns) / Number(stats.totalCampaigns)) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Quick Facts</p>
              <ul className="space-y-2">
                <li className="text-sm">
                  <span className="text-gray-500">Average Donation Size: </span>
                  <span className="font-medium text-gray-900">
                    {stats.totalDonors && stats.totalDonations ? 
                      (web3 ? 
                        parseFloat(formatEther(stats.totalDonations, web3)) / Number(stats.totalDonors) 
                        : 0
                      ).toFixed(4) : 0} ETH
                  </span>
                </li>
                <li className="text-sm">
                  <span className="text-gray-500">Campaigns per Donor: </span>
                  <span className="font-medium text-gray-900">
                    {stats.totalDonors ? 
                      (Number(stats.totalCampaigns) / Number(stats.totalDonors)).toFixed(2) : 0}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;