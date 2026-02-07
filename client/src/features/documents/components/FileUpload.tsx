import { useState } from 'react';
import { UploadCloud, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../app/axiosClient.ts';

export default function FileUpload() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Note: We return the response so we can use it later if needed
      return await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      // 3. The Magic: Refresh the list immediately!
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setFile(null);
      alert('Upload Successful!');
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      alert('Upload failed. Check console.');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stop page reload

    if (!file) {
      alert('Please select a file first!');
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('document', file);
    formData.append('description', description);

    // Fire the mutation!
    uploadMutation.mutate(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">העלאת מסמכים</h2>
        <h5 className="font-bold text-gray-800">קבצים נתמכים:</h5>
        <h5 className="font-bold text-blue-400">pdf/word/excel</h5>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {file ? (
            <span className="text-green-600 font-medium flex items-center justify-center gap-2">
              <CheckCircle size={16} /> {file.name}
            </span>
          ) : (
            <span className="text-gray-500">לחץ כדי לבחור קובץ</span>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="אודות המסמך.."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || uploadMutation.isPending}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all ${
            !file || uploadMutation.isPending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
          }`}
        >
          {uploadMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} /> Uploading...
            </span>
          ) : (
            'שמור'
          )}
        </button>

        {/* Status Messages */}
        {uploadMutation.isSuccess && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center font-medium animate-pulse">
            Upload Successful!
          </div>
        )}
        {uploadMutation.isError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center flex items-center justify-center gap-2">
            <XCircle size={16} /> {uploadMutation.isError}
          </div>
        )}
      </form>
    </div>
  );
}
