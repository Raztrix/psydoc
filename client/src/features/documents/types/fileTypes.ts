export interface UploadedFile {
  id?: number;
  fileName: string;
  description: string;
  uploadDate: string;
}

export interface FileState {
  files: UploadedFile[];
  isUploading: boolean;
  uploadError: string | null;
}

export interface FilePointer {
  id: number;
  fileName: string;
  originalName: string;
  description: string;
  sizeBytes: string;
  createdAt: string;
}

export interface getFilesResponse {
  data: UploadedFile[];
  success: boolean;
  message: string;
}
