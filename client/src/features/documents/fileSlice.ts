import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FileState, UploadedFile } from './types/fileTypes.ts';

const initialState: FileState = {
  files: [],
  isUploading: false,
  uploadError: null,
};

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    startUpload: (state) => {
      state.isUploading = true;
      state.uploadError = null;
    },
    uploadSuccess: (state, action: PayloadAction<UploadedFile>) => {
      state.isUploading = false;
      state.files.push(action.payload); // Redux Toolkit allows this "mutation" style!
    },
    uploadFailure: (state, action: PayloadAction<string>) => {
      state.isUploading = false;
      state.uploadError = action.payload;
    },
    setFiles: (state, action: PayloadAction<UploadedFile[]>) => {
      state.files = action.payload;
    },
  },
});

export const { startUpload, uploadSuccess, uploadFailure, setFiles } = fileSlice.actions;
export default fileSlice.reducer;
