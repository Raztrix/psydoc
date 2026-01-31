
import FileUpload from "../features/documents/components/FileUpload.tsx";
import Header from "../components/layout/Header.tsx";

export default function GeneralUploadDownloadDoc() {

    return (
        <div className="min-h-screen min-w-screen bg-gray-50 text-gray-800 font-sans">
            {/* 1. Header Section */}
            <Header />

            {/* 2. Main Content Area */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left Column: The Upload Component */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">העלה מסמך חדש</h2>
                        <FileUpload />
                    </section>

                    {/* Right Column: Placeholder for the File List (We will build this next) */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit opacity-50">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">העלאות אחרונות</h2>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center text-gray-400">
                            הרשימה ריקה
                        </div>
                    </section>

                </div>

            </main>
        </div>
    )
}
