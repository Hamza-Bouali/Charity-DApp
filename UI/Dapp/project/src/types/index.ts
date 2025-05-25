export interface Charity {
  address: string;
  name: string;
  description: string;
  metadataUrl: string;
  isActive: boolean;
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  goalAmount: string;
  totalDonated: string;
  deadline: number;
  isActive: boolean;
  charity: string;
}

export interface Donation {
  donor: string;
  amount: string;
  timestamp: number;
  message: string;
}

export interface CharityRequest {
  requester: string;
  name: string;
  description: string;
  metadataUrl: string;
  approved: boolean;
}

export interface CampaignRegistration {
  title: string;
  description: string;
  goalAmount: string;
  duration: number; // in days
}