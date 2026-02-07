//type of post to be created

export interface PostData {
  title: string;
  content: string;
  imageUrl?: string;
  categoryId?: string;
  tagsId: string[];
  status?: "draft" | "published" | "archived";
}
