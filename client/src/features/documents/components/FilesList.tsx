import LoadingSpinner from '../../../components/feedback/LoadingSpinner.tsx';
import api from '../../../app/axiosClient.ts';
import type { getFilesResponse, UploadedFile } from '../types/fileTypes.ts';
import type { AxiosResponse } from 'axios';
import { useQuery } from '@tanstack/react-query';

const getAllFiles: () => Promise<UploadedFile[]> = async () => {
  const res: AxiosResponse<getFilesResponse> = await api.get(`/getfiles`);
  return res.data.data;
};

export default function FilesList() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['files'], // A unique name for this data
    queryFn: getAllFiles, // The function that fetches it
  });

  const handleDownload = async (id: number | undefined, originalName: string) => {
    if (id) {
      try {
        // 1. Request the file from the backend
        // We must set responseType to 'blob' so Axios handles the binary data correctly
        const response = await api.get(`/download/${id}`, {
          responseType: 'blob',
        });

        // 2. Create a temporary URL for the binary data
        // This makes the downloaded data accessible to the browser as a "file"
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // 3. Create a temporary invisible link element
        const link = document.createElement('a');
        link.href = url;

        // 4. Force the filename
        // We use the 'originalName' from your list (e.g. "Patient_Report.pdf")
        link.setAttribute('download', originalName);

        // 5. Append to body, click it, and remove it
        // This triggers the browser's native download behavior
        document.body.appendChild(link);
        link.click();

        // 6. Cleanup to prevent memory leaks
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        alert('הורדת הקובץ נכשלה. אנא נסה שוב.'); // "File download failed. Please try again."
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">העלאות אחרונות</h2>
      {data && data.length > 0 ? (
        <ul className="w-full bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-2xl shadow-purple-900/20 border border-purple-500/30 overflow-hidden">
          {data.map((file) => (
            <li
              key={file.id}
              onClick={() => handleDownload(file.id, file.fileName)}
              className="group flex items-center justify-between p-4 border-b border-purple-500/20 last:border-b-0 hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-purple-400 group-hover:text-purple-200 transition-colors">
                  📄
                </span>
                <span className="text-gray-300 font-medium group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(168,85,247,0.5)] transition-all">
                  {file.fileName}
                </span>
              </div>
              <span className="text-purple-400/50 text-sm group-hover:translate-x-1 transition-transform">
                →
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center text-gray-400">
          הרשימה ריקה
        </div>
      )}
    </div>
  );
}
