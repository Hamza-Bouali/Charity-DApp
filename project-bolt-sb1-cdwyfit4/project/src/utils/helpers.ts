import Web3 from 'web3';

export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEther = (wei: string, web3?: Web3 | null): string => {
  if (!web3) return '0';
  try {
    return web3.utils.fromWei(wei, 'ether');
  } catch (error) {
    console.error('Error formatting ether value:', error);
    return '0';
  }
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const daysLeft = (deadline: number): number => {
  const currentTime = Math.floor(Date.now() / 1000);
  const remainingTime = deadline - currentTime;
  return Math.max(0, Math.floor(remainingTime / 86400)); // 86400 seconds in a day
};

export const calculateProgressPercentage = (raised: string, goal: string): number => {
  if (!raised || !goal || parseFloat(goal) === 0) return 0;
  
  const percentage = (parseFloat(raised) / parseFloat(goal)) * 100;
  return Math.min(100, percentage); // Cap at 100%
};