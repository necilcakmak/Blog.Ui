import { CategoryDto } from "./category";
import { CommentDto } from "./comment";
import { UserDto } from "./user";

export interface ArticleDto {
  id: string; // Guid → string
  userId: string;
  categoryId: string;
  title?: string | null;
  content?: string | null;
  thumbnail?: string | null;
  imageUrl: string;
  slug?: string | null;
  keywords?: string | null;
  viewsCount: number;
  commentCount: number;
  publishedDate: Date;
  user: UserDto;
  category: CategoryDto;
  comments: CommentDto[];
}

export interface ArticleAddDto {
  title: string;
  content: string;
  thumbnailBase64: string;
  publishedDate: Date;
  categoryId: string; // Guid → string
  slug: string;
  keywords: string;
}

export interface ArticleUpdateDto {
  id: string; // Guid → string
  title?: string | null;
  content?: string | null;
  categoryId: string; // Guid → string
  thumbnail?: string | null;
  slug: string;
  keywords: string;
}
