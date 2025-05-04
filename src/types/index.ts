export interface S3Object {
  Key: string;
  LastModified: Date;
  Size: number;
}

export interface Folder {
  name: string;
  displayName: string;
  thumbnailUrl: string;
}

export interface MediaItem {
  key: string;
  url: string;
}

export interface FolderMapping {
  [key: string]: string;
} 