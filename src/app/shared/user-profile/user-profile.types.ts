export interface UserProfileUser {
  firstName: string;
  lastName: string;
  role: string;
  location: string;
  avatar: string;
  email: string;
  phone: string;
  bio: string;
}

export interface UserProfilePersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

export interface UserProfileSocialLinks {
  facebook: string;
  x: string;
  linkedin: string;
  instagram: string;
}

export interface UserProfileAddress {
  country: string;
  cityState: string;
  postalCode: string;
  taxId: string;
}
