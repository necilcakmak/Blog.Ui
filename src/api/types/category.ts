export interface CategoryDto {
  id: string; // Guid → string
  name?: string | null;
  tagName?: string | null;
  parentCategoryId: string; // Guid → string
  parentCategoryDto: ParentCategoryDto;
}

export interface ParentCategoryDto {
  id: string; // Guid → string
  name: string;
}

export interface CategoryAddDto {
  name: string;
  tagName?: string | null;
  parentCategoryId: string;
}

export interface CategoryUpdateDto {
  id: string;
  name: string; 
  tagName?: string;
  parentCategoryId: string;
}