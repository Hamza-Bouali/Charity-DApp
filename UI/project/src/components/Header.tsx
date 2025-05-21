import React from 'react';
import { Heart } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { isConnected } = useWallet();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">CharityChain</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button
              className={`px-3 py-2 font-medium rounded-md transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-3 py-2 font-medium rounded-md transition-colors ${
                activeTab === 'campaigns'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('campaigns')}
            >
              Campaigns
            </button>
            {isConnected && (
              <>
                <button
                  className={`px-3 py-2 font-medium rounded-md transition-colors ${
                    activeTab === 'create'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('create')}
                >
                  Create Campaign
                </button>
                <button
                  className={`px-3 py-2 font-medium rounded-md transition-colors ${
                    activeTab === 'donate'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('donate')}
                >
                  Donate
                </button>
                <button
                  className={`px-3 py-2 font-medium rounded-md transition-colors ${
                    activeTab === 'requestCharity'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('requestCharity')}
                >
                  Request Charity
                </button>
                <button
                  className={`px-3 py-2 font-medium rounded-md transition-colors ${
                    activeTab === 'approveCharity'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab('approveCharity')}
                >
                  Approve Requests
                </button>
              </>
            )}
          </nav>
          <div className="md:hidden">
            <button 
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => {
                const menu = document.getElementById('mobile-menu');
                if (menu) {
                  menu.classList.toggle('hidden');
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div id="mobile-menu" className="hidden md:hidden border-t border-gray-200 bg-white">
        <div className="px-4 py-2 space-y-1">
          <button
            className={`block w-full text-left px-3 py-2 font-medium rounded-md ${
              activeTab === 'dashboard'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => {
              setActiveTab('dashboard');
              document.getElementById('mobile-menu')?.classList.add('hidden');
            }}
          >
            Dashboard
          </button>
          <button
            className={`block w-full text-left px-3 py-2 font-medium rounded-md ${
              activeTab === 'campaigns'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => {
              setActiveTab('campaigns');
              document.getElementById('mobile-menu')?.classList.add('hidden');
            }}
          >
            Campaigns
          </button>
          {isConnected && (
            <>
              <button
                className={`block w-full text-left px-3 py-2 font-medium rounded-md ${
                  activeTab === 'create'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => {
                  setActiveTab('create');
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
              >
                Create Campaign
              </button>
              <button
                className={`block w-full text-left px-3 py-2 font-medium rounded-md ${
                  activeTab === 'donate'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => {
                  setActiveTab('donate');
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
              >
                Donate
              </button>
              <button
                className={`block w-full text-left px-3 py-2 font-medium rounded-md ${
                  activeTab === 'requestCharity'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => {
                  setActiveTab('requestCharity');
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
              >
                Request Charity
              </button>
              <button
                className={`block w-full text-left px-3 py-2 font-medium rounded-md ${
                  activeTab === 'approveCharity'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => {
                  setActiveTab('approveCharity');
                  document.getElementById('mobile-menu')?.classList.add('hidden');
                }}
              >
                Approve Requests
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;