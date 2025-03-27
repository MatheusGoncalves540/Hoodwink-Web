export interface User {
  id?: string;
  nickname: string;
  email: string;
  password?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
