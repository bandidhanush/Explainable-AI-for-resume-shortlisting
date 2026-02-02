import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Award, Sparkles, BrainCircuit } from 'lucide-react';
import ExplanationView from './ExplanationView';

const CandidateCard = ({ candidate, rank }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Helper colors/gradients based on score
    const getTheme = (score) => {
        if (score >= 80) return {
            color: 'text-secondary',
            bg: 'bg-secondary',
            border: 'border-secondary',
            gradient: 'from-secondary',
            shadow: 'shadow-secondary/20'
        };
        if (score >= 60) return {
            color: 'text-primary',
            bg: 'bg-primary',
            border: 'border-primary',
            gradient: 'from-primary',
            shadow: 'shadow-primary/20'
        };
        return {
            color: 'text-amber-500',
            bg: 'bg-amber-500',
            border: 'border-amber-500',
            gradient: 'from-amber-500',
            shadow: 'shadow-amber-500/20'
        };
    };

    const theme = getTheme(candidate.score);

    // Get top positive and negative features
    const sortedExplanation = [...candidate.explanation].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
    const topPositive = sortedExplanation.filter(([_, val]) => val > 0).slice(0, 3);
    const topNegative = sortedExplanation.filter(([_, val]) => val < 0).slice(0, 3);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-panel overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-1 ring-white/10 bg-white/[0.02]' : 'hover:bg-white/[0.02]'}`}
        >
            {/* Main Card Header (Always Visible) */}
            <div
                className="p-6 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-6">
                    {/* Rank / Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient}/20 to-transparent border ${theme.border}/20 flex items-center justify-center shadow-lg ${theme.shadow}`}>
                            {rank ? (
                                <div className="text-center">
                                    <div className={`text-xs font-bold uppercase tracking-wider ${theme.color} opacity-80`}>Rank</div>
                                    <div className={`text-2xl font-bold ${theme.color}`}>#{rank}</div>
                                </div>
                            ) : (
                                <span className={`text-2xl font-bold ${theme.color}`}>{candidate.name.charAt(0)}</span>
                            )}
                        </div>
                        {rank === 1 && (
                            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-300 to-amber-500 w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40">
                                <Award className="w-3.5 h-3.5 text-black fill-current" />
                            </div>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-heading truncate tracking-tight">{candidate.name}</h3>
                            {candidate.score >= 90 && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> TOP TALENT
                                </span>
                            )}
                        </div>

                        {/* Quick Insights Pills */}
                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-body/80 border border-white/5">
                                <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                                <span>{topPositive.length} Strengths</span>
                            </div>
                            {topNegative.length > 0 && (
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-body/80 border border-white/5">
                                    <TrendingDown className="w-3.5 h-3.5 text-primary" />
                                    <span>{topNegative.length} Risks</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-body/40 ml-auto">
                                <BrainCircuit className="w-3.5 h-3.5" />
                                <span>AI Scored</span>
                            </div>
                        </div>
                    </div>

                    {/* Score Circle */}
                    <div className="flex-shrink-0 flex flex-col items-center pl-6 border-l border-white/5">
                        <div className="relative flex items-center justify-center">
                            <svg className="w-16 h-16 transform -rotate-90">
                                <circle
                                    className="text-white/5"
                                    strokeWidth="4"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="28"
                                    cx="32"
                                    cy="32"
                                />
                                <motion.circle
                                    className={`${theme.color}`}
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="28"
                                    cx="32"
                                    cy="32"
                                    initial={{ strokeDasharray: 2 * Math.PI * 28, strokeDashoffset: 2 * Math.PI * 28 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - candidate.score / 100) }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <span className={`absolute text-sm font-bold ${theme.color}`}>{candidate.score}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/5 bg-black/20"
                    >
                        <div className="p-6 pt-2">
                            {/* Match Summary */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary/80 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        Key Strengths
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {topPositive.map(([feat], i) => (
                                            <span key={i} className="px-2 py-1 rounded bg-secondary/10 text-secondary text-xs border border-secondary/10">
                                                {feat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {topNegative.length > 0 ? (
                                        <>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary/80 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                Possible Gaps
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {topNegative.map(([feat], i) => (
                                                    <span key={i} className="px-2 py-1 rounded bg-primary/10 text-primary text-xs border border-primary/10">
                                                        {feat}
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full flex items-center text-xs text-body/40 italic">
                                            No significant negative signals detected.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Full Visualization */}
                            <ExplanationView explanation={candidate.explanation} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collapse/Expand Footer */}
            <div
                className="bg-white/[0.02] border-t border-white/5 py-2 flex justify-center cursor-pointer hover:bg-white/5 transition-colors group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-body/40 group-hover:text-body transition-colors" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-body/40 group-hover:text-body transition-colors" />
                )}
            </div>
        </motion.div>
    );
};

export default CandidateCard;
