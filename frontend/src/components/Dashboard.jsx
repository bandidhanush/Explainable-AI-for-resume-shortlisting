import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, Users, ArrowUpDown, AlertCircle, BarChart3, CheckCircle } from 'lucide-react';
import axios from 'axios';
import CandidateCard from './CandidateCard';

const Dashboard = ({ candidates, jdText }) => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('score'); // 'score' | 'name'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

    const validCandidates = candidates?.filter(c => c.status === 'success') || [];

    const handleBatchAnalyze = async () => {
        if (validCandidates.length === 0 || !jdText) return;

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const candidateData = validCandidates.map(c => ({
                name: c.name,
                resume_text: c.resumeText
            }));

            // Simulate a minimum loading time for better UX (so the user sees the spinner)
            const startTime = Date.now();

            const response = await axios.post('http://localhost:8000/batch_analyze', {
                candidates: candidateData,
                jd_text: jdText
            });

            // Ensure at least 800ms loading animation
            const elapsed = Date.now() - startTime;
            if (elapsed < 800) {
                await new Promise(resolve => setTimeout(resolve, 800 - elapsed));
            }

            if (response.data && response.data.results) {
                setResults(response.data.results);
            } else {
                throw new Error("Invalid response format from server");
            }
        } catch (err) {
            console.error('Batch analysis failed:', err);
            setError(err.message || "Failed to analyze candidates. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const getSortedResults = () => {
        if (results.length === 0) return [];

        const sorted = [...results].sort((a, b) => {
            if (sortBy === 'score') {
                return sortOrder === 'desc' ? b.score - a.score : a.score - b.score;
            } else {
                return sortOrder === 'desc'
                    ? b.name.localeCompare(a.name)
                    : a.name.localeCompare(b.name);
            }
        });

        return sorted;
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const sortedResults = getSortedResults();
    const hasResults = sortedResults.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-8"
        >
            {/* Action Bar / Status Area */}
            <div className={`glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-500 ${hasResults ? 'border-primary/20 bg-primary/5' : ''}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors duration-500 ${hasResults ? 'bg-primary text-white shadow-glow-primary' : 'bg-surface-highlight text-body'}`}>
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> :
                            hasResults ? <CheckCircle className="w-6 h-6" /> :
                                <BarChart3 className="w-6 h-6" />}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-heading">
                            {loading ? 'Analyzing Candidates...' :
                                hasResults ? 'Analysis Complete' :
                                    'Ready to Analyze'}
                        </h2>
                        <p className="text-sm text-body/80">
                            {loading ? 'Processing resumes with AI models...' :
                                hasResults ? `Found ${results.length} scored matches` :
                                    `${validCandidates.length} candidate${validCandidates.length !== 1 ? 's' : ''} queued • Job Description set`}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleBatchAnalyze}
                    disabled={loading || validCandidates.length === 0 || !jdText}
                    className={`
                        relative overflow-hidden group px-8 py-3 rounded-xl font-semibold tracking-wide transition-all duration-300
                        ${hasResults
                            ? 'bg-surface-highlight hover:bg-white/10 text-heading border border-white/10'
                            : 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                    `}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Proccessing...</span>
                            </>
                        ) : hasResults ? (
                            <>
                                <Play className="w-5 h-5" />
                                <span>Re-Run Analysis</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5 fill-current" />
                                <span>Run Analysis</span>
                            </>
                        )}
                    </span>
                    {!hasResults && !loading && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    )}
                </button>
            </div>

            {/* Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-semibold text-red-200">Analysis Failed</h3>
                            <p className="text-sm text-red-200/70 mt-1">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State / Call to Action */}
            {!hasResults && !loading && !error && (
                <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-white/10 bg-white/5">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-surface-highlight to-transparent rounded-2xl flex items-center justify-center mb-4 shadow-glass">
                        <Users className="w-8 h-8 text-body/40" />
                    </div>
                    <h3 className="text-xl font-medium text-heading mb-2">Awaiting Analysis</h3>
                    <p className="text-body/60 max-w-md mx-auto">
                        {validCandidates.length > 0 && jdText
                            ? "Everything looks ready! Click the 'Run Analysis' button above to score your candidates."
                            : "Upload candidates and enter a job description to begin the AI scoring process."}
                    </p>
                </div>
            )}

            {/* Results Section */}
            <AnimatePresence mode="wait">
                {hasResults && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {/* Stats Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="glass-panel p-5 bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
                                <div className="text-sm text-secondary font-medium mb-1">Top Match</div>
                                <div className="text-3xl font-bold text-heading">{Math.max(...results.map(r => r.score))}%</div>
                            </div>
                            <div className="glass-panel p-5">
                                <div className="text-sm text-body font-medium mb-1">Total Candidates</div>
                                <div className="text-3xl font-bold text-heading">{results.length}</div>
                            </div>
                            <div className="glass-panel p-5">
                                <div className="text-sm text-body font-medium mb-1">Average Score</div>
                                <div className="text-3xl font-bold text-heading">
                                    {(results.reduce((acc, curr) => acc + curr.score, 0) / results.length).toFixed(0)}%
                                </div>
                            </div>
                            <div className="glass-panel p-5 flex flex-col justify-center">
                                <div className="flex gap-2 text-xs font-medium text-body/60 mb-2 uppercase tracking-wider">Distribution</div>
                                <div className="flex h-2 rounded-full overflow-hidden bg-surface-highlight">
                                    <div
                                        className="bg-secondary"
                                        style={{ width: `${(results.filter(r => r.score >= 80).length / results.length) * 100}%` }}
                                    />
                                    <div
                                        className="bg-primary"
                                        style={{ width: `${(results.filter(r => r.score >= 60 && r.score < 80).length / results.length) * 100}%` }}
                                    />
                                    <div
                                        className="bg-amber-500"
                                        style={{ width: `${(results.filter(r => r.score < 60).length / results.length) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] text-body/50">
                                    <span>High</span>
                                    <span>Medium</span>
                                    <span>Low</span>
                                </div>
                            </div>
                        </div>

                        {/* Sort Controls */}
                        <div className="flex justify-between items-center py-2">
                            <h3 className="text-lg font-medium text-heading">Detailed Rankings</h3>
                            <div className="flex items-center gap-2 bg-surface-highlight/50 p-1 rounded-lg">
                                <button
                                    onClick={() => toggleSort('score')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${sortBy === 'score'
                                            ? 'bg-white/10 text-heading shadow-sm'
                                            : 'text-body hover:text-heading hover:bg-white/5'
                                        }`}
                                >
                                    Sort by Score
                                </button>
                                <button
                                    onClick={() => toggleSort('name')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${sortBy === 'name'
                                            ? 'bg-white/10 text-heading shadow-sm'
                                            : 'text-body hover:text-heading hover:bg-white/5'
                                        }`}
                                >
                                    Sort by Name
                                </button>
                            </div>
                        </div>

                        {/* Candidate Cards */}
                        <div className="space-y-4">
                            {sortedResults.map((candidate, index) => (
                                <CandidateCard
                                    key={candidate.name}
                                    candidate={candidate}
                                    rank={sortBy === 'score' && sortOrder === 'desc' ? index + 1 : null}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;
