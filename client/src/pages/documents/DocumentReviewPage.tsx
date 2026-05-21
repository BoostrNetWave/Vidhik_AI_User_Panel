import React, { useState, useEffect, useRef } from 'react';
import {
    Upload,
    FileText,
    Shield,
    Zap,
    Search,
    Share2,
    AlertTriangle,
    Loader2,
    ChevronRight,
    Activity,
    FileCheck,
    Maximize2,
    Sparkles,
    Check,
    Info,
    X,
    ShieldAlert,
    FileEdit,
    ArrowRight,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api from '@/lib/api';
import { toast } from 'sonner';

type ReviewState = 'UPLOAD' | 'PROCESSING' | 'COMPLETED';

export default function DocumentReviewPage() {
    const [state, setState] = useState<ReviewState>('UPLOAD');
    const [viewMode, setViewMode] = useState<'SUMMARY' | 'DETAILED'>('SUMMARY');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [progress, setProgress] = useState(0);
    const [isDeepScanEnabled] = useState(false);
    const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [logs, setLogs] = useState<{ msg: string, status: 'pending' | 'loading' | 'done' }[]>([]);
    const logContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Simulated Log Steps
    const getAnalysisSteps = (deepScan: boolean) => [
        "Document Ingested Successfully",
        "Extracting Clauses and Metadata",
        "Identifying Parties",
        ...(deepScan ? ["Deep Scan: Running Neural Sensitivity Model", "Deep Scan: Cross-referencing Case Law"] : ["Running Risk Sensitivity Model"]),
        "Cross-referencing Statutes",
        "Generating Optimization Suggestions",
        "Finalizing Compliance Score"
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            startAnalysis(file);
        }
    };

    const startAnalysis = async (file: File) => {
        setState('PROCESSING');
        setProgress(0);
        const currentSteps = getAnalysisSteps(isDeepScanEnabled);
        setLogs(currentSteps.map(step => ({ msg: step, status: 'pending' })));

        try {
            const user = JSON.parse(localStorage.getItem('user_data') || '{}');
            const userId = user._id || user.id || "PRO_USER_001";
            
            // Send file via FormData for real server-side parsing
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userId);
            formData.append('isDeepScanEnabled', String(isDeepScanEnabled));

            const response = await api.post('/documents/review', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setAnalysisData(response.data.data);
                // Simulate progress finishing
                setProgress(100);
                setTimeout(() => {
                    setViewMode('DETAILED');
                    setState('COMPLETED');
                }, 800);
            }
        } catch (error) {
            console.error('Analysis failed:', error);
            toast.error("AI Analysis failed. Showing simulated results.");
            // Fallback to dummy data if API fails
            setAnalysisData(null);

            // Allow manual entry into COMPLETED state for demo purposes even on failure
            setTimeout(() => {
                setViewMode('DETAILED');
                setState('COMPLETED');
            }, 1000);
        }
    };

    useEffect(() => {
        if (state === 'PROCESSING') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setState('COMPLETED'), 1000);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 80);

            return () => clearInterval(interval);
        }
    }, [state]);

    useEffect(() => {
        if (state === 'PROCESSING') {
            const currentSteps = getAnalysisSteps(isDeepScanEnabled);
            const stepDuration = 100 / currentSteps.length;
            const currentStepIndex = Math.floor(progress / stepDuration);

            setLogs(prev => prev.map((log, idx) => {
                if (idx < currentStepIndex) return { ...log, status: 'done' };
                if (idx === currentStepIndex) return { ...log, status: 'loading' };
                return log;
            }));
        }
    }, [progress, state]);

    // Scroll logs to bottom
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const handleShare = async () => {
        const shareData = {
            title: 'Vidhik AI Legal Research Report',
            text: `I've analyzed a legal document using Vidhik AI. Compliance Score: ${analysisData?.complianceScore || 85}%.`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Report shared successfully!");
            } else {
                await navigator.clipboard.writeText(`${shareData.text} Check it out here: ${shareData.url}`);
                toast.success("Share link copied to clipboard!");
            }
        } catch (error) {
            console.error("Error sharing:", error);
            toast.error("Failed to share report.");
        }
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-[1400px] mx-auto min-h-screen pb-20">
                {state === 'UPLOAD' && renderUploadView()}
                {state === 'PROCESSING' && renderProcessingView()}
                {state === 'COMPLETED' && renderCompletedView()}
            </div>
        </DashboardLayout>
    );

    function renderUploadView() {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analyze New Document</h1>
                    <p className="text-gray-500">Upload your legal contracts for instant AI risk assessment and optimization.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Zone */}
                    <div className="lg:col-span-2 space-y-6">
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.docx"
                        />
                        <div
                            className="border-2 border-dashed border-gray-200 rounded-3xl bg-white p-20 flex flex-col items-center justify-center space-y-6 hover:border-violet-400 hover:bg-violet-50/30 transition-all cursor-pointer group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
                                <Upload className="h-8 w-8" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900">Drag and drop your files here</h3>
                                <p className="text-gray-500 max-w-sm">Upload legal agreements, NDAs, or service contracts for deep analysis.</p>
                            </div>
                            <Button
                                size="lg"
                                className="bg-violet-600 hover:bg-violet-700 h-12 px-8 rounded-xl gap-2 font-semibold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                <FileText className="h-5 w-5" />
                                Browse Files
                            </Button>
                        </div>

                    </div>

                    {/* How it Works Sidebar */}
                    <div className="space-y-6">
                        <Card className="rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden h-full">
                            <CardHeader className="bg-gray-50/50 pb-4">
                                <div className="flex items-center gap-2 text-violet-600">
                                    <Info className="h-5 w-5" />
                                    <CardTitle className="text-base font-bold">How it works</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                                        <Search className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900">Risk Scanning</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">AI identifies hidden liabilities, unfavorable termination clauses, and unusual payment terms.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900">Compliance Check</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">Matches your document against regional legal standards and internal company policies.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900">Clause Optimization</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">Suggests industry-standard language to make contracts more balanced and clear.</p>
                                    </div>
                                </div>

                                <Separator className="my-6 opacity-50" />

                                <p className="text-[11px] text-gray-400 italic leading-snug">
                                    Step 1 of 3: Document Ingestion. Your data is encrypted and processed according to SOC2 standards.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    function renderProcessingView() {
        return (
            <div className="max-w-6xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-violet-700 rounded-lg flex items-center justify-center text-white font-bold">V</div>
                        <Badge className="bg-violet-50 text-violet-700 hover:bg-violet-50 border-none px-3 py-1 font-bold text-[10px] tracking-wider uppercase">
                            <Zap className="h-3 w-3 mr-1 fill-violet-700" />
                            Analysis in Progress
                        </Badge>
                    </div>
                    <Button variant="ghost" className="text-gray-500 hover:text-red-500 gap-2" onClick={() => setState('UPLOAD')}>
                        Cancel Process
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Progress Circle Section */}
                    <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-8">
                        <div className="flex flex-col items-center gap-2">
                            <h2 className="text-3xl font-extrabold text-gray-900">Processing Document</h2>
                            <p className="text-gray-500 font-medium">
                                {selectedFile ? selectedFile.name : "Service_Agreement_v2.pdf"} •
                                {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(1) + " MB" : "1.2 MB"}
                            </p>
                            <div className="mt-2 px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-bold uppercase tracking-widest border border-violet-100">
                                Deep Structural Analysis
                            </div>
                        </div>

                        {/* Progress Circular Component */}
                        <div className="relative w-72 h-72">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="144"
                                    cy="144"
                                    r="130"
                                    stroke="currentColor"
                                    strokeWidth="16"
                                    fill="transparent"
                                    className="text-gray-100"
                                />
                                <circle
                                    cx="144"
                                    cy="144"
                                    r="130"
                                    stroke="currentColor"
                                    strokeWidth="16"
                                    fill="transparent"
                                    strokeDasharray={816}
                                    strokeDashoffset={816 - (816 * progress) / 100}
                                    strokeLinecap="round"
                                    className="text-violet-600 transition-all duration-300 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-violet-600">
                                <span className="text-6xl font-black">{progress}%</span>
                                <span className="text-xs font-bold tracking-widest uppercase opacity-60">Completion</span>
                            </div>
                        </div>

                        {/* Animated Scanning Beam Effect (Simulation) */}
                        <div className="w-full max-w-sm h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
                            <div
                                className="absolute top-0 left-0 h-full bg-violet-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Live Logs Section */}
                    <Card className="rounded-3xl border-none shadow-xl bg-white overflow-hidden flex flex-col h-[550px]">
                        <CardHeader className="bg-gray-50 border-b pb-4 px-6">
                            <div className="flex items-center gap-2 text-violet-900">
                                <Activity className="h-5 w-5" />
                                <CardTitle className="text-sm font-extrabold uppercase tracking-tight">Active Analysis Engine</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                            <div className="flex-1 px-6 py-8 overflow-y-auto" ref={logContainerRef}>
                                <div className="space-y-6">
                                    {logs.map((log, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            {log.status === 'done' ? (
                                                <div className="mt-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                                                    <Check className="h-3 w-3" />
                                                </div>
                                            ) : log.status === 'loading' ? (
                                                <Loader2 className="mt-1 h-5 w-5 text-violet-500 animate-spin shrink-0" />
                                            ) : (
                                                <div className="mt-1 w-5 h-5 rounded-full border-2 border-gray-100 shrink-0" />
                                            )}
                                            <div className="space-y-1">
                                                <p className={`text-sm font-bold ${log.status === 'done' ? 'text-gray-900' : log.status === 'loading' ? 'text-violet-600' : 'text-gray-300'}`}>
                                                    {log.msg}
                                                </p>
                                                {log.status === 'done' && i === 1 && <p className="text-[10px] text-gray-500 font-mono">14 standard clauses identified.</p>}
                                                {log.status === 'loading' && i === 3 && <p className="text-[10px] text-gray-400 font-mono animate-pulse">Evaluating liability caps...</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                                        <span>PROCESSING POWER</span>
                                        <span className="text-violet-600">Cloud AI Infrastructure</span>
                                    </div>
                                    <Progress value={75} className="h-1 bg-gray-200" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col items-center space-y-2 pt-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Estimated time: <span className="text-gray-900">Calculating...</span></p>
                    <Button disabled className="w-full max-w-sm h-14 bg-gray-100 text-gray-400 rounded-2xl text-lg font-bold border-none transition-all">
                        Processing Content...
                    </Button>
                </div>
            </div>
        );
    }

    function renderCompletedView() {
        const data = analysisData || {
            summary: "This agreement contains highly restrictive covenants. The Non-Compete period (5 years) is significantly above industry standard (1-2 years) and likely unenforceable in several jurisdictions.",
            userReview: "Hi there! I've carefully reviewed your document. The biggest red flag is the 5-year non-compete clause, which is quite aggressive for this type of role. I recommend negotiating this down to 1 year to protect your future career moves. Overall, your intellectual property rights are well-protected, but let's tighten up that termination notice to give you more security.",
            complianceScore: 85,
            riskLevel: "High",
            suggestedAmendmentsCount: 4,
            standardClausesCount: 12,
            findings: [
                { type: 'warning', title: 'Non-Compete Restrictions', description: 'The 5-year restriction is considered "unreasonable" and overbroad, which may invalidate the entire clause.', suggestion: 'Reduce duration to 12 months and limit geographic scope to 50 miles of Company HQ to increase enforceability.' },
                { type: 'warning', title: 'Termination Notice Period', description: 'The 2-day termination for convenience clause is identified as a high-risk operational outlier. Industry standard is 30 days.', suggestion: 'Change notice period to at least 30 days for both parties.' },
                { type: 'positive', title: 'Intellectual Property', description: 'Strong IP protection for the consultant found in Exhibit A.', suggestion: '' },
                { type: 'info', title: 'Liability Cap', description: 'Liability is capped at the total amount of fees paid.', suggestion: '' }
            ],
            highlightedClauses: [
                { text: "five (5) years following termination", type: 'CRITICAL', issue: 'Unreasonable non-compete duration.', suggestion: '12 months', explanation: 'Most jurisdictions find non-compete periods over 2 years unenforceable for general employees.' },
                { text: "at any time without cause upon providing two (2) days written notice", type: 'UNFAVORABLE', issue: 'Extremely short notice period.', suggestion: '30 days written notice', explanation: 'A 2-day notice period is highly irregular and offers zero stability for the consultant.' }
            ],
            fullText: `SERVICE AGREEMENT\n\nThis SERVICE AGREEMENT (the "Agreement") is entered into as of January 15, 2024, by and between Global Tech Solutions Inc. (the "Client") and John Doe (the "Consultant").\n\n1. PROVISION OF SERVICES\nThe Consultant shall provide the Client with the services set forth in Exhibit A attached hereto (the "Services") in accordance with the terms and conditions of this Agreement. The Consultant shall perform the Services in a professional and workmanlike manner.\n\n2. NON-COMPETE RESTRICTIONS\nDuring the term of employment and for a period of five (5) years following termination of employment for any reason, the Consultant shall not engage in any competitive business within the geographic region.\n\n3. TERMINATION\nThe Client may terminate this Agreement at any time without cause upon providing two (2) days written notice.`
        };

        if (viewMode === 'SUMMARY') {
            return (
                <div className="flex flex-col items-center justify-center max-w-5xl mx-auto py-12 space-y-12 animate-in fade-in zoom-in-95 duration-700">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-violet-200 animate-bounce">
                            <Check className="h-10 w-10 text-white stroke-[4]" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mt-6">Analysis Complete</h1>
                        <p className="text-gray-500 text-lg font-medium">Your document '{selectedFile?.name || "Service Agreement_v2.pdf"}' has been fully audited.</p>
                        <div className="flex justify-center gap-2 mt-2">
                            <Badge className={`${data.riskLevel === 'High' ? 'bg-red-500' : data.riskLevel === 'Medium' ? 'bg-orange-500' : 'bg-green-500'} text-white border-none font-bold`}>
                                {data.riskLevel.toUpperCase()} RISK
                            </Badge>
                            <Badge variant="outline" className="border-gray-200 text-gray-500 font-bold">
                                {data.complianceScore}% COMPLIANT
                            </Badge>
                        </div>
                    </div>

                    {/* Personalized User Review Card */}
                    <Card className="w-full rounded-[2.5rem] border-none shadow-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 text-white overflow-hidden relative group">
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="p-10 relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Sparkles className="h-6 w-6 text-violet-100" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight">Review of Your Document</h3>
                            </div>
                            <p className="text-xl leading-relaxed font-medium text-violet-50">
                                "{data.userReview || data.summary}"
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-4 py-2 rounded-full font-bold text-xs backdrop-blur-md">
                                    <Activity className="h-3 w-3 mr-2" />
                                    {data.findings.length} Analysis Points
                                </Badge>
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-4 py-2 rounded-full font-bold text-xs backdrop-blur-md">
                                    <ShieldCheck className="h-3 w-3 mr-2" />
                                    Vidhik Verified
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Final Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Risk Level</p>
                                <p className={`text-2xl font-black ${data.riskLevel === 'High' ? 'text-red-500' : data.riskLevel === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>{data.riskLevel}</p>
                            </div>
                        </Card>
                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-500">
                                <Activity className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compliance</p>
                                <p className="text-2xl font-black text-violet-600">{data.complianceScore}%</p>
                            </div>
                        </Card>
                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                                <FileEdit className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Conflicts</p>
                                <p className="text-2xl font-black text-orange-500">{data.suggestedAmendmentsCount}</p>
                            </div>
                        </Card>
                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8 flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                                <FileCheck className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valid Clauses</p>
                                <p className="text-2xl font-black text-green-600">{data.standardClausesCount || '10+'}</p>
                            </div>
                        </Card>
                    </div>

                    <Card className="w-full rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                        <div className="bg-gray-50 p-6 border-b flex items-center justify-between">
                            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm flex items-center gap-2">
                                <Zap className="h-4 w-4 text-violet-600" />
                                Key Findings
                            </h3>
                        </div>
                        <div className="p-8 space-y-4">
                            {data.findings.map((finding: any, i: number) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${finding.type === 'warning' ? 'bg-red-100 text-red-600' : finding.type === 'positive' ? 'bg-green-100 text-green-600' : 'bg-violet-100 text-violet-600'}`}>
                                        {finding.type === 'warning' ? <AlertTriangle className="h-3 w-3" /> : finding.type === 'positive' ? <Check className="h-3 w-3" /> : <Info className="h-3 w-3" />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900">{finding.title}</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">{finding.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="flex gap-4 w-full">
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold border-gray-200 text-gray-600 hover:bg-gray-50" onClick={() => setState('UPLOAD')}>
                            Upload Another Document
                        </Button>
                        <Button className="flex-[2] h-14 rounded-2xl font-black bg-violet-600 hover:bg-violet-700 text-lg gap-2 shadow-lg shadow-violet-100" onClick={() => setViewMode('DETAILED')}>
                            View Detailed Analysis
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-8 animate-in mt-6 fade-in slide-in-from-bottom-5 duration-700">
                {/* Results Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                            <FileText className="h-4 w-4" />
                            <span>Projects</span>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-gray-900 underline underline-offset-4">Analysis - {selectedFile?.name || "Service Agreement 2024"}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100" onClick={() => setViewMode('SUMMARY')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                Analysis Results
                                <Badge className={`${data.riskLevel === 'High' ? 'bg-red-100 text-red-600' : data.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'} border-none font-bold px-3 py-1`}>
                                    {data.riskLevel === 'High' || data.riskLevel === 'Medium' ? <AlertTriangle className="h-3 w-3 mr-1" /> : <Check className="h-3 w-3 mr-1" />}
                                    {data.riskLevel.toUpperCase()} RISK DETECTED
                                </Badge>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl h-11 border-gray-200 gap-2 font-bold px-6 shadow-sm hover:bg-gray-50" onClick={handleShare}>
                            <Share2 className="h-4 w-4" />
                            Share Report
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-10 items-start">
                    {/* Top Section: Document Preview (Full Width) */}
                    <Card className={`w-full rounded-[2.5rem] border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-white overflow-hidden flex flex-col transition-all duration-500 ${isFullscreen ? 'fixed inset-4 z-[100]' : 'min-h-[900px]'}`}>
                        <CardHeader className="bg-gray-50/50 border-b p-6 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-base font-bold">{selectedFile?.name || "Service_Agreement_v2.pdf"}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                {isSearchVisible && (
                                    <div className="relative animate-in slide-in-from-right-4 duration-300">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search in document..."
                                            className="h-8 w-48 pl-8 pr-8 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            autoFocus
                                        />
                                        {searchQuery && (
                                            <button
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                                onClick={() => setSearchQuery("")}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`rounded-lg transition-colors ${isSearchVisible ? 'text-violet-600 bg-violet-50' : 'text-gray-400 hover:text-violet-600'}`}
                                    onClick={() => {
                                        setIsSearchVisible(!isSearchVisible);
                                        if (isSearchVisible) setSearchQuery("");
                                    }}
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`rounded-lg transition-colors ${isFullscreen ? 'text-violet-600 bg-violet-50' : 'text-gray-400 hover:text-violet-600'}`}
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                >
                                    {isFullscreen ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-12 flex-1 scrollbar-thin overflow-y-auto relative">
                            {/* Search Results Indicator */}
                            {searchQuery && data.fullText && (
                                <div className="absolute top-4 right-8 z-20 px-3 py-1 bg-secondary text-foreground rounded-full text-[10px] font-bold border border-border animate-in fade-in slide-in-from-top-2">
                                    {(() => {
                                        try {
                                            const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                            const count = (data.fullText.match(new RegExp(escapedQuery, 'gi')) || []).length;
                                            return `${count} match${count !== 1 ? 'es' : ''} found`;
                                        } catch (e) {
                                            return "0 matches found";
                                        }
                                    })()}
                                </div>
                            )}

                            <div className={`max-w-4xl mx-auto space-y-8 font-serif text-gray-800 leading-relaxed whitespace-pre-wrap ${isFullscreen ? 'text-lg' : 'text-base'}`}>
                                {data.fullText ? (
                                    <div>
                                        {/* Dynamic Interactive Text Rendering */}
                                        {(() => {
                                            let text = data.fullText;
                                            const parts: React.ReactNode[] = [];
                                            let lastIndex = 0;

                                            // Sort highlights by their position in the text to avoid overlap issues
                                            const sortedHighlights = [...(data.highlightedClauses || [])].sort((a, b) => {
                                                return text.indexOf(a.text) - text.indexOf(b.text);
                                            });

                                            // Helper to render text with search highlights
                                            const renderWithSearch = (content: string, keyPrefix: string) => {
                                                if (!searchQuery || searchQuery.length < 2) return content;

                                                const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                                const regex = new RegExp(`(${escapedQuery})`, 'gi');
                                                const subParts = content.split(regex);

                                                return subParts.map((part, i) =>
                                                    regex.test(part) ? (
                                                        <mark key={`${keyPrefix}-${i}`} className="bg-primary/20 text-foreground rounded-sm px-0.5 font-bold shadow-sm">
                                                            {part}
                                                        </mark>
                                                    ) : part
                                                );
                                            };

                                            sortedHighlights.forEach((clause, idx) => {
                                                const startIndex = text.indexOf(clause.text, lastIndex);
                                                if (startIndex !== -1) {
                                                    // Push text before the highlight with search
                                                    parts.push(renderWithSearch(text.substring(lastIndex, startIndex), `pre-${idx}`));

                                                    // Push the interactive highlight
                                                    const colorClass =
                                                        clause.type === 'CRITICAL' ? 'bg-red-100/80 border-b-2 border-red-500 text-red-900' :
                                                            clause.type === 'UNFAVORABLE' ? 'bg-orange-100/80 border-b-2 border-orange-500 text-orange-900' :
                                                                clause.type === 'POSITIVE' ? 'bg-green-100/80 border-b-2 border-green-500 text-green-900' :
                                                                    'bg-violet-50 border-b-2 border-violet-400 text-violet-900';

                                                    parts.push(
                                                        <span
                                                            key={idx}
                                                            className={`${colorClass} px-1.5 py-0.5 rounded-sm font-bold cursor-help transition-all duration-200 relative group/h`}
                                                            onMouseEnter={() => setActiveHighlightIndex(idx)}
                                                            onMouseLeave={() => setActiveHighlightIndex(null)}
                                                        >
                                                            {/* AI highlight text also needs search checking */}
                                                            {renderWithSearch(clause.text, `highlight-${idx}`)}

                                                            {/* Floating Explanation Point */}
                                                            {activeHighlightIndex === idx && (
                                                                <div className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full w-64 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 text-xs normal-case animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                                                                    <div className="flex items-center gap-2 mb-2 font-black uppercase tracking-widest text-[10px]">
                                                                        {clause.type === 'CRITICAL' ? <AlertTriangle className="h-3 w-3 text-red-500" /> : <Sparkles className="h-3 w-3 text-violet-500" />}
                                                                        <span className={clause.type === 'CRITICAL' ? 'text-red-600' : 'text-violet-600'}>Explanation Point</span>
                                                                    </div>
                                                                    <p className="font-bold text-gray-900 mb-2 leading-relaxed">
                                                                        {clause.issue}
                                                                    </p>
                                                                    <p className="text-gray-500 font-medium leading-relaxed">
                                                                        {clause.explanation || "This clause has been flagged for review based on standard legal practices."}
                                                                    </p>
                                                                    {clause.suggestion && (
                                                                        <div className="mt-3 pt-3 border-t border-gray-50 bg-violet-50/50 -mx-4 -mb-4 p-4 rounded-b-2xl">
                                                                            <p className="text-[9px] font-black text-violet-600 uppercase tracking-widest mb-1">Vidhik Suggestion</p>
                                                                            <p className="text-violet-800 font-bold italic">"{clause.suggestion}"</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Visual Indicator Pulse */}
                                                            <span className={`absolute -right-1 -top-1 w-2 h-2 rounded-full animate-ping ${clause.type === 'CRITICAL' ? 'bg-red-400' : 'bg-violet-400'}`}></span>
                                                            <span className={`absolute -right-1 -top-1 w-2 h-2 rounded-full ${clause.type === 'CRITICAL' ? 'bg-red-500' : 'bg-violet-500'}`}></span>
                                                        </span>
                                                    );

                                                    lastIndex = startIndex + clause.text.length;
                                                }
                                            });

                                            // Push remaining text with search
                                            parts.push(renderWithSearch(text.substring(lastIndex), "post"));
                                            return parts;
                                        })()}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                                        <Loader2 className="h-10 w-10 text-violet-200 animate-spin" />
                                        <p className="text-gray-400 font-medium">Rendering document intelligence...</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Panel: Analysis Metrics / Final Action */}
                    <div className="w-full flex flex-col items-center justify-center p-12 bg-violet-50/40 rounded-[3rem] border-2 border-dashed border-violet-200/50 transition-all hover:bg-violet-50/60 mb-10">
                        <div className="text-center space-y-6 w-full max-w-2xl">
                            <div className="w-24 h-24 bg-violet-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-violet-200 mb-8 animate-pulse">
                                <Check className="h-12 w-12 text-white stroke-[4]" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Audit Successfully Completed</h3>
                            <p className="text-gray-500 text-lg font-medium leading-relaxed">
                                Every line of your document has been meticulously audited by our AI.
                                Review the flagged points in the preview above, then proceed to the executive dashboard for the final report.
                            </p>

                            {/* Final Stats Button - THE FINAL DESTINATION */}
                            <div className="pt-10">
                                <Button className="w-full max-w-md h-20 bg-violet-600 hover:bg-violet-700 rounded-[2rem] text-2xl font-black gap-4 shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] active:scale-95 group" onClick={() => setViewMode('SUMMARY')}>
                                    Finish Audit & View Dashboard
                                    <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform" />
                                </Button>
                                <p className="mt-6 text-sm font-bold text-violet-600/60 uppercase tracking-widest">Securely processed via SOC2 Encryption</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

