export type Profile = {
  id: string;
  name: string;
  avatar_url?: string;
};

export type GetUserProfileResponse = {
  email: string;
  profile: Profile;
};