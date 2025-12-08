import { deleteData, getData, postData } from "@/lib/apiService";

import { LoginDto, RegisterDto } from "@/api/types/auth";
import { AccessToken, UserDto } from "./types/user";
import { ArticleDto } from "./types/article";

export const login = (payload: LoginDto) =>
  postData<AccessToken>("auth/login", payload);
export const register = (payload: RegisterDto) =>
  postData<AccessToken>("auth/register", payload);

export const getArticles = () => getData<ArticleDto[]>("article/getList");
export const deleteArticle = (id: string) => deleteData(`article/delete/${id}`);

export const getUsers = () => getData<UserDto[]>("user/getList");
export const deleteUser = (id: string) => deleteData(`user/delete/${id}`);

export const getCategories = () => getData<UserDto[]>("category/getList");
export const deleteCategory = (id: string) =>
  deleteData(`category/delete/${id}`);
