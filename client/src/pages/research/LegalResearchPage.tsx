import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import {
    Search,
    Plus,
    Mic,
    Paperclip,
    Send,
    ArrowRight,
    Globe,
    Gavel,
    FileText,
    BookOpen,
    Sparkles,
    Loader2,
    Bookmark,
    Settings,
    X,
    File,
    Check,
    Trash2,
    AlertTriangle,
    Download,
    History as HistoryIcon
} from 'lucide-react';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import jsPDF from 'jspdf';

export default function LegalResearchPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [progress, setProgress] = useState(0);
    const [history, setHistory] = useState<any[]>([]);

    // File & Audio State
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'research' | 'history'>('research');
    const [historyFilter, setHistoryFilter] = useState<'all' | 'month' | 'week'>('all');
    const [recentPage, setRecentPage] = useState(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isClearingAll, setIsClearingAll] = useState(false);
    const [researchToDelete, setResearchToDelete] = useState<string | null>(null);
    const [researchStages, setResearchStages] = useState([
        { id: 1, label: "Indexing Multi-State Statutes & Gazette Notifications", status: 'pending' },
        { id: 2, label: "Cross-referencing Supreme Court & High Court Precedents", status: 'pending' },
        { id: 3, label: "Synthesizing Jurisprudential Analysis & Citations", status: 'pending' }
    ]);
    const [filesScanned, setFilesScanned] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(12);
    const ITEMS_PER_PAGE = 4;

    const filteredHistory = useMemo(() => {
        if (historyFilter === 'all') return history;

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        return history.filter(item => {
            if (!item.createdAt) return true; // Fallback for items without timestamps
            const itemDate = new Date(item.createdAt);
            if (historyFilter === 'week') return itemDate >= oneWeekAgo;
            if (historyFilter === 'month') return itemDate >= oneMonthAgo;
            return true;
        });
    }, [history, historyFilter]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef<any>(null); // For Web Speech API
    const timerRef = useRef<any>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/research/history');
            setHistory(response.data);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSuggestionClick = (type: 'draft' | 'precedent' | 'statute') => {
        let suggestion = "";
        switch (type) {
            case 'draft':
                suggestion = "Draft a legally binding agreement for ";
                break;
            case 'precedent':
                suggestion = "Find relevant case precedents for ";
                break;
            case 'statute':
                suggestion = "Explain the legal provisions and statutes regarding ";
                break;
        }
        setQuery(suggestion);
        // We use a small timeout to ensure state update has propagated if needed, 
        // though usually focus() works immediately.
        setTimeout(() => textareaRef.current?.focus(), 10);
    };

    const handleSearch = async (forcedQuery?: string) => {
        const searchQuery = forcedQuery || query;
        if (!searchQuery.trim() && !attachedFile && !audioBlob) return;
        setIsSearching(true);
        if (forcedQuery) setQuery(forcedQuery);

        // Reset stages for new research
        setResearchStages([
            { id: 1, label: "Indexing Multi-State Statutes & Gazette Notifications", status: 'loading' },
            { id: 2, label: "Cross-referencing Supreme Court & High Court Precedents", status: 'pending' },
            { id: 3, label: "Synthesizing Jurisprudential Analysis & Citations", status: 'pending' }
        ]);
        setProgress(15);
        setFilesScanned(0);
        setTimeRemaining(12);

        // Start dynamic counters
        const counterInt = setInterval(() => {
            setFilesScanned(prev => Math.min(prev + Math.floor(Math.random() * 200) + 50, 4820));
        }, 150);
        
        const timeInt = setInterval(() => {
            setTimeRemaining(prev => Math.max(prev - 1, 1));
        }, 1000);

        try {
            // Simulated stage transitions
            setTimeout(() => {
                setResearchStages(prev => prev.map(s => s.id === 1 ? { ...s, status: 'completed' } : s.id === 2 ? { ...s, status: 'loading' } : s));
                setProgress(45);
            }, 2000);

            setTimeout(() => {
                setResearchStages(prev => prev.map(s => s.id === 2 ? { ...s, status: 'completed' } : s.id === 3 ? { ...s, status: 'loading' } : s));
                setProgress(75);
            }, 4500);

            setTimeout(() => {
                setResearchStages(prev => prev.map(s => s.id === 3 ? { ...s, status: 'completed' } : s));
                setProgress(100);
                clearInterval(counterInt);
                clearInterval(timeInt);
                setFilesScanned(4820);
                setTimeRemaining(0);
            }, 7000);

            const response = await api.post('/research', { query: searchQuery });

            // Wait slightly for the final stage to show completion if needed
            await new Promise(r => setTimeout(r, 7500));

            setMessages([
                { role: 'user', content: searchQuery || (attachedFile ? `Attached: ${attachedFile.name}` : "Voice Search Result") },
                { role: 'assistant', content: response.data.answer }
            ]);
            setShowResults(true);
            setAttachedFile(null);
            setAudioBlob(null);
            // Moved fetchHistory to handleSave to ensure results are only saved when explicitly requested
        } catch (err) {
            console.error("Research failed:", err);
        } finally {
            setIsSearching(false);
            setIsSaved(false); // Reset saved status for new research
        }
    };

    const handleSave = async () => {
        if (!messages.length || isSaved) return;

        try {
            const assistantMessage = messages.find(m => m.role === 'assistant');
            if (!assistantMessage) return;

            await api.post('/research/save', {
                query: query,
                answer: assistantMessage.content,
                title: query.length > 50 ? query.substring(0, 50) + '...' : query,
                category: "Legal Research"
            });

            setIsSaved(true);
            // Refresh history to show the save happened
            await fetchHistory();
        } catch (err) {
            console.error("Failed to save research:", err);
        }
    };

    const handleDeleteResearch = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent launching research when clicking delete
        setResearchToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!researchToDelete) return;

        try {
            await api.delete(`/research/${researchToDelete}`);
            // Refresh history after deletion
            await fetchHistory();
            setIsDeleteDialogOpen(false);
            setResearchToDelete(null);
        } catch (err) {
            console.error("Failed to delete research:", err);
            alert("Failed to delete research record.");
        }
    };

    const handleClearAllHistory = async () => {
        setIsClearingAll(true);
        try {
            await api.delete('/research/history/clear');
            setHistory([]);
            setIsSettingsOpen(false);
        } catch (err) {
            console.error("Failed to clear history:", err);
            alert("Failed to clear research history.");
        } finally {
            setIsClearingAll(false);
        }
    };

    const handleExportHistory = () => {
        if (history.length === 0) return;

        const headers = ["Title", "Date", "Category", "Query", "Answer"];
        const rows = history.map(item => [
            `"${(item.title || '').replace(/"/g, '""')}"`,
            `"${item.date || new Date(item.createdAt).toLocaleDateString()}"`,
            `"${item.category || 'General'}"`,
            `"${(item.description || '').replace(/"/g, '""')}"`,
            `"${(item.answer || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Vidhik_Research_History_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachedFile(file);
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            // Stop Speech Recognition
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    console.error("[Mic] Error stopping recognition:", e);
                }
            }

            // Stop Media Recorder
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                try {
                    mediaRecorderRef.current.stop();
                } catch (e) {
                    console.error("[Mic] Error stopping recorder:", e);
                }
            }

            // Stop all audio tracks to release the microphone hardware
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    track.stop();
                    console.log("[Mic] Track stopped:", track.label);
                });
                streamRef.current = null;
            }

            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
            console.log("[Mic] Recording session ended.");
        } else {
            console.log("[Mic] Requesting microphone access...");
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                // 1. Web Speech API (Transcription)
                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                if (SpeechRecognition) {
                    const recognition = new SpeechRecognition();
                    recognition.continuous = true;
                    recognition.interimResults = true;
                    recognition.lang = 'en-IN';

                    recognition.onresult = (event: any) => {
                        let finalTranscript = '';
                        for (let i = event.resultIndex; i < event.results.length; ++i) {
                            if (event.results[i].isFinal) {
                                finalTranscript += event.results[i][0].transcript;
                            }
                        }
                        if (finalTranscript) {
                            setQuery(prev => prev ? prev + " " + finalTranscript : finalTranscript);
                        }
                    };

                    recognition.onerror = (event: any) => {
                        console.error("[Mic] Speech recognition error:", event.error);
                        if (event.error === 'not-allowed') {
                            alert("Microphone access denied. Please check browser permissions.");
                        }
                    };

                    recognition.start();
                    recognitionRef.current = recognition;
                }

                // 2. MediaRecorder (Audio Blob)
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;

                const chunks: BlobPart[] = [];
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/webm' });
                    setAudioBlob(blob);
                };

                mediaRecorder.start();
                setIsRecording(true);
                setRecordingTime(0);
                timerRef.current = setInterval(() => {
                    setRecordingTime(prev => prev + 1);
                }, 1000);

                console.log("[Mic] Recording started successfully.");
            } catch (err) {
                console.error("[Mic] Failed to start recording:", err);
                alert("Microphone Error: Please ensure you have granted permission and are using a supported browser.");
                setIsRecording(false);
            }
        }
    };

    const formatAnalysisResult = (content: string) => {
        // Remove citations block from main display
        const displayContent = content.split('[CITATIONS]')[0];

        // Remove markdown headers and bolding
        const cleanContent = displayContent
            .replace(/###\s+/g, '') // Remove ###
            .replace(/\*\*/g, '')   // Remove **
            .trim();
        
        // Split by newlines and filter out empty lines to get clean paragraphs
        return cleanContent.split('\n').filter(p => p.trim() !== '');
    };

    const extractCitations = (content: string) => {
        const parts = content.split('[CITATIONS]');
        if (parts.length < 2) return [];
        
        const citationBlock = parts[1].trim();
        return citationBlock
            .split('\n')
            .map(line => line.replace(/^-\s+/, '').replace(/\*\*/g, '').trim())
            .filter(line => line.length > 0);
    };

    const generatePDFReport = async (originalQuery: string, analysisContent: string) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - (margin * 2);

        // Header
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235); // violet-600
        doc.text("Vidhik AI Legal Research Report", margin, 20);
        
        doc.setDrawColor(229, 231, 235); // gray-200
        doc.line(margin, 25, pageWidth - margin, 25);

        // Query Section
        doc.setFontSize(12);
        doc.setTextColor(156, 163, 175); // gray-400
        doc.text("RESEARCH QUERY", margin, 35);
        
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55); // gray-800
        const queryLines = doc.splitTextToSize(originalQuery, maxWidth);
        doc.text(queryLines, margin, 42);
        
        let cursorY = 42 + (queryLines.length * 7) + 10;

        // Analysis Section
        doc.setFontSize(12);
        doc.setTextColor(156, 163, 175);
        doc.text("LEGAL ANALYSIS", margin, cursorY);
        cursorY += 7;

        doc.setFontSize(11);
        doc.setTextColor(55, 65, 81); // gray-700
        const analysisParagraphs = formatAnalysisResult(analysisContent);
        
        analysisParagraphs.forEach(para => {
            const paraLines = doc.splitTextToSize(para, maxWidth);
            if (cursorY + (paraLines.length * 5) > 280) {
                doc.addPage();
                cursorY = 20;
            }
            doc.text(paraLines, margin, cursorY);
            cursorY += (paraLines.length * 5) + 5;
        });

        // Citations Section
        const citations = extractCitations(analysisContent);
        if (citations.length > 0) {
            cursorY += 5;
            doc.setFontSize(12);
            doc.setTextColor(156, 163, 175);
            doc.text("KEY LEGAL CITATIONS", margin, cursorY);
            cursorY += 7;

            doc.setFontSize(11);
            doc.setTextColor(37, 99, 235);
            citations.forEach(citation => {
                if (cursorY > 280) {
                    doc.addPage();
                    cursorY = 20;
                }
                doc.text(`• ${citation}`, margin + 5, cursorY);
                cursorY += 7;
            });
        }

        // Footer
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175);
            doc.text(`Generated by Vidhik AI • Page ${i} of ${totalPages}`, margin, 285);
            doc.text(new Date().toLocaleString(), pageWidth - margin - 40, 285);
        }

        doc.save(`Vidhik_Research_Report_${new Date().getTime()}.pdf`);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const recentTopics = [
        { title: "Property Transfer Act", date: "Last researched 2h ago", description: "Understanding Section 5 and validation of gift deeds under the Transfer of Property Act.." },
        { title: "Employment Contracts", date: "Last researched Yesterday", description: "Standard non-compete clauses for IT service companies and their legal enforceability.." },
        { title: "Tax Compliance GST", date: "Last researched 2 days ago", description: "Updated filing regulations for e-commerce operators and input tax credit rules.." },
        { title: "IPR Infringement", date: "Last researched Oct 12", description: "Trademark registration process and recent Delhi High Court rulings on software piracy.." },
    ];


    const legalUpdates = [
        { category: "SUPREME COURT", time: "15 mins ago", title: "New guidelines issued for digital evidence submission in commercial suits.", description: "The Court has formalized the protocol for encrypted file sharing and metadata preservation." },
        { category: "TAXATION", time: "2 hours ago", title: "Amendments proposed to the Income Tax Act for Startups (FY 2024-25).", description: "Proposed changes aim to simplify the Angel Tax assessment process and provide 3-year holiday." },
        { category: "DATA PRIVACY", time: "5 hours ago", title: "DPDP Act compliance deadline extended for small enterprises.", description: "MEITY announces a 6-month extension for startups with turnover below ₹50 Cr." },
        { category: "CORPORATE LAW", time: "Yesterday", title: "MCA updates CSR reporting format for FY 2023-24.", description: "Companies must now provide detailed breakdown of environmental project spends." },
    ];

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-120px)] flex flex-col gap-10 pb-10">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Main Content Area */}
                <div className="flex-1 space-y-8">

                    {/* Header / Breadcrumb Area with Tabs */}
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                <span className="hover:text-violet-600 transition-colors cursor-pointer" onClick={() => { setShowResults(false); setIsSearching(false); setActiveTab('research'); }}>Vidhik Research</span>
                                <ArrowRight className="h-4 w-4 text-gray-300" />
                                <span className="text-gray-900 font-bold">{isSearching ? "Processing Query..." : showResults ? "Analysis Result" : activeTab === 'history' ? "History" : "New Search"}</span>
                                {isSearching && (
                                    <Badge className="ml-2 bg-violet-50 text-violet-600 border-none font-black text-[9px] px-2 py-0.5 tracking-widest uppercase animate-pulse">
                                        ● PROCESSING
                                    </Badge>
                                )}
                            </div>

                            <div className="flex bg-gray-100 p-1 rounded-2xl">
                                <Button
                                    variant={activeTab === 'research' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={`rounded-xl px-6 font-bold ${activeTab === 'research' ? 'bg-white shadow-sm hover:bg-white' : 'text-gray-500'}`}
                                    onClick={() => setActiveTab('research')}
                                >
                                    Research
                                </Button>
                                <Button
                                    variant={activeTab === 'history' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={`rounded-xl px-6 font-bold ${activeTab === 'history' ? 'bg-white shadow-sm hover:bg-white' : 'text-gray-500'} ${(!showResults || isSearching) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => !(!showResults || isSearching) && setActiveTab('history')}
                                    disabled={!showResults || isSearching}
                                >
                                    History
                                </Button>
                            </div>
                        </div>
                    </div>

                    {isSearching ? (
                        <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in-95 duration-1000 pt-10 relative">
                            {/* Decorative Background Glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-400/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                            <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-400/5 rounded-full blur-[100px] -z-10"></div>

                            {/* User Query Echo - Premium Version */}
                            <div className="w-full max-w-2xl px-4">
                                <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-8 shadow-2xl shadow-violet-500/5 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-violet-600"></div>
                                    <p className="text-[10px] font-black text-violet-600 uppercase tracking-[0.2em] mb-3 opacity-60">Analyzing Legal Query</p>
                                    <p className="text-xl font-bold text-gray-900 leading-relaxed italic">"{query}"</p>
                                </div>
                            </div>

                            {/* Main Analysis Hub */}
                            <div className="w-full max-w-3xl px-4">
                                <Card className="rounded-[3.5rem] border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden relative">
                                    {/* Scanning Beam Animation */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent -translate-y-full animate-[scan_3s_ease-in-out_infinite]"></div>
                                    <style>{`
                                        @keyframes scan {
                                            0% { transform: translateY(0); opacity: 0; }
                                            50% { opacity: 1; }
                                            100% { transform: translateY(600px); opacity: 0; }
                                        }
                                    `}</style>

                                    <CardContent className="p-12 space-y-10">
                                        {/* Dynamic Stats Row */}
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Files Indexed</p>
                                                <p className="text-2xl font-black text-gray-900 tabular-nums">{filesScanned.toLocaleString()}+</p>
                                            </div>
                                            <div className="space-y-1 text-center">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Confidence</p>
                                                <p className="text-2xl font-black text-violet-600">{(94 + Math.random() * 5).toFixed(1)}%</p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Est. Ready In</p>
                                                <p className="text-2xl font-black text-gray-900 tabular-nums">{timeRemaining}s</p>
                                            </div>
                                        </div>

                                        {/* Premium Glowing Progress */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-violet-600 animate-ping"></div>
                                                    <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Research Advancement</p>
                                                </div>
                                                <p className="text-lg font-black text-violet-600">{progress}%</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -inset-1 bg-violet-400/20 blur-md rounded-full"></div>
                                                <Progress value={progress} className="h-3 bg-violet-50 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-transparent animate-shimmer" style={{ transform: 'skewX(-20deg)' }}></div>
                                                </Progress>
                                            </div>
                                        </div>

                                        {/* Expert Stages List */}
                                        <div className="space-y-6 pt-4">
                                            {researchStages.map((stage) => (
                                                <div key={stage.id} className={`flex items-center gap-6 transition-all duration-500 ${stage.status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
                                                    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
                                                        {stage.status === 'completed' ? (
                                                            <div className="h-10 w-10 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-100 animate-in zoom-in spin-in-12 duration-500">
                                                                <Check className="h-5 w-5 stroke-[4]" />
                                                            </div>
                                                        ) : stage.status === 'loading' ? (
                                                            <div className="h-10 w-10 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
                                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                            </div>
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-200">
                                                                <div className="h-2 w-2 rounded-full bg-gray-100"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className={`text-lg font-bold block transition-all duration-300 ${stage.status === 'loading' ? 'text-violet-600 scale-105 origin-left' : stage.status === 'completed' ? 'text-gray-900' : 'text-gray-300'}`}>
                                                            {stage.label}
                                                        </span>
                                                        {stage.status === 'loading' && (
                                                            <p className="text-[10px] text-violet-400 font-bold uppercase tracking-wider animate-pulse italic">In Depth Analysis Underway...</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Bottom Status Bar */}
                                        <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                                                    <Globe className="h-4 w-4 text-gray-400 animate-spin-slow" />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vidhik AI clusters active</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="h-1 w-1 rounded-full bg-green-500"></div>
                                                <span className="text-[9px] font-bold text-green-600 uppercase">Secure Link</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : !showResults ? (
                        <div className="flex flex-col items-center justify-center pt-20 space-y-10 animate-in fade-in duration-700">
                            <div className="text-center space-y-4">
                                <h1 className="text-5xl font-black text-gray-900 tracking-tight">Start New Research</h1>
                                <p className="text-gray-500 text-xl font-medium">Ask a question or provide a document to begin your legal analysis.</p>
                            </div>

                            {/* Search Container */}
                            <div className="w-full max-w-5xl relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-white border-2 border-gray-100 rounded-[2.5rem] p-4 shadow-2xl flex flex-col transition-all duration-300">
                                    {/* Attachment Preview */}
                                    {(attachedFile || audioBlob || isRecording) && (
                                        <div className="px-6 pt-4 flex flex-wrap gap-2">
                                            {attachedFile && (
                                                <Badge className="bg-violet-50 text-violet-700 border-violet-100 flex items-center gap-2 px-3 py-1.5 rounded-xl animate-in zoom-in-75 duration-300">
                                                    <File className="h-3 w-3" />
                                                    {attachedFile.name}
                                                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setAttachedFile(null)} />
                                                </Badge>
                                            )}
                                            {isRecording && (
                                                <Badge className="bg-red-50 text-red-600 border-red-100 flex items-center gap-2 px-3 py-1.5 rounded-xl animate-pulse">
                                                    <div className="h-2 w-2 rounded-full bg-red-600"></div>
                                                    Recording {formatTime(recordingTime)}
                                                </Badge>
                                            )}
                                            {audioBlob && !isRecording && (
                                                <Badge className="bg-green-50 text-green-700 border-green-100 flex items-center gap-2 px-3 py-1.5 rounded-xl animate-in zoom-in-75 duration-300">
                                                    <Mic className="h-3 w-3" />
                                                    Audio Recorded
                                                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setAudioBlob(null)} />
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <textarea
                                            ref={textareaRef}
                                            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-lg py-4 px-4 min-h-[80px] resize-none overflow-hidden placeholder:text-gray-400 font-medium"
                                            placeholder="Explain the Property Transfer Act or draft an employment contract..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSearch();
                                                }
                                            }}
                                        />
                                        <div className="flex items-center gap-3 pr-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`rounded-full ${attachedFile ? 'text-violet-600 bg-violet-50' : 'text-gray-400'} hover:text-violet-600 hover:bg-violet-50 transition-colors`}
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Paperclip className="h-6 w-6" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`rounded-full ${isRecording ? 'text-red-600 bg-red-50 animate-pulse' : 'text-gray-400'} hover:text-violet-600 hover:bg-violet-50 transition-colors`}
                                                onClick={toggleRecording}
                                            >
                                                <Mic className="h-6 w-6" />
                                            </Button>
                                            <Button
                                                className="bg-violet-600 hover:bg-violet-700 rounded-2xl h-14 w-14 flex items-center justify-center p-0 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-200"
                                                onClick={() => handleSearch()}
                                                disabled={isSearching}
                                            >
                                                {isSearching ? <Loader2 className="h-7 w-7 animate-spin" /> : <Search className="h-7 w-7" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Suggestion Chips */}
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    className="rounded-2xl h-12 px-6 gap-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold"
                                    onClick={() => handleSuggestionClick('draft')}
                                >
                                    <FileText className="h-4 w-4 text-violet-600" />
                                    Draft Agreement
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-2xl h-12 px-6 gap-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold"
                                    onClick={() => handleSuggestionClick('precedent')}
                                >
                                    <Gavel className="h-4 w-4 text-purple-600" />
                                    Case Precedents
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-2xl h-12 px-6 gap-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold"
                                    onClick={() => handleSuggestionClick('statute')}
                                >
                                    <BookOpen className="h-4 w-4 text-orange-600" />
                                    Statute Explanation
                                </Button>
                            </div>

                            {/* Recent Topics */}
                            <div className="w-full space-y-6 pt-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recent Research Topics</h3>
                                    <Button variant="link" className="text-violet-600 text-xs font-bold uppercase tracking-widest" onClick={() => setActiveTab('history')}>View All History</Button>
                                </div>

                                {history.length > 0 || recentTopics.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {(history.length > 0 ? history : recentTopics)
                                                .slice(recentPage * ITEMS_PER_PAGE, (recentPage + 1) * ITEMS_PER_PAGE)
                                                .map((topic, i) => (
                                                    <Card key={i} className="rounded-[2rem] border-none shadow-sm bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => {
                                                        handleSearch(topic.description || topic.query);
                                                    }}>
                                                        <CardContent className="p-8 relative">
                                                            <div className="space-y-2 flex-1">
                                                                <div className="flex flex-col">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className="font-bold text-gray-900 text-lg line-clamp-1">{topic.title}</h4>
                                                                        {topic.id && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                                                                onClick={(e) => handleDeleteResearch(e, topic.id)}
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{topic.date || (topic.createdAt && new Date(topic.createdAt).toLocaleDateString())}</p>
                                                                </div>
                                                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{topic.description || topic.query}</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                        </div>

                                        {/* Pagination Controls */}
                                        {(history.length > ITEMS_PER_PAGE || (!history.length && recentTopics.length > ITEMS_PER_PAGE)) && (
                                            <div className="flex items-center justify-center gap-4 pt-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-xl font-bold text-gray-400 hover:text-violet-600 disabled:opacity-30"
                                                    onClick={() => setRecentPage(prev => Math.max(0, prev - 1))}
                                                    disabled={recentPage === 0}
                                                >
                                                    Previous
                                                </Button>
                                                <div className="flex gap-2">
                                                    {Array.from({ length: Math.ceil((history.length || recentTopics.length) / ITEMS_PER_PAGE) }).map((_, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`h-1.5 rounded-full transition-all duration-300 ${recentPage === idx ? 'w-6 bg-violet-600' : 'w-1.5 bg-gray-200'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-xl font-bold text-gray-400 hover:text-violet-600 disabled:opacity-30"
                                                    onClick={() => setRecentPage(prev => Math.min(Math.ceil((history.length || recentTopics.length) / ITEMS_PER_PAGE) - 1, prev + 1))}
                                                    disabled={recentPage >= Math.ceil((history.length || recentTopics.length) / ITEMS_PER_PAGE) - 1}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-10 text-gray-400 font-medium">No recent topics found</div>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'history' ? (
                        <div className="space-y-8 animate-in fade-in duration-700">
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 space-y-10">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black text-gray-900">Research History</h2>
                                        <p className="text-gray-500 font-medium">Access your past analyses and saved legal research.</p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                                        <Button
                                            variant={historyFilter === 'all' ? "secondary" : "ghost"}
                                            size="sm"
                                            className={`rounded-xl font-bold ${historyFilter === 'all' ? 'bg-white shadow-sm hover:bg-white text-gray-700' : ''}`}
                                            onClick={() => setHistoryFilter('all')}
                                        >
                                            All Time
                                        </Button>
                                        <Button
                                            variant={historyFilter === 'month' ? "secondary" : "ghost"}
                                            size="sm"
                                            className={`rounded-xl font-bold ${historyFilter === 'month' ? 'bg-white shadow-sm hover:bg-white text-gray-700' : ''}`}
                                            onClick={() => setHistoryFilter('month')}
                                        >
                                            This Month
                                        </Button>
                                        <Button
                                            variant={historyFilter === 'week' ? "secondary" : "ghost"}
                                            size="sm"
                                            className={`rounded-xl font-bold ${historyFilter === 'week' ? 'bg-white shadow-sm hover:bg-white text-gray-700' : ''}`}
                                            onClick={() => setHistoryFilter('week')}
                                        >
                                            This Week
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                                    {filteredHistory.map((record: any, i: number) => (
                                        <Card
                                            key={i}
                                            className="rounded-[2.5rem] border border-gray-100 hover:border-violet-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden"
                                            onClick={() => {
                                                handleSearch(record.description);
                                                setActiveTab('research');
                                            }}
                                        >
                                            <div className="p-8 flex flex-col h-full relative">
                                                <div className="flex items-center justify-between mb-6">
                                                    <Badge className="bg-violet-50 text-violet-600 border-none font-black text-[9px] px-2 py-0.5 tracking-widest uppercase">
                                                        {record.category || "General Research"}
                                                    </Badge>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{record.date || record.time}</span>
                                                        {record.id && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                                                onClick={(e) => handleDeleteResearch(e, record.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-600 transition-colors">
                                                    {record.title || (record.description.length > 50 ? record.description.substring(0, 50) + '...' : record.description)}
                                                </h3>
                                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-8">{record.description}</p>
                                                <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-6">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        <Sparkles className="h-3 w-3" />
                                                        AI Verified
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="rounded-xl font-bold p-0 group-hover:text-violet-600">
                                                        Relaunch
                                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
                            {/* Chat View */}
                            <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-xl border border-white/40 sticky top-4 z-10 mx-1">
                                <div className="flex items-center gap-6">
                                    <Button 
                                        variant="ghost" 
                                        className="h-12 w-12 rounded-2xl hover:bg-gray-50 bg-white shadow-sm border border-gray-100 flex items-center justify-center transition-all hover:scale-105 active:scale-95" 
                                        onClick={() => setShowResults(false)}
                                    >
                                        <Plus className="h-6 w-6 text-violet-600" />
                                    </Button>
                                    <div className="h-10 w-[1px] bg-gray-100"></div>
                                    <div className="space-y-0.5">
                                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Analysis Result</h2>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified by Vidhik AI</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl font-bold bg-white border-gray-100 hover:bg-gray-50 text-gray-600 h-10 px-4 gap-2"
                                        onClick={() => setActiveTab('history')}
                                    >
                                        <Globe className="h-4 w-4 text-violet-500" />
                                        Access History
                                    </Button>
                                    <Button
                                        variant={isSaved ? "secondary" : "outline"}
                                        size="sm"
                                        className={`rounded-xl font-bold transition-all duration-300 h-10 px-4 gap-2 ${isSaved ? 'bg-green-50 text-green-700 border-green-200 shadow-none' : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-600'}`}
                                        onClick={handleSave}
                                        disabled={isSaved}
                                    >
                                        {isSaved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4 text-gray-400" />}
                                        {isSaved ? "Analysis Saved" : "Save Result"}
                                    </Button>
                                    {/* Settings removed per user request */}
                                </div>
                            </div>

                            <div className="space-y-10">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex gap-6 ${m.role === 'assistant' ? 'bg-violet-50/30 -mx-8 p-12 rounded-[3rem]' : 'px-4'}`}>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user' ? 'bg-gray-900 text-white' : 'bg-violet-600 text-white animate-pulse'}`}>
                                            {m.role === 'user' ? 'US' : <Gavel className="h-6 w-6" />}
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{m.role === 'user' ? 'Your Query' : 'Vidhik Legal Analysis'}</p>
                                            <div className="prose prose-blue max-w-none">
                                                <div className="space-y-6">
                                                    {formatAnalysisResult(m.content).map((para, idx) => (
                                                        <p key={idx} className="text-xl font-medium leading-relaxed text-gray-800">
                                                            {para}
                                                        </p>
                                                    ))}
                                                </div>
                                                {m.role === 'assistant' && (
                                                    <div className="mt-8 space-y-6">
                                                        <div className="p-6 bg-white rounded-3xl border border-violet-100 space-y-4">
                                                            <div className="flex items-center gap-2 text-violet-600">
                                                                <Sparkles className="h-5 w-5" />
                                                                <h4 className="font-bold">Key Legal Citations</h4>
                                                            </div>
                                                            <ul className="space-y-3">
                                                                {extractCitations(m.content).length > 0 ? (
                                                                    extractCitations(m.content).map((citation, idx) => (
                                                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0"></div>
                                                                            <span>{citation}</span>
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <>
                                                                        <li className="flex items-start gap-3 text-sm text-gray-600">
                                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0"></div>
                                                                            <span>Section 5 of Transfer of Property Act, 1882</span>
                                                                        </li>
                                                                        <li className="flex items-start gap-3 text-sm text-gray-600">
                                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0"></div>
                                                                            <span>Rule 4 of the Gift Deed Validation Framework</span>
                                                                        </li>
                                                                    </>
                                                                )}
                                                            </ul>
                                                        </div>
                                                        <Button 
                                                            className="rounded-2xl h-14 bg-violet-600 hover:bg-violet-700 px-8 font-black gap-2"
                                                            onClick={() => generatePDFReport(query, m.content)}
                                                        >
                                                            Generate Full Report
                                                            <ArrowRight className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Follow up Input */}
                            <div className="sticky bottom-8 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-3 shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-700">
                                {/* Attachment Preview for Follow-up */}
                                {(attachedFile || audioBlob || isRecording) && (
                                    <div className="px-6 pt-2 pb-2 flex flex-wrap gap-2">
                                        {attachedFile && (
                                            <Badge className="bg-violet-50 text-violet-700 border-violet-100 flex items-center gap-2 px-3 py-1 rounded-xl">
                                                <File className="h-3 w-3" />
                                                {attachedFile.name}
                                                <X className="h-3 w-3 cursor-pointer" onClick={() => setAttachedFile(null)} />
                                            </Badge>
                                        )}
                                        {isRecording && (
                                            <Badge className="bg-red-50 text-red-600 border-red-100 flex items-center gap-2 px-3 py-1 rounded-xl animate-pulse">
                                                <div className="h-2 w-2 rounded-full bg-red-600"></div>
                                                Recording {formatTime(recordingTime)}
                                            </Badge>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <Input
                                        className="flex-1 bg-transparent border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-lg py-6 px-6 font-medium"
                                        placeholder="Ask a follow up question..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                    <div className="flex items-center gap-2 pr-2">
                                        <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-violet-600" onClick={() => fileInputRef.current?.click()}>
                                            <Paperclip className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className={`rounded-full ${isRecording ? 'text-red-600 animate-pulse' : 'text-gray-400'}`} onClick={toggleRecording}>
                                            <Mic className="h-5 w-5" />
                                        </Button>
                                        <Button className="bg-violet-600 hover:bg-violet-700 rounded-2xl h-14 w-14 shadow-lg shadow-violet-100" onClick={() => handleSearch()}>
                                            <Send className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Horizontal Legal Updates - Moved from Sidebar */}
                    {!isSearching && !showResults && activeTab === 'research' && (
                        <div className="w-full space-y-8 pt-10 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">Global Legal Updates</h3>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border bg-red-50 border-red-100">
                                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Live Feed</span>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="rounded-xl font-bold border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
                                    onClick={() => setIsSettingsOpen(true)}
                                >
                                    <Globe className="h-4 w-4 mr-2" />
                                    Configure Feed
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {legalUpdates.map((item, i) => (
                                    <Card key={i} className="rounded-[2.5rem] border-none shadow-sm bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => handleSearch(item.description)}>
                                        <CardContent className="p-8 flex flex-col h-full">
                                            <div className="flex items-center justify-between mb-4">
                                                <Badge className={`${item.category === 'SUPREME COURT' ? 'bg-violet-50 text-violet-600' :
                                                    item.category === 'TAXATION' ? 'bg-orange-50 text-orange-600' :
                                                        item.category === 'DATA PRIVACY' ? 'bg-green-50 text-green-600' :
                                                            'bg-purple-50 text-purple-600'
                                                    } border-none font-black text-[9px] px-2 py-0.5 tracking-widest uppercase`}>
                                                    {item.category}
                                                </Badge>
                                                <span className="text-[10px] text-gray-400 font-bold">{item.time}</span>
                                            </div>
                                            <h5 className="font-bold text-gray-900 leading-snug group-hover:text-violet-600 transition-colors line-clamp-2 mb-3">
                                                {item.title}
                                            </h5>
                                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6">{item.description}</p>
                                            <div className="mt-auto">
                                                <div className="text-[10px] font-black uppercase text-violet-600 tracking-widest flex items-center gap-1">
                                                    Explore Implications
                                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pro Plan Banner - Horizontal Version */}
                    {!isSearching && (
                        <div className="mt-10">
                            <Card className="rounded-[3rem] border-none shadow-2xl bg-gradient-to-r from-indigo-600 via-violet-700 to-purple-800 p-10 text-white relative overflow-hidden group">
                                <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                                <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
                                    <div className="space-y-4 text-center lg:text-left">
                                        <Badge className="bg-white/20 text-white border-none font-bold text-[10px] px-3 tracking-widest uppercase py-1">Premium Access</Badge>
                                        <h4 className="text-3xl md:text-4xl font-black leading-tight">Upgrade to Pro for Advanced <br className="hidden md:block"/>Case Law Analysis</h4>
                                        <p className="text-indigo-100 font-medium text-lg max-w-2xl">Get unlimited access to our full suite of premium legal tools, deep case analysis, and priority research clusters.</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                                        <Button className="w-full sm:w-auto shrink-0 bg-white text-violet-700 hover:bg-violet-50 rounded-2xl h-16 px-12 font-black text-xl shadow-xl shadow-indigo-900/20 transition-all hover:scale-105 active:scale-95" onClick={() => navigate('/billing')}>
                                            Upgrade Now
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-red-50 p-8 flex flex-col items-center justify-center space-y-4">
                        <div className="bg-white p-4 rounded-3xl shadow-sm">
                            <AlertTriangle className="h-10 w-10 text-red-500" />
                        </div>
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-2xl font-black text-gray-900 leading-tight">Delete Research?</DialogTitle>
                            <DialogDescription className="text-gray-500 font-medium">
                                This action cannot be undone. This research analysis will be permanently removed from your history.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <DialogFooter className="p-8 bg-white flex sm:flex-row gap-4 sm:justify-center">
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-200 transition-all hover:-translate-y-1"
                            onClick={confirmDelete}
                        >
                            Delete Now
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* History Settings Dialog */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-10 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-violet-50 flex items-center justify-center">
                                <Settings className="h-6 w-6 text-violet-600" />
                            </div>
                            <div className="space-y-0.5">
                                <DialogTitle className="text-2xl font-black text-gray-900 leading-tight">History Settings</DialogTitle>
                                <DialogDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage your research data</DialogDescription>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 rounded-3xl border border-gray-100 bg-gray-50/30 space-y-4 group hover:border-violet-100 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                            <Download className="h-4 w-4 text-gray-400 group-hover:text-violet-600 transition-colors" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-gray-900">Export All Research</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Download history as a CSV file</p>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-xl font-bold bg-white text-violet-600 hover:bg-violet-50 border-violet-50"
                                        onClick={handleExportHistory}
                                        disabled={history.length === 0}
                                    >
                                        Export
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl border border-gray-100 bg-gray-50/30 space-y-4 group hover:border-red-100 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                            <HistoryIcon className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-gray-900">Clear All History</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Permanently delete all research</p>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-xl font-bold bg-white text-red-600 hover:bg-red-50 border-red-50"
                                        onClick={handleClearAllHistory}
                                        disabled={history.length === 0 || isClearingAll}
                                    >
                                        {isClearingAll ? "Clearing..." : "Clear All"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button 
                                className="w-full rounded-2xl h-14 font-black bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-200"
                                onClick={() => setIsSettingsOpen(false)}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
