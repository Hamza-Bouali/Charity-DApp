import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { initWeb3, getWeb3Instances } from '../utils/web3';

interface Web3ContextType {
  web3: any;
  contract: any;
  account: string | null;
  isConnected: boolean;
  isAdmin: boolean;
  isCharity: boolean;
  connectWallet: () => Promise<void>;
  loading: boolean;
}

const defaultContext: Web3ContextType = {
  web3: null,
  contract: null,
  account: null,
  isConnected: false,
  isAdmin: false,
  isCharity: false,
  connectWallet: async () => {},
  loading: true
};

const Web3Context = createContext<Web3ContextType>(defaultContext);

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [web3State, setWeb3State] = useState({
    web3: null,
    contract: null,
    account: null,
    isConnected: false,
    isAdmin: false,
    isCharity: false,
    loading: true
  });

  const connectWallet = async () => {
    try {
      setWeb3State(prev => ({ ...prev, loading: true }));
      const result = await initWeb3();
      
      if (result) {
        const { web3, account, contract } = result;
        
        try {
          // Check if account is admin (contract owner)
          const owner = await contract.methods.owner().call({
            from: account,
            gas: 50000 // Add reasonable gas limit for view function
          });
          
          const isAdmin = owner.toLowerCase() === account.toLowerCase();
          
          // Check if account is a charity
          const charityInfo = await contract.methods.charities(account).call({
            from: account,
            gas: 50000 // Add reasonable gas limit for view function
          });
          
          const isCharity = charityInfo?.isActive || false;
          
          setWeb3State({
            web3,
            contract,
            account,
            isConnected: true,
            isAdmin,
            isCharity,
            loading: false
          });
        } catch (contractError) {
          console.error('Contract interaction error:', contractError);
          // Still set the connection but with default roles
          setWeb3State({
            web3,
            contract,
            account,
            isConnected: true,
            isAdmin: false,
            isCharity: false,
            loading: false
          });
        }
      } else {
        setWeb3State(prev => ({ 
          ...prev, 
          loading: false,
          isConnected: false 
        }));
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWeb3State(prev => ({ 
        ...prev, 
        loading: false,
        isConnected: false
      }));
    }
  };

  // Auto connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      try {
        if (window.ethereum && window.ethereum.selectedAddress) {
          await connectWallet();
        } else {
          setWeb3State(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Auto connect error:', error);
        setWeb3State(prev => ({ ...prev, loading: false }));
      }
    };
    
    autoConnect();
  }, []);

  const contextValue = {
    ...web3State,
    connectWallet
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};