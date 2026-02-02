import React, { useState } from 'react';
import JobDescriptionInput from './components/JobDescriptionInput';
import ResumeUpload from './components/ResumeUpload';
import Dashboard from './components/Dashboard';
import { Sparkles, LayoutDashboard, FileText, Settings, User } from 'lucide-react';

function App() {
    const [jdText, setJdText] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleCandidatesUpdate = (updatedCandidates) => {
        setCandidates(updatedCandidates);
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Mesh Background */}
            <div className="bg-mesh" />

            {/* Sidebar Navigation */}
            <aside className="w-64 hidden md:flex flex-col border-r border-white/5 bg-surface/30 backdrop-blur-xl h-screen sticky top-0 z-20">
                <div className="p-6 flex items-center gap-3 border-b border-white/5">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-glow-primary">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-heading tracking-tight">XAI Recruiter</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-body hover:text-heading hover:bg-white/5'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body hover:text-heading hover:bg-white/5 transition-all">
                        <FileText className="w-5 h-5" />
                        <span className="font-medium">Candidates</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body hover:text-heading hover:bg-white/5 transition-all">
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-heading truncate">Admin User</p>
                            <p className="text-xs text-body truncate">admin@xai.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10">
                <header className="h-16 border-b border-white/5 bg-surface/30 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
                    <h1 className="text-xl font-semibold text-heading">Candidate Scoring</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-primary px-2 py-1 bg-primary/10 rounded border border-primary/20">v2.0.0-beta</span>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7 animate-fade-in-up">
                            <JobDescriptionInput value={jdText} onChange={setJdText} />
                        </div>
                        <div className="lg:col-span-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <ResumeUpload onUploadComplete={handleCandidatesUpdate} />
                        </div>
                    </div>

                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <Dashboard
                            candidates={candidates}
                            jdText={jdText}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
