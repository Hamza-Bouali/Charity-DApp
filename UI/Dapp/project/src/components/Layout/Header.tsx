import React from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { formatAddress } from '../../utils/web3';
import { Wallet, Loader } from 'lucide-react';

const Header: React.FC = () => {
  const { account, isConnected, connectWallet, loading } = useWeb3();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-4 px-6 fixed top-0 right-0 left-64 z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Transparent Charity Donations</h1>
        
        <div>
          {isConnected ? (
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatAddress(account || '')}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Wallet size={16} />
              )}
              <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;