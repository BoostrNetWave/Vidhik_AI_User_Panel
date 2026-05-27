import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Lock, 
    CreditCard, 
    ShieldCheck, 
    CheckCircle2,
    User,
    Calendar,
    Clock,
    Smartphone,
    Building2,
    AlertCircle,
    Gavel
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { lawyerService } from '@/services/lawyerService';
import { caseService } from '@/services/caseService';

export default function LawyerBooking() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
    
    // Lawyer & Booking State
    const [lawyer, setLawyer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    
    // Case Info State
    const [caseTitle, setCaseTitle] = useState('');
    const [description, setDescription] = useState('');
    
    // Form States (Bypassed but kept for UI visual fidelity)
    const [cardData, setCardData] = useState({ name: '', number: '', expiryMonth: '', expiryYear: '', cvv: '' });
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('State Bank of India');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchLawyer = async () => {
            if (!id) return;
            try {
                const data = await lawyerService.getPublicLawyerById(id);
                setLawyer(data);
            } catch (error) {
                console.error("Failed to fetch lawyer details", error);
                toast.error("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };
        fetchLawyer();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans items-center justify-center gap-4">
                <div className="h-10 w-10 border-4 border-violet-700 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-semibold">Loading booking page...</p>
            </div>
        );
    }

    if (!lawyer) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans items-center justify-center gap-4">
                <h3 className="text-xl font-bold text-foreground">Lawyer profile not found</h3>
                <Button onClick={() => navigate('/lawyers')} className="bg-primary text-primary-foreground font-bold rounded-xl">
                    Back to Lawyer List
                </Button>
            </div>
        );
    }

    const hourlyRate = lawyer.hourlyRate || 1000;
    const serviceFee = 150;
    const gst = hourlyRate * 0.18;
    const totalAmount = hourlyRate + serviceFee + gst;

    const handlePayment = async () => {
        const newErrors: Record<string, string> = {};
        if (!caseTitle.trim()) {
            newErrors.caseTitle = "Case title / request topic is required";
        }
        if (!description.trim()) {
            newErrors.description = "Case description of legal needs is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Please fill in your case details before proceeding");
            return;
        }

        setErrors({});
        setIsBooking(true);

        try {
            toast.info("Submitting booking request...");
            
            // Invoke the case creation/hiring endpoint on the user backend
            await caseService.hireLawyer({
                lawyerId: lawyer._id,
                title: caseTitle.trim(),
                description: description.trim(),
                totalFee: totalAmount
            });

            toast.success("Consultation Booked Successfully!");
            
            // Redirect to success page and pass lawyer name and specialization via router state
            navigate('/lawyers/booking-success', {
                state: {
                    lawyerName: lawyer.fullName,
                    specialization: lawyer.expertise || "General Practice"
                }
            });
        } catch (error: any) {
            console.error("Booking error:", error);
            toast.error(error.response?.data?.message || "Failed to register case booking");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans mb-12">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-100 py-4 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xl overflow-hidden whitespace-nowrap">
                    <div className="h-8 w-8 bg-violet-700 rounded-lg flex items-center justify-center text-white shrink-0">
                        <Gavel className="h-5 w-5" />
                    </div>
                    <span className="leading-none text-gray-900">Vidhik AI</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-semibold text-sm">
                    <Lock className="w-4 h-4" />
                    Secure Checkout
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
                <div className="mb-8">
                    <button 
                        onClick={() => navigate(`/lawyers/${lawyer._id}`)} 
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-all mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </button>
                    <h1 className="text-4xl font-bold text-foreground tracking-tight">Consultation Booking</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Column - Request Info & Payment Bypass */}
                    <div className="flex-1 space-y-6 w-full">
                        {/* Test Mode Banner */}
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">Test Booking Mode Active</p>
                                <p className="text-xs text-amber-700/90 mt-1 font-medium leading-relaxed">
                                    This environment is configured for testing case management workflows. Clicking <strong>Confirm & Pay</strong> will immediately create a real case registry record linked to this lawyer in MongoDB, completely bypassing payment authorization.
                                </p>
                            </div>
                        </div>

                        {/* Legal Case Details Card */}
                        <Card className="rounded-2xl border-border bg-card shadow-sm">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-border">
                                    <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-700">
                                        <Gavel className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Legal Request Details</h2>
                                        <p className="text-xs text-muted-foreground">Describe your legal requirements to set up the case roadmap.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="case-title" className="font-bold text-sm">Case Title / Topic</Label>
                                        <Input 
                                            id="case-title"
                                            placeholder="e.g. Property Title Verification, LLC Registration, NDA Drafting" 
                                            className={`h-12 rounded-xl ${errors.caseTitle ? 'border-destructive ring-destructive/20' : ''}`}
                                            value={caseTitle}
                                            onChange={(e) => setCaseTitle(e.target.value)}
                                        />
                                        {errors.caseTitle && (
                                            <p className="text-xs font-bold text-destructive flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" /> {errors.caseTitle}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="case-desc" className="font-bold text-sm">Brief Description of Legal Needs</Label>
                                        <textarea 
                                            id="case-desc"
                                            placeholder="Describe the background of your dispute, what stages/steps you expect, or specific legal questions you have..." 
                                            className={`w-full bg-background border rounded-xl p-4 text-sm font-medium outline-none focus:ring-1 focus:ring-ring min-h-[140px] ${
                                                errors.description ? 'border-destructive focus:ring-destructive' : 'border-input'
                                            }`}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        {errors.description && (
                                            <p className="text-xs font-bold text-destructive flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" /> {errors.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Selection Layout (Visible to preserve layout fidelity) */}
                        <Card className="rounded-2xl border-border bg-card shadow-sm opacity-90">
                            <CardContent className="p-8">
                                <h2 className="text-xl font-bold text-foreground mb-8">Select Payment Method (Simulation)</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <button 
                                        onClick={() => setPaymentMethod('card')}
                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:bg-accent'}`}
                                    >
                                        <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span className={`text-sm font-bold ${paymentMethod === 'card' ? 'text-primary' : 'text-foreground'}`}>Card</span>
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${paymentMethod === 'upi' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:bg-accent'}`}
                                    >
                                        <Smartphone className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span className={`text-sm font-bold ${paymentMethod === 'upi' ? 'text-primary' : 'text-foreground'}`}>UPI</span>
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('netbanking')}
                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${paymentMethod === 'netbanking' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:bg-accent'}`}
                                    >
                                        <Building2 className={`w-5 h-5 ${paymentMethod === 'netbanking' ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span className={`text-sm font-bold ${paymentMethod === 'netbanking' ? 'text-primary' : 'text-foreground'}`}>Net Banking</span>
                                    </button>
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="space-y-2">
                                            <Label className="font-bold">Cardholder Name</Label>
                                            <Input 
                                                placeholder="John Doe" 
                                                className="h-12 rounded-xl"
                                                value={cardData.name}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                                    setCardData({...cardData, name: val});
                                                }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="font-bold">Card Number</Label>
                                            <div className="relative">
                                                <Input 
                                                    placeholder="4111 2222 3333 4444" 
                                                    className="h-12 rounded-xl pr-12"
                                                    maxLength={19}
                                                    value={cardData.number}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                                                        setCardData({...cardData, number: val});
                                                    }}
                                                />
                                                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="font-bold">Expiry Date</Label>
                                                <div className="flex gap-2">
                                                    <select 
                                                        className="flex-1 h-12 bg-background border border-input rounded-xl px-3 text-sm font-medium outline-none focus:ring-1 focus:ring-ring"
                                                        value={cardData.expiryMonth}
                                                        onChange={(e) => setCardData({...cardData, expiryMonth: e.target.value})}
                                                    >
                                                        <option value="" disabled>MM</option>
                                                        {Array.from({ length: 12 }, (_, i) => {
                                                            const m = (i + 1).toString().padStart(2, '0');
                                                            return <option key={m} value={m}>{m}</option>;
                                                        })}
                                                    </select>
                                                    <select 
                                                        className="flex-1 h-12 bg-background border border-input rounded-xl px-3 text-sm font-medium outline-none focus:ring-1 focus:ring-ring"
                                                        value={cardData.expiryYear}
                                                        onChange={(e) => setCardData({...cardData, expiryYear: e.target.value})}
                                                    >
                                                        <option value="" disabled>YYYY</option>
                                                        <option value="2026">2026</option>
                                                        <option value="2027">2027</option>
                                                        <option value="2028">2028</option>
                                                        <option value="2029">2029</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold">CVV</Label>
                                                <Input 
                                                    placeholder="123" 
                                                    type="password" 
                                                    maxLength={3}
                                                    className="h-12 rounded-xl"
                                                    value={cardData.cvv}
                                                    onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'upi' && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="space-y-2">
                                            <Label className="font-bold">Enter UPI ID</Label>
                                            <Input 
                                                placeholder="username@upi" 
                                                className="h-12 rounded-xl"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                            />
                                            <p className="text-[10px] text-muted-foreground font-medium">Payment simulations will automatically complete.</p>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'netbanking' && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="space-y-2">
                                            <Label className="font-bold">Select Bank</Label>
                                            <select 
                                                className="w-full h-12 bg-background border border-input rounded-xl px-4 text-sm font-medium outline-none focus:ring-1 focus:ring-ring"
                                                value={selectedBank}
                                                onChange={(e) => setSelectedBank(e.target.value)}
                                            >
                                                <option>State Bank of India</option>
                                                <option>HDFC Bank</option>
                                                <option>ICICI Bank</option>
                                                <option>Axis Bank</option>
                                                <option>Kotak Mahindra Bank</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 flex items-center space-x-3">
                                    <Checkbox id="save-payment" className="rounded-sm" defaultChecked />
                                    <label htmlFor="save-payment" className="text-sm font-medium text-muted-foreground leading-none cursor-pointer">
                                        Save billing details for quick booking
                                    </label>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-row items-center justify-center gap-8 py-4 opacity-50">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <ShieldCheck className="w-4 h-4" />
                                PCI DSS COMPLIANT
                            </div>
                            <div className="flex flex-row items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4" />
                                SSL SECURE 256-BIT
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-[420px]">
                        <Card className="rounded-[2rem] border border-gray-200 bg-white shadow-xl shadow-gray-200/50 sticky top-24 overflow-hidden">
                            <CardContent className="p-10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-10">Order Summary</h3>
                                
                                <div className="space-y-8 pb-10 border-b border-gray-100">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                            <User className="h-7 w-7 text-gray-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-black text-gray-900 text-lg tracking-tight leading-none">{lawyer.fullName}</p>
                                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{lawyer.expertise || "General Practice"}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span>Session Scheduled Instantly</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span>30-Min Priority Video Call</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 py-10 border-b border-gray-100">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <p>Consultation (1 hr)</p>
                                        <p className="text-gray-900">₹{hourlyRate.toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <p>Vidhik Platform Fee</p>
                                        <p className="text-gray-900">₹{serviceFee.toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <p>Taxes (GST 18%)</p>
                                        <p className="text-gray-900">₹{gst.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="py-12">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Total Amount</p>
                                    <p className="text-5xl font-black text-gray-900 tracking-tighter">
                                        ₹{Math.round(totalAmount).toLocaleString()}
                                    </p>
                                </div>

                                <Button 
                                    className="w-full h-16 rounded-2xl bg-violet-700 text-white hover:bg-violet-800 active:bg-violet-900 disabled:bg-violet-400 shadow-2xl transition-all font-black text-base flex items-center justify-center gap-3 uppercase tracking-widest active:scale-[0.98]"
                                    onClick={handlePayment}
                                    disabled={isBooking}
                                >
                                    <Lock className="w-4 h-4" />
                                    {isBooking ? "Registering Case..." : "Confirm & Book"}
                                </Button>

                                <p className="text-center text-[10px] font-medium text-muted-foreground mt-6 leading-relaxed px-4">
                                    By confirming, you agree to setup a case registry with the lawyer in accordance with the platform's booking terms.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-[10px] tracking-wide font-medium text-muted-foreground mt-auto">
                © 2026 Vidhik A.I. Central Case Gateway.
            </footer>
        </div>
    );
}
