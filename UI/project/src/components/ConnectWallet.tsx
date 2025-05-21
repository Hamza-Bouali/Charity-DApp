import React from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { truncateAddress } from '../utils/helpers';

const ConnectWallet: React.FC = () => {
  const { account, isConnected, connectWallet } = useWallet();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="bg-blue-100 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Wallet Status</h3>
            <p className="text-sm text-gray-600">
              {isConnected
                ? `Connected: ${truncateAddress(account as string)}`
                : 'Please connect your wallet to interact with the dApp'}
            </p>
          </div>
        </div>
        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="btn px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="px-4 py-2 bg-green-100 text-green-800 font-medium rounded-md">
            Connected
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;