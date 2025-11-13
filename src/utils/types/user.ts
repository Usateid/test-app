export type UserProfileData = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  image: string | null;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  birthDate: Date | null;
  taxCode: string | null;
};
