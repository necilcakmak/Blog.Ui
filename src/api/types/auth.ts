
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  birthDate: Date;
  gender: boolean;
}
