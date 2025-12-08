export interface CategoryDto {
  id: string;                       // Guid → string
  name?: string | null;
  tagName?: string | null;
  parentCategoryId: string;         // Guid → string
  parentCategoryDto: ParentCategoryDto;
}

export interface ParentCategoryDto {
  id: string;   // Guid → string
  name: string;
}
