export interface IUser {
  _id: string;
  email: string;
  name: string;
  password: string;
  isAdmin: boolean;
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserToken {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}
