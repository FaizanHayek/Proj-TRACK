export interface UserProfile {
  name: string;
  avatar: string; // Base64 data URL or custom gradient selection
}

export interface Project {
  id: string;
  name: string;
  potentialRevenue: number;
  revenueEarned: number;
  createdAt: number;
}
