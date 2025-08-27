export interface UserDetails {
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
}

export interface User {
  name: string;
  id: string;
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string | null;
  createdAt: Date;
}
export interface Customer {
  name: string;
  id: string;
  clerkUserId: string;
  orderCount: number;
  email: string;
  image: string | null;
  createdAt: Date;
}
