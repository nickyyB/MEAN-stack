export interface Agency {
  email: string;
  image: string;
  password: string;
  phone: string;
  type: string;
  username: string;
  PIB: string;
  address: Address;
  description: string;
  name: string;
}

export interface Address {
  city: string;
  country: string;
  number: string;
  street: string;
}
