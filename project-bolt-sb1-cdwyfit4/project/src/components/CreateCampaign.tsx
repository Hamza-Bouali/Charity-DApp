import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const CreateCampaign: React.FC = () => {
  const { web3, contract, account, isConnected } = useWallet();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [duration, setDuration] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!title || !description || !goalAmount || !duration) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const goalAmountWei = web3?.utils.toWei(goalAmount, 'ether');
      
      await contract.methods
        .createCampaign(title, description, goalAmountWei, duration)
        .send({ from: account });
      
      setSuccess('Campaign created successfully!');
      setTitle('');
      setDescription('');
      setGoalAmount('');
      setDuration('');
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      setError(error.message || 'Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fadeIn">
      {error && (
        <div className="flex items-center p-4 mb-6 rounded-lg bg-red-50 text-red-800">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="flex items-center p-4 mb-6 rounded-lg bg-green-50 text-green-800">
          <CheckCircle className="h-5 w-5 mr-2" />
          <p>{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter campaign title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your campaign"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Goal Amount (ETH)
              </label>
              <input
                id="goalAmount"
                type="number"
                step="0.001"
                min="0.001"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="E.g., 1.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days)
              </label>
              <input
                id="duration"
                type="number"
                min="1"
                max="365"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="E.g., 30"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !isConnected}
            className="btn w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;