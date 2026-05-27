import { useEffect, useState } from "react";
import { 
    Briefcase, 
    AlertCircle, 
    Clock, 
    User, 
    Coins, 
    FileText, 
    ExternalLink,
    ShieldAlert
} from "lucide-react";
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { caseService, ICase } from "@/services/caseService";
import { toast } from "sonner";

export default function CasesPage() {
    const [cases, setCases] = useState<ICase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCase, setSelectedCase] = useState<ICase | null>(null);

    const fetchCases = async () => {
        setLoading(true);
        try {
            const data = await caseService.getClientCases();
            setCases(data);
            if (selectedCase) {
                const updated = data.find(c => c._id === selectedCase._id);
                if (updated) setSelectedCase(updated);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to load cases");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCases();
    }, []);

    const handleApprovePlan = async () => {
        if (!selectedCase) return;

        try {
            const updated = await caseService.approvePlan(selectedCase._id);
            toast.success("Roadmap approved successfully! Work can now begin.");
            fetchCases();
            setSelectedCase(updated);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to approve plan");
        }
    };

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Cases & Roadmaps</h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Track case progress, verify lawyer proof documents, and monitor milestone payments.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Case List (4 Cols) */}
                    <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 space-y-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-lg">Hired Lawyers & Cases</h3>

                        {loading && cases.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-2 text-xs text-slate-400 font-bold">Loading engagements...</p>
                            </div>
                        ) : cases.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 border border-dashed border-border rounded-2xl">
                                <Briefcase size={36} className="mx-auto mb-2 text-muted-foreground/30" />
                                <p className="font-bold text-sm">No active cases</p>
                                <p className="text-xs text-slate-400 px-4 mt-1">Once you hire a lawyer for a case, it will show up here.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                                {cases.map((c) => (
                                    <div
                                        key={c._id}
                                        onClick={() => setSelectedCase(c)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                            selectedCase?._id === c._id
                                                ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                                                : "border-border bg-card hover:border-slate-350 hover:shadow-sm"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">{c.title}</h4>
                                            <Badge variant={c.status === "active" ? "default" : "secondary"} className="text-[9px] shrink-0 font-extrabold uppercase px-2 py-0.5 rounded-full">
                                                {c.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{c.description}</p>
                                        
                                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-border pt-3">
                                            <div className="flex items-center gap-1.5">
                                                <User size={12} className="text-slate-400" />
                                                <span className="text-slate-700 truncate max-w-[120px]">
                                                    {c.lawyer?.fullName || "Assigned Lawyer"}
                                                </span>
                                            </div>
                                            <span className="text-slate-900 font-black">₹{c.totalFee.toLocaleString()}</span>
                                        </div>

                                        {/* Small Progress Bar */}
                                        <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className="bg-primary h-1.5 rounded-full transition-all duration-500" 
                                                style={{ width: `${c.currentProgress}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-1 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            <span>Progress</span>
                                            <span className="text-primary">{c.currentProgress}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Case Details (8 Cols) */}
                    <div className="lg:col-span-8">
                        {selectedCase ? (
                            <Card className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                                <CardContent className="p-6 md:p-8 space-y-8">
                                    
                                    {/* Case Title and Status */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-6">
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{selectedCase.title}</h2>
                                            <p className="text-xs text-slate-400 font-medium">Case Ref: <span className="font-mono">{selectedCase._id}</span></p>
                                        </div>
                                        <div className="flex flex-row items-center gap-6 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Assigned Lawyer</p>
                                                <p className="text-sm font-black text-slate-900">{selectedCase.lawyer?.fullName}</p>
                                            </div>
                                            <div className="w-px h-8 bg-slate-250" />
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Contract Fee</p>
                                                <p className="text-sm font-black text-primary">₹{selectedCase.totalFee.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lawyer Details card */}
                                    <div className="bg-slate-50/50 border border-border p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-700 font-black text-base shrink-0 overflow-hidden">
                                            {selectedCase.lawyer?.avatar ? (
                                                <img 
                                                    src={`http://localhost:3000/lawyer${selectedCase.lawyer.avatar}`} 
                                                    alt="Lawyer Avatar" 
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                selectedCase.lawyer?.fullName.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{selectedCase.lawyer?.fullName}</h4>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedCase.lawyer?.title || "Senior Counsel"} • {selectedCase.lawyer?.expertise || "Corporate Specialist"}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Contact: {selectedCase.lawyer?.email}</p>
                                        </div>
                                    </div>

                                    {/* Case Description */}
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-slate-900 text-sm">Engagement Scope</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/40 border border-border rounded-xl p-4">{selectedCase.description}</p>
                                    </div>

                                    <Separator />

                                    {/* Action Plan & Milestone Checklist */}
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <h3 className="font-bold text-slate-900 text-lg">Procedural Action Plan</h3>
                                            
                                            <Badge variant={
                                                selectedCase.planApproved ? "default" : selectedCase.planSubmitted ? "secondary" : "destructive"
                                            } className="text-xs px-3 py-1 font-bold">
                                                {selectedCase.planApproved 
                                                    ? "Active Plan" 
                                                    : selectedCase.planSubmitted 
                                                        ? "Roadmap Pending Your Approval" 
                                                        : "Awaiting Lawyer Setup"}
                                            </Badge>
                                        </div>

                                        {!selectedCase.planSubmitted ? (
                                            /* NO ROADMAP YET */
                                            <div className="bg-slate-50 border border-border rounded-2xl p-8 text-center space-y-4">
                                                <Clock size={36} className="text-slate-350 mx-auto animate-pulse" />
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-slate-900 text-sm">Lawyer is mapping out the roadmap...</h4>
                                                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-normal">
                                                        Advocate {selectedCase.lawyer?.fullName} is currently structuring the detailed milestones and procedural stages for your work. Once submitted, you will review and approve the roadmap here.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : !selectedCase.planApproved ? (
                                            /* ROADMAP REQUIRES CLIENT APPROVAL */
                                            <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 space-y-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 bg-amber-100 rounded-xl text-amber-700 mt-1 shrink-0">
                                                        <ShieldAlert size={20} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <h4 className="font-extrabold text-amber-900 text-sm">Review & Approve Action Plan</h4>
                                                        <p className="text-xs text-amber-700 leading-relaxed">
                                                            Your lawyer has proposed the following milestone breakdown. Review the tasks, progress contributions, and payouts. If they align with your expectations, click **Approve Action Plan** to initiate the legal engagement.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Proposed milestones preview */}
                                                <div className="space-y-3">
                                                    {selectedCase.milestones.map((m, idx) => (
                                                        <div key={idx} className="bg-white border border-amber-150 p-4 rounded-xl flex justify-between items-center gap-4 shadow-sm">
                                                            <div>
                                                                <h5 className="font-bold text-slate-900 text-xs">{idx + 1}. {m.title}</h5>
                                                                <p className="text-[11px] text-slate-500 mt-0.5">{m.description}</p>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">+{m.progressIncrement}% Progress</span>
                                                                <p className="text-xs font-black text-slate-900 mt-1">₹{m.payoutAmount.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-end pt-3">
                                                    <Button 
                                                        onClick={handleApprovePlan}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl px-6 py-2 shadow-lg shadow-indigo-100"
                                                    >
                                                        Approve Action Plan
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* ACTIVE ROADMAP STEPPER & PROGRESS */
                                            <div className="space-y-6 animate-in fade-in duration-300">
                                                
                                                {/* Progress Indicator */}
                                                <div className="bg-slate-50 border border-border p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Verification Progress</p>
                                                        <h3 className="text-2xl font-black text-slate-900 mt-0.5">{selectedCase.currentProgress}% Work Completed</h3>
                                                    </div>
                                                    <div className="flex-1 max-w-md bg-slate-200 rounded-full h-3 overflow-hidden">
                                                        <div 
                                                            className="bg-primary h-3 rounded-full transition-all duration-700" 
                                                            style={{ width: `${selectedCase.currentProgress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Milestones Stepper */}
                                                <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 ml-3 py-2">
                                                    {selectedCase.milestones.map((m, idx) => {
                                                        const isCompleted = m.status === 'completed';
                                                        const isInProgress = m.status === 'in_progress';
                                                        
                                                        return (
                                                            <div key={idx} className="relative">
                                                                {/* Dot */}
                                                                <div className={`absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-white ${
                                                                    isCompleted 
                                                                        ? "bg-green-500 shadow-md ring-4 ring-green-50" 
                                                                        : isInProgress 
                                                                            ? "bg-primary animate-pulse ring-4 ring-indigo-50" 
                                                                            : "bg-slate-300"
                                                                }`} />

                                                                <div className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:shadow-sm transition-all duration-200">
                                                                    <div className="flex justify-between items-center gap-4">
                                                                        <div>
                                                                            <span className="font-mono text-[9px] font-black text-slate-400">STAGE {idx + 1} ({m.progressIncrement}%)</span>
                                                                            <h4 className="font-bold text-slate-900 text-sm mt-0.5">{m.title}</h4>
                                                                        </div>
                                                                        <Badge variant={
                                                                            isCompleted ? "default" : isInProgress ? "secondary" : "outline"
                                                                        } className="text-[9px] font-bold uppercase">
                                                                            {m.status.replace('_', ' ')}
                                                                        </Badge>
                                                                    </div>

                                                                    <p className="text-slate-500 text-xs leading-relaxed">{m.description}</p>

                                                                    {/* Proof of Work and verification documents */}
                                                                    {selectedCase.planApproved && (
                                                                        <div className="border-t border-border pt-3 mt-2 space-y-3">
                                                                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                                                <div className="space-y-1 w-full">
                                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verification Proof & Progress Updates</span>
                                                                                    {m.proofDocs.length === 0 ? (
                                                                                        <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                                                                                            <AlertCircle size={12} />
                                                                                            Awaiting progress updates or files from lawyer.
                                                                                        </p>
                                                                                    ) : (
                                                                                        <div className="space-y-3 w-full">
                                                                                            {m.proofDocs.map((doc, dIdx) => {
                                                                                                const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.url);
                                                                                                return (
                                                                                                    <div key={dIdx} className="space-y-2 border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                                                                                                        <div className="flex flex-wrap items-center gap-2">
                                                                                                            <a 
                                                                                                                href={`http://localhost:3000/lawyer${doc.url}`}
                                                                                                                target="_blank"
                                                                                                                rel="noreferrer"
                                                                                                                className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1.5"
                                                                                                            >
                                                                                                                <FileText size={12} />
                                                                                                                <span>{doc.name}</span>
                                                                                                                <ExternalLink size={10} />
                                                                                                            </a>
                                                                                                            <span className="text-[9px] text-slate-400 font-semibold">({new Date(doc.uploadedAt).toLocaleString()})</span>
                                                                                                        </div>
                                                                                                        {doc.details && (
                                                                                                            <p className="text-[11px] text-slate-600 bg-slate-100/50 border border-slate-200/50 rounded-lg p-2.5 mt-1 leading-relaxed">
                                                                                                                {doc.details}
                                                                                                            </p>
                                                                                                        )}
                                                                                                        {isImg && (
                                                                                                            <div className="mt-2 rounded-xl overflow-hidden border border-border bg-slate-100 max-w-sm shadow-sm relative group">
                                                                                                                <img 
                                                                                                                    src={`http://localhost:3000/lawyer${doc.url}`} 
                                                                                                                    alt={doc.name}
                                                                                                                    className="max-h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                                                                                                />
                                                                                                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                                                                    <a 
                                                                                                                        href={`http://localhost:3000/lawyer${doc.url}`}
                                                                                                                        target="_blank"
                                                                                                                        rel="noreferrer"
                                                                                                                        className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md flex items-center gap-1"
                                                                                                                    >
                                                                                                                        <ExternalLink size={10} />
                                                                                                                        Expand Proof Photo
                                                                                                                    </a>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                );
                                                                                            })}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {/* Payout status */}
                                                                            {isCompleted && (
                                                                                <div className="flex justify-between items-center p-3 rounded-xl border border-border bg-slate-50/30">
                                                                                    <div>
                                                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Milestone Payment</span>
                                                                                        <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                                                                                            <Coins size={12} className="text-orange-500" />
                                                                                            ₹{m.payoutAmount.toLocaleString()}
                                                                                        </p>
                                                                                    </div>
                                                                                    
                                                                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded ${
                                                                                        m.payoutStatus === 'approved' 
                                                                                            ? "bg-green-100 text-green-700" 
                                                                                            : m.payoutStatus === 'requested' 
                                                                                                ? "bg-amber-100 text-amber-700 animate-pulse" 
                                                                                                : "bg-slate-100 text-slate-500"
                                                                                    }`}>
                                                                                        {m.payoutStatus === 'approved' 
                                                                                            ? "Released (Paid)" 
                                                                                            : m.payoutStatus === 'requested' 
                                                                                                ? "Awaiting Admin Release" 
                                                                                                : "Pending Work Completion"}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="rounded-3xl border border-border bg-card shadow-sm p-12 text-center">
                                <Briefcase size={48} className="mx-auto mb-4 text-muted-foreground/30" />
                                <h3 className="font-bold text-slate-900 text-xl">Select a Case</h3>
                                <p className="text-slate-500 text-sm max-w-md mx-auto mt-2">
                                    Choose an engagement from the sidebar list to view detail roadmaps, lawyer bios, upload proofs, and monitor payment approvals.
                                </p>
                            </Card>
                        )}
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
