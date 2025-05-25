import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { FileCheck, AlertCircle } from 'lucide-react';

const CharityRegistration: React.FC = () => {
  const { contract, account, isConnected } = useWeb3();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metadataUrl: ''
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
    
    const { name, description, metadataUrl } = formData;
    
    if (!name || !description || !metadataUrl) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Check if already a charity
      const charityInfo = await contract.methods.charities(account).call();
      if (charityInfo.isActive) {
        setError('This address is already registered as a charity');
        setLoading(false);
        return;
      }
      
      // Check for pending requests
      const requests = await contract.methods.getCharityRequests().call();
      const hasPendingRequest = requests.some(
        (request: any) => request.requester.toLowerCase() === account.toLowerCase() && !request.approved
      );
      
      if (hasPendingRequest) {
        setError('You already have a pending registration request');
        setLoading(false);
        return;
      }
      
      // Submit registration request
      await contract.methods
        .requestCharityRegistration(name, description, metadataUrl)
        .send({ from: account });
      
      setSuccess(true);
      setFormData({ name: '', description: '', metadataUrl: '' });
      
    } catch (err: any) {
      console.error('Charity registration error:', err);
      setError(err.message || 'Failed to submit registration request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Register as a Charity</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Complete this form to request registration as a verified charity on our platform
        </p>
      </div>
      
      {!isConnected ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
          <div className="flex">
            <AlertCircle className="text-yellow-500 mr-3 flex-shrink-0" size={20} />
            <p className="text-yellow-700 dark:text-yellow-400">
              Please connect your wallet to register as a charity
            </p>
          </div>
        </div>
      ) : success ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 text-center">
          <FileCheck className="mx-auto text-green-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-2">
            Registration Request Submitted!
          </h3>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Your charity registration request has been submitted successfully. An administrator will review your request.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            Register Another Charity
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={20} />
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}
          
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Charity Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter charity name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your charity's mission and activities"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
          
          <div>
            <label 
              htmlFor="metadataUrl" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Website URL
            </label>
            <input
              type="url"
              id="metadataUrl"
              name="metadataUrl"
              value={formData.metadataUrl}
              onChange={handleChange}
              placeholder="https://yourcharity.org"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <strong>Note:</strong> Registration requests are reviewed by platform administrators to ensure the legitimacy of charities. This process may take 1-2 business days.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Registration Request'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CharityRegistration;