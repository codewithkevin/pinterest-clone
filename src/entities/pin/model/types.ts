export type Pin = {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  title?: string;
  authorName?: string;
  boardId?: string;
  saved?: boolean;
};

export type Board = {
  id: string;
  title: string;
  pinCount: number;
  coverImageUrl: string;
};
