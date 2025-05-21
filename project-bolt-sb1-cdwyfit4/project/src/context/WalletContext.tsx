import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Web3 from 'web3';
import { contractABI, contractAddress } from '../utils/constants';

interface WalletContextType {
  web3: Web3 | null;
  account: string | null;
  contract: any;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  minDonation: string;
}

const WalletContext = createContext<WalletContextType>({
  web3: null,
  account: null,
  contract: null,
  isConnected: false,
  connectWallet: async () => {},
  minDonation: '0',
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [minDonation, setMinDonation] = useState('0');

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setIsConnected(false);
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [account]);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          
          const contractInstance = new web3Instance.eth.Contract(
            contractABI,
            contractAddress
          );
          
          setContract(contractInstance);
          
          const minDonationWei = await contractInstance.methods.minimumDonation().call();
          setMinDonation(minDonationWei);
        }
      } else {
        alert('Please install MetaMask to use this dApp!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        web3,
        account,
        contract,
        isConnected,
        connectWallet,
        minDonation,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};