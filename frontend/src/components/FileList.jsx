/**
 * FileList Component
 * Displays a list of PDF files detected in the documents folder.
 * Handles loading and empty states.
 */

import { useEffect, useState } from "react";
import { FileText, FolderOpen, RefreshCw } from "lucide-react";
import { fetchFiles } from "../api";

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
function formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function FileList() {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch files on mount
    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchFiles();
            setFiles(data);
        } catch (err) {
            setError(err.message || "Failed to load files");
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="card p-8 text-center animate-pulse">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-parchment-300">Scanning documents folder...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="card p-8 text-center">
                <p className="text-crimson-400 mb-4">{error}</p>
                <button onClick={loadFiles} className="btn-secondary inline-flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Retry
                </button>
            </div>
        );
    }

    // Empty state
    if (files.length === 0) {
        return (
            <div className="card p-8 text-center">
                <FolderOpen className="w-16 h-16 text-parchment-300/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-parchment-100 mb-2">
                    No PDFs Found
                </h3>
                <p className="text-parchment-300 mb-4">
                    Place PDF files in the{" "}
                    <code className="font-mono bg-ink-700 px-2 py-1 rounded">./documents</code>{" "}
                    folder to get started.
                </p>
                <button onClick={loadFiles} className="btn-secondary inline-flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>
        );
    }

    // Files list
    return (
        <div className="card overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-ink-700 flex items-center justify-between bg-ink-800/50">
                <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-parchment-100">
                        Documents
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-mono bg-ink-700 text-parchment-300 rounded-full">
                        {files.length} PDF{files.length !== 1 ? "s" : ""}
                    </span>
                </div>
                <button
                    onClick={loadFiles}
                    className="p-2 text-parchment-300 hover:text-amber-500 hover:bg-ink-700 rounded-lg transition-all"
                    title="Refresh file list"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* File List */}
            <ul className="divide-y divide-ink-700/50">
                {files.map((file, index) => (
                    <li
                        key={index}
                        className="p-4 flex items-center gap-4 hover:bg-ink-700/30 transition-all duration-200 group"
                    >
                        {/* PDF Icon */}
                        <div className="relative flex-shrink-0">
                            <FileText className="w-10 h-10 text-crimson-400 group-hover:text-crimson-500 transition-colors" />
                            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-crimson-500 text-white rounded">
                                PDF
                            </span>
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-parchment-100 font-medium truncate group-hover:text-amber-500 transition-colors">
                                {file.name}
                            </p>
                            <p className="text-parchment-300/70 text-sm font-mono">
                                {formatFileSize(file.size)}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FileList;

