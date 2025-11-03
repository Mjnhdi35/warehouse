export interface FileInfo {
  name: string;
  type: 'directory' | 'file';
  size?: number;
  modified?: string;
  path: string;
}

export interface ListFilesResponse {
  path: string;
  currentDir: string;
  files: FileInfo[];
}

export interface ListFilesErrorResponse {
  error: string;
  path: string;
}
