export interface IUser {
  name: string;
  email: string;
  password: string;
  age?: number | null;
}

export interface IUpdateUser extends IUser {
  is_Active: boolean;
}
