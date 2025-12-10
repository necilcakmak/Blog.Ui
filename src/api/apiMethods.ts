import { deleteData, getData, postData, putData } from "@/lib/apiService";

import { LoginDto, RegisterDto } from "@/api/types/auth";
import { AccessToken, UserDto } from "./types/user";
import { ArticleAddDto, ArticleDto, ArticleUpdateDto } from "./types/article";
import {
  CategoryAddDto,
  CategoryDto,
  CategoryUpdateDto,
} from "./types/category";

export const login = (payload: LoginDto) =>
  postData<AccessToken>("auth/login", payload);
export const register = (payload: RegisterDto) =>
  postData<AccessToken>("auth/register", payload);

export const getArticles = () => getData<ArticleDto[]>("article/getList");
export const getArticle = (id: string) =>
  getData<ArticleDto>(`article/get/${id}`);
export const createArticle = (payload: ArticleAddDto) =>
  postData("article/add", payload);
export const updateArticle = (payload: ArticleUpdateDto) =>
  putData("article/update", payload);

export const deleteArticle = (id: string) => deleteData(`article/delete/${id}`);

export const getUsers = () => getData<UserDto[]>("user/getList");
export const deleteUser = (id: string) => deleteData(`user/delete/${id}`);

export const createCategory = (payload: CategoryAddDto) =>
  postData("category/add", payload);
export const getCategories = () => getData<UserDto[]>("category/getList");
export const deleteCategory = (id: string) =>
  deleteData(`category/delete/${id}`);
export const getCategory = (id: string) =>
  getData<CategoryDto>(`category/get/${id}`);
export const updateCategory = (payload: CategoryUpdateDto) =>
  putData("category/update", payload);

export const deleteComment = (id: string) => deleteData(`comment/delete/${id}`);

export const getParentCategories = () =>
  getData<UserDto[]>("parentcategory/getList");
