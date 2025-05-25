import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { AlertTriangle, CheckCircle, XCircle, User } from 'lucide-react';
import { CharityRequest } from '../types';

const AdminPanel: React.FC = () => {
  const { contract, account, isConnected, isAdmin } = useWeb3();
  const [charityRequests, setCharityRequests] = useState<CharityRequest[]>([]);
  const [minimumDonation, setMinimumDonation] = useState('0.01');
  const [contractPaused, setContractPaused] = useState(false);
  const [loading, setLoading] = useState({
    requests: false,
    status: false,
    minDonation: false
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!contract || !isConnected || !isAdmin) return;
      
      try {
        setLoading(prev => ({ ...prev, requests: true }));
        
        // Get charity requests
        const requests = await contract.methods.getCharityRequests().call();
        setCharityRequests(requests);
        
        // Get contract paused status
        const paused = await contract.methods.paused().call();
        setContractPaused(paused);
        
        // Get minimum donation
        const minDonation = await contract.methods.minimumDonation().call();
        setMinimumDonation(minDonation);
        
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(prev => ({ ...prev, requests: false }));
      }
    };

    if (contract && isConnected && isAdmin) {
      fetchAdminData();
    }
  }, [contract, isConnected, isAdmin]);

  const handleApproveCharity = async (requestId: number) => {
    if (!contract || !account) return;
    
    try {
      await contract.methods.approveCharity(requestId).send({ from: account });
      
      // Update the list after approval
      const updatedRequests = await contract.methods.getCharityRequests().call();
      setCharityRequests(updatedRequests);
      
    } catch (error) {
      console.error('Error approving charity:', error);
    }
  };

  const handleToggleContractStatus = async () => {
    if (!contract || !account) return;
    
    try {
      setLoading(prev => ({ ...prev, status: true }));
      
      if (contractPaused) {
        await contract.methods.unpauseContract().send({ from: account });
      } else {
        await contract.methods.pauseContract().send({ from: account });
      }
      
      // Update status
      const paused = await contract.methods.paused().call();
      setContractPaused(paused);
      
    } catch (error) {
      console.error('Error toggling contract status:', error);
    } finally {
      setLoading(prev => ({ ...prev, status: false }));
    }
  };

  const handleSetMinimumDonation = async () => {
    if (!contract || !account) return;
    
    try {
      setLoading(prev => ({ ...prev, minDonation: true }));
      
      // Convert ETH to wei
      const minDonationWei = contract.web3.utils.toWei(minimumDonation, 'ether');
      await contract.methods.setMinimumDonation(minDonationWei).send({ from: account });
      
    } catch (error) {
      console.error('Error setting minimum donation:', error);
    } finally {
      setLoading(prev => ({ ...prev, minDonation: false }));
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Please connect your wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You need to connect your wallet to access the admin panel
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Unauthorized Access
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access the admin panel. Only the contract owner can access this section.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage platform settings and review charity registration requests
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contract Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contract Status
          </h2>
          
          <div className="flex items-center mb-6">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              contractPaused ? 'bg-red-500' : 'bg-green-500'
            }`}></div>
            <span className="text-gray-700 dark:text-gray-300">
              {contractPaused ? 'Contract is paused' : 'Contract is active'}
            </span>
          </div>
          
          <button
            onClick={handleToggleContractStatus}
            disabled={loading.status}
            className={`w-full py-2 px-4 font-medium rounded-lg transition-colors ${
              contractPaused
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {loading.status
              ? 'Processing...'
              : contractPaused
              ? 'Unpause Contract'
              : 'Pause Contract'}
          </button>
        </div>
        
        {/* Minimum Donation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Minimum Donation
          </h2>
          
          <div className="mb-4">
            <label 
              htmlFor="minimumDonation" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Minimum Donation Amount (ETH)
            </label>
            <input
              type="number"
              id="minimumDonation"
              value={minimumDonation}
              onChange={(e) => setMinimumDonation(e.target.value)}
              placeholder="0.01"
              step="0.001"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <button
            onClick={handleSetMinimumDonation}
            disabled={loading.minDonation}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {loading.minDonation ? 'Updating...' : 'Update Minimum Donation'}
          </button>
        </div>
      </div>
      
      {/* Charity Requests */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Charity Registration Requests
          </h2>
        </div>
        
        {loading.requests ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : charityRequests.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No charity registration requests to review
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {charityRequests.map((request, index) => (
              <div key={index} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full text-blue-600 dark:text-blue-400">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {request.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {request.description}
                      </p>
                      <div className="mt-2">
                        <a 
                          href={request.metadataUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {request.metadataUrl}
                        </a>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Requested by: {request.requester}
                      </p>
                    </div>
                  </div>
                  
                  {request.approved ? (
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                      Approved
                    </span>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveCharity(index)}
                        className="flex items-center px-3 py-1 text-xs font-medium bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 rounded-full transition-colors"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Approve
                      </button>
                      <button className="flex items-center px-3 py-1 text-xs font-medium bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-full transition-colors">
                        <XCircle size={14} className="mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;