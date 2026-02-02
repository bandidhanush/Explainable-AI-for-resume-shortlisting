import React from 'react';
import { FileText, Sparkles, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

const JobDescriptionInput = ({ value, onChange }) => {
    const charCount = value.length;
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel h-full flex flex-col"
        >
            <div className="p-5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <h2 className="text-sm font-semibold text-heading uppercase tracking-wide">Job Context</h2>
                    </div>
                    <p className="text-xs text-body/60 pl-8">Define the ideal candidate profile</p>
                </div>

                {/* Stats */}
                <div className="flex gap-3 text-[10px] font-mono text-body/40 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                    <span>{wordCount} WDS</span>
                    <span className="w-px h-3 bg-white/10" />
                    <span>{charCount} CHS</span>
                </div>
            </div>

            <div className="relative flex-1 p-0 group">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="e.g. Seeking a Senior Software Engineer with 5+ years of experience in Python, AWS, and Microservices architecture..."
                    className="w-full h-full min-h-[160px] bg-transparent p-5 text-sm leading-relaxed text-heading placeholder-body/30 outline-none resize-none custom-scrollbar font-medium"
                />

                {/* Subtle highlight effect on focus */}
                <div className="absolute inset-0 pointer-events-none border-2 border-primary/0 transition-colors duration-300 group-focus-within:border-primary/10 rounded-b-2xl" />
            </div>

            {/* Quick Actions / Tips Footer */}
            <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-body/50">
                    <Wand2 className="w-3 h-3 text-primary/60" />
                    <span>Pro Tip: Be specific about technical skills and years of experience.</span>
                </div>
                {value.length === 0 && (
                    <button
                        onClick={() => onChange("Looking for a Senior React Developer with Experience in Tailwind CSS, TypeScript and Node.js. Minimum 3 years of experience required.")}
                        className="text-[10px] font-medium text-primary hover:text-primary-hover hover:underline transition-all"
                    >
                        Auto-fill Example
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default JobDescriptionInput;
