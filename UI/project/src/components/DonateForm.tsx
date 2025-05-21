import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { formatEther } from '../utils/helpers';

const DonateForm: React.FC = () => {
  const { web3, contract, account, isConnected, minDonation } = useWallet();
  
  const [charityAddress, setCharityAddress] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const validateDonation = () => {
    if (!amount) {
      setValidationError(null);
      return false;
    }
    
    try {
      const amountWei = web3?.utils.toWei(amount, 'ether');
      if (!amountWei || !minDonation) {
        setValidationError(null);
        return false;
      }
      
      if (BigInt(amountWei) < BigInt(minDonation)) {
        const minEth = web3?.utils.fromWei(minDonation, 'ether');
        setValidationError(`Minimum donation is ${minEth} ETH`);
        return false;
      } else {
        setValidationError(null);
        return true;
      }
    } catch (error) {
      setValidationError('Invalid amount');
      return false;
    }
  };
  
  useEffect(() => {
    validateDonation();
  }, [amount, minDonation]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!charityAddress || !campaignId || !amount) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!validateDonation()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Verify charity and campaign
      try {
        const charityInfo = await contract.methods.charities(charityAddress).call();
        if (!charityInfo.isActive) {
          setError('This charity is not approved or is inactive');
          setLoading(false);
          return;
        }
        
        const campaigns = await contract.methods.getCampaigns(charityAddress).call();
        const campaignIndex = parseInt(campaignId);
        
        if (!campaigns[campaignIndex]) {
          setError('Campaign not found for this address');
          setLoading(false);
          return;
        }
        
        const campaign = campaigns[campaignIndex];
        if (!campaign.isActive) {
          setError('This campaign is not active');
          setLoading(false);
          return;
        }
        
        const now = Math.floor(Date.now() / 1000);
        if (Number(campaign.deadline) < now) {
          setError('This campaign has ended');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error validating campaign:', error);
        setError('Error validating campaign. Please check the charity address and campaign ID');
        setLoading(false);
        return;
      }
      
      // Make donation
      const amountWei = web3?.utils.toWei(amount, 'ether');
      await contract.methods
        .donateToCampaign(charityAddress, campaignId, message)
        .send({ from: account, value: amountWei });
      
      setSuccess('Donation sent successfully!');
      setCharityAddress('');
      setCampaignId('');
      setMessage('');
      setAmount('');
    } catch (error: any) {
      console.error('Donation failed:', error);
      setError(error.message || 'Donation failed. Please try again.');
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
            <label htmlFor="charityAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Charity Address
            </label>
            <input
              id="charityAddress"
              type="text"
              value={charityAddress}
              onChange={(e) => setCharityAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="campaignId" className="block text-sm font-medium text-gray-700 mb-1">
              Campaign ID
            </label>
            <input
              id="campaignId"
              type="number"
              min="0"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              placeholder="e.g., 0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (ETH)
            </label>
            <input
              id="amount"
              type="number"
              step="0.001"
              min="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="E.g., 0.1"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationError ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {validationError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationError}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message with your donation"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={loading || !isConnected || !!validationError}
            className="btn w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Send Donation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonateForm;