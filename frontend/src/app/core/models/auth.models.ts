export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  isGuest: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}
