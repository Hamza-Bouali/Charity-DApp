import React, { useState, useEffect } from 'react';
import { ChevronRight, Wallet, Globe, Heart, DollarSign, Gift, AlertCircle, LayoutDashboard } from 'lucide-react';
import Header from './components/Header';
import ConnectWallet from './components/ConnectWallet';
import CampaignList from './components/CampaignList';
import CreateCampaign from './components/CreateCampaign';
import DonateForm from './components/DonateForm';
import Dashboard from './components/Dashboard';
import { WalletProvider } from './context/WalletContext';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Header setActiveTab={setActiveTab} activeTab={activeTab} />
        
        <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <ConnectWallet />
            
            {activeTab === 'dashboard' && (
              <section className="mt-8">
                <div className="flex items-center space-x-2 mb-4">
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                </div>
                <Dashboard />
              </section>
            )}
            
            {activeTab === 'campaigns' && (
              <section className="mt-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
                </div>
                <CampaignList />
              </section>
            )}
            
            {activeTab === 'create' && (
              <section className="mt-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Gift className="w-5 h-5 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Create Campaign</h2>
                </div>
                <CreateCampaign />
              </section>
            )}
            
            {activeTab === 'donate' && (
              <section className="mt-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="w-5 h-5 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Make a Donation</h2>
                </div>
                <DonateForm />
              </section>
            )}
          </div>
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Charity Fundraising DApp. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;