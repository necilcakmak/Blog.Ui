import { UserDto } from "./user";

export interface CommentDto {
  id: string;           // Guid → string
  userId: string;       // Guid → string
  articleId: string;    // Guid → string
  text?: string | null;
  user?: UserDto | null;
}
