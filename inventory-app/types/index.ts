export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  description: string;
  quantity: number;
  expiryDate: Date;
  photoUrl?: string;
  userId: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntryExitRecord {
  id: string;
  productId: string;
  productName: string;
  type: 'entry' | 'exit';
  quantity: number;
  userId: string;
  userName: string;
  note?: string;
  timestamp: Date;
}

export interface UsageStatistics {
  totalProducts: number;
  expiredProducts: number;
  expiringProducts: number;
  totalEntries: number;
  totalExits: number;
  productsByType: { [key: string]: number };
  userActivity: { [key: string]: number };
}
