import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { toWei } from '../utils/web3';
import { Heart } from 'lucide-react';

const Donate: React.FC = () => {
  const { contract, account, isConnected } = useWeb3();
  const [formData, setFormData] = useState({
    charityAddress: '',
    campaignId: '',
    amount: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !contract || !account) {
      setError('Please connect your wallet first');
      return;
    }
    
    const { charityAddress, campaignId, amount, message } = formData;
    
    if (!charityAddress || !campaignId || !amount) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const amountWei = toWei(amount);
      
      await contract.methods
        .donateToCampaign(charityAddress, campaignId, message)
        .send({ from: account, value: amountWei });
      
      setSuccess(true);
      setFormData({ charityAddress: '', campaignId: '', amount: '', message: '' });
      
    } catch (err: any) {
      console.error('Donation error:', err);
      setError(err.message || 'Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Please connect your wallet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You need to connect your wallet to make donations
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Make a Donation</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Support charitable campaigns with your contribution
        </p>
      </div>
      
      {success ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 text-center">
          <Heart className="mx-auto text-green-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">
            Thank you for your donation!
          </h3>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Your contribution has been processed successfully
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Make Another Donation
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <div>
            <label 
              htmlFor="charityAddress" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Charity Address *
            </label>
            <input
              type="text"
              id="charityAddress"
              name="charityAddress"
              value={formData.charityAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="campaignId" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Campaign ID *
            </label>
            <input
              type="number"
              id="campaignId"
              name="campaignId"
              value={formData.campaignId}
              onChange={handleChange}
              min="0"
              placeholder="Campaign ID number"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="amount" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Amount (ETH) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Add a message to your donation"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : 'Make Donation'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Donate;