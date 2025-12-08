export interface UserSettingDto {
  newBlog: boolean;
  receiveMail: boolean;
}

export interface UserDto {
  id: string; // Guid -> string
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  gender: boolean;
  age: number;
  roleName: string;
  isApproved: boolean;
  createdDate: string; // DateTime -> string
  updatedDate: string; // DateTime -> string
  isActive: boolean;
  userSetting: UserSettingDto;
  imageSrc?: string;
  imageName?: string;
}

export interface AccessToken {
  token?: string;
  expiration?: string; // DateTime -> string
  user?: UserDto;
}
export interface UserUpdateDto {
  firstName: string;
  lastName: string;
  gender: boolean;
  newBlog: boolean;
  passwordIsChange: boolean;
  oldPassword?: string | null;
  password?: string | null;
  passwordRepeat?: string | null;
}
