import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, XCircle, Loader2 } from 'lucide-react';
// Import Redux hooks
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import { startUpload, uploadSuccess, uploadFailure } from '../fileSlice.ts';

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');

    // Use Redux State!
    const dispatch = useAppDispatch();
    const { isUploading, uploadError } = useAppSelector((state) => state.files);
    const [successMsg, setSuccessMsg] = useState(false); // Local UI state for animation

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        // 1. Tell Redux we are starting
        dispatch(startUpload());

        const formData = new FormData();
        formData.append('document', file);
        formData.append('description', description);

        try {
            const res = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // 2. Tell Redux we finished (Pass the fake file data for now)
            dispatch(uploadSuccess({
                filename: file.name,
                description: description,
                uploadDate: new Date().toISOString()
            }));

            setSuccessMsg(true);
            setFile(null);
            setDescription('');

            setTimeout(() => setSuccessMsg(false), 3000);

        } catch (err: any) {
            console.error(err);
            // 3. Tell Redux we failed
            dispatch(uploadFailure('Failed to upload file'));
        }
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

            <form onSubmit={handleUpload} className="space-y-4">
                {/* File Input */}
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
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
                    disabled={!file || isUploading}
                    className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all ${
                        !file || isUploading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                    }`}
                >
                    {isUploading ? (
                        <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} /> Uploading...
            </span>
                    ) : (
                        'שמור'
                    )}
                </button>

                {/* Status Messages */}
                {successMsg && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center font-medium animate-pulse">
                        Upload Successful!
                    </div>
                )}
                {uploadError && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center flex items-center justify-center gap-2">
                        <XCircle size={16} /> {uploadError}
                    </div>
                )}
            </form>
        </div>
    );
}