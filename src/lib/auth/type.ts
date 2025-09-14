export interface UserProfileType {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string;
  createdAt: string;
  stripeCustomerId?: string
}