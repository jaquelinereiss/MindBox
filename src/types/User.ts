export type Profile = {
  id: string;
  name: string;
};

export type GetUserProfileResponse = {
  email: string;
  profile: Profile;
};
