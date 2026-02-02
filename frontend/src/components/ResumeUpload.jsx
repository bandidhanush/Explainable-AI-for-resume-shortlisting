import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, Trash2, FilePlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ResumeUpload = ({ onUploadComplete }) => {
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [uploadedCandidates, setUploadedCandidates] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
        e.target.value = ''; // Reset for re-uploading same file
    };

    const handleFiles = async (files) => {
        if (files.length === 0) return;

        // Process each file
        for (const file of files) {
            await processFile(file);
        }
    };

    const processFile = async (file) => {
        // Skip non-PDF/TXT
        if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
            alert(`Skipped ${file.name}: Only PDF and TXT files are supported.`);
            return;
        }

        const fileId = `${file.name}-${Date.now()}`;

        setUploadingFiles(prev => [...prev, { id: fileId, name: file.name }]);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/parse_resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const candidate = {
                id: fileId,
                name: file.name.replace(/\.(pdf|txt)$/i, ''),
                resumeText: response.data.text,
                fileName: file.name,
                fileSize: file.size,
                status: 'success'
            };

            setUploadingFiles(prev => prev.filter(f => f.id !== fileId));

            setUploadedCandidates(prev => {
                const updated = [...prev, candidate];
                onUploadComplete(updated); // Critical: Notify parent
                return updated;
            });

        } catch (error) {
            console.error('Error uploading resume:', error);
            setUploadingFiles(prev => prev.filter(f => f.id !== fileId));

            // Optional: Show failed files in list or just alert
            setUploadedCandidates(prev => [...prev, {
                id: fileId,
                name: file.name,
                status: 'error',
                error: "Parse failed"
            }]);
        }
    };

    const removeCandidate = (id) => {
        setUploadedCandidates(prev => {
            const updated = prev.filter(c => c.id !== id);
            onUploadComplete(updated);
            return updated;
        });
    };

    const successCount = uploadedCandidates.filter(c => c.status === 'success').length;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-panel p-5 h-full flex flex-col transition-all border-2 ${isDragging ? 'border-primary/50 bg-primary/5' : 'border-transparent'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-lg border border-secondary/20 shadow-inner">
                        <Upload className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-heading text-sm">Candidates</h3>
                        <p className="text-[10px] text-body/60">{successCount} Ready for Analysis</p>
                    </div>
                </div>
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 hover:bg-white/5 rounded-lg text-secondary transition-colors"
                >
                    <FilePlus className="w-4 h-4" />
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt"
                multiple
                className="hidden"
            />

            {/* List Area */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                <AnimatePresence>
                    {/* Empty State */}
                    {uploadedCandidates.length === 0 && uploadingFiles.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-white/10 rounded-xl bg-white/[0.02]"
                        >
                            <div className="w-10 h-10 rounded-full bg-surface-highlight flex items-center justify-center mb-2">
                                <FileText className="w-5 h-5 text-body/40" />
                            </div>
                            <p className="text-xs font-medium text-body">No candidates yet</p>
                            <p className="text-[10px] text-body/50 mt-1">Drag PDF resumes here</p>
                        </motion.div>
                    )}

                    {/* Uploading Items */}
                    {uploadingFiles.map((file) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-3 bg-surface-highlight/50 rounded-lg border border-white/5 flex items-center gap-3"
                        >
                            <Loader2 className="w-3.5 h-3.5 text-secondary animate-spin" />
                            <span className="text-xs text-body truncate flex-1">{file.name}</span>
                        </motion.div>
                    ))}

                    {/* Final Items */}
                    {uploadedCandidates.map((candidate) => (
                        <motion.div
                            key={candidate.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className={`group relative p-3 rounded-lg border flex items-center gap-3 transition-all ${candidate.status === 'success'
                                    ? 'bg-secondary/5 border-secondary/10 hover:border-secondary/30'
                                    : 'bg-red-500/5 border-red-500/10'
                                }`}
                        >
                            <div className={`p-1.5 rounded-md ${candidate.status === 'success' ? 'bg-secondary/10' : 'bg-red-500/10'}`}>
                                <FileText className={`w-3.5 h-3.5 ${candidate.status === 'success' ? 'text-secondary' : 'text-red-400'}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-heading truncate">{candidate.name}</p>
                                <p className="text-[10px] text-body/50 truncate">
                                    {candidate.status === 'error' ? 'Parsing failed' : `${(candidate.fileSize / 1024).toFixed(0)} KB`}
                                </p>
                            </div>

                            <button
                                onClick={() => removeCandidate(candidate.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-md text-body/60 hover:text-red-400 transition-all absolute right-2 bg-surface-highlight shadow-lg"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Drop Overlay */}
            {isDragging && (
                <div className="absolute inset-0 bg-secondary/10 backdrop-blur-sm rounded-2xl border-2 border-dashed border-secondary flex items-center justify-center z-10 animate-fade-in">
                    <div className="bg-surface px-4 py-2 rounded-lg shadow-xl border border-white/10 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-secondary animate-bounce" />
                        <span className="text-sm font-semibold text-heading">Drop to Upload</span>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ResumeUpload;
