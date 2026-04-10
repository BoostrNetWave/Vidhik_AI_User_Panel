import { useState } from 'react';
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

const lawyers = [
    {
        id: 1,
        name: "Adv. Rajesh Kumar",
        specialization: "Corporate Law",
        price: "₹2,500/session",
        numericPrice: 2500
    },
    {
        id: 2,
        name: "Adv. Priya Singh",
        specialization: "Family & Civil Law",
        price: "₹2,000/session",
        numericPrice: 2000
    },
    {
        id: 3,
        name: "Adv. Amit Verma",
        specialization: "Criminal Law",
        price: "₹3,500/session",
        numericPrice: 3500
    },
    {
        id: 4,
        name: "Adv. Neha Gupta",
        specialization: "Intellectual Property",
        price: "₹1,800/session",
        numericPrice: 1800
    }
];

export default function LawyerBooking() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
    
    // Form States
    const [cardData, setCardData] = useState({ name: '', number: '', expiryMonth: '', expiryYear: '', cvv: '' });
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('State Bank of India');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const lawyer = lawyers.find(l => l.id === Number(id)) || lawyers[0];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (paymentMethod === 'card') {
            if (!cardData.name.trim()) newErrors.name = "Cardholder name is required";
            if (!/^\d{16}$/.test(cardData.number.replace(/\s/g, ''))) newErrors.number = "Enter a valid 16-digit card number";
            if (!cardData.expiryMonth) newErrors.expiry = "Month required";
            if (!cardData.expiryYear) newErrors.expiry = "Year required";
            if (!/^\d{3}$/.test(cardData.cvv)) newErrors.cvv = "Enter 3-digit CVV";
        } else if (paymentMethod === 'upi') {
            if (!upiId.includes('@')) newErrors.upi = "Enter a valid UPI ID (e.g., name@upi)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = () => {
        if (validateForm()) {
            toast.success("Processing payment...");
            setTimeout(() => {
                navigate('/lawyers/booking-success');
            }, 1500);
        } else {
            toast.error("Please fix the errors before proceeding");
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
                        onClick={() => navigate(`/lawyers/${id}`)} 
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-all mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </button>
                    <h1 className="text-4xl font-bold text-foreground tracking-tight">Consultation Booking</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Column - Payment Information */}
                    <div className="flex-1 space-y-6 w-full">
                        <Card className="rounded-2xl border-border bg-card shadow-sm">
                            <CardContent className="p-8">
                                <h2 className="text-xl font-bold text-foreground mb-8">Payment Method</h2>
                                
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
                                                className={`h-12 rounded-xl ${errors.name ? 'border-destructive ring-destructive/20' : ''}`}
                                                value={cardData.name}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                                    setCardData({...cardData, name: val});
                                                }}
                                            />
                                            {errors.name && <p className="text-xs font-bold text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="font-bold">Card Number</Label>
                                            <div className="relative">
                                                <Input 
                                                    placeholder="0000 0000 0000 0000" 
                                                    className={`h-12 rounded-xl pr-12 ${errors.number ? 'border-destructive ring-destructive/20' : ''}`}
                                                    maxLength={19}
                                                    value={cardData.number}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                                                        setCardData({...cardData, number: val});
                                                    }}
                                                />
                                                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            </div>
                                            {errors.number && <p className="text-xs font-bold text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.number}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="font-bold">Expiry Date</Label>
                                                <div className="flex gap-2">
                                                    <select 
                                                        className={`flex-1 h-12 bg-background border rounded-xl px-3 text-sm font-medium outline-none focus:ring-1 focus:ring-ring ${errors.expiry ? 'border-destructive' : 'border-input'}`}
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
                                                        className={`flex-1 h-12 bg-background border rounded-xl px-3 text-sm font-medium outline-none focus:ring-1 focus:ring-ring ${errors.expiry ? 'border-destructive' : 'border-input'}`}
                                                        value={cardData.expiryYear}
                                                        onChange={(e) => setCardData({...cardData, expiryYear: e.target.value})}
                                                    >
                                                        <option value="" disabled>YYYY</option>
                                                        <option value="2024">2024</option>
                                                        <option value="2025">2025</option>
                                                        <option value="2026">2026</option>
                                                        <option value="2027">2027</option>
                                                    </select>
                                                </div>
                                                {errors.expiry && <p className="text-xs font-bold text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.expiry}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold">CVV</Label>
                                                <Input 
                                                    placeholder="123" 
                                                    type="password" 
                                                    maxLength={3}
                                                    className={`h-12 rounded-xl ${errors.cvv ? 'border-destructive ring-destructive/20' : ''}`}
                                                    value={cardData.cvv}
                                                    onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                                                />
                                                {errors.cvv && <p className="text-xs font-bold text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.cvv}</p>}
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
                                                className={`h-12 rounded-xl ${errors.upi ? 'border-destructive ring-destructive/20' : ''}`}
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                            />
                                            {errors.upi ? (
                                                <p className="text-xs font-bold text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.upi}</p>
                                            ) : (
                                                <p className="text-[10px] text-muted-foreground font-medium">A payment request will be sent to your UPI app.</p>
                                            )}
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
                                    <Checkbox id="save-payment" className="rounded-sm" />
                                    <label htmlFor="save-payment" className="text-sm font-medium text-muted-foreground leading-none cursor-pointer">
                                        Save payment details for future bookings
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
                                            <p className="font-black text-gray-900 text-lg tracking-tight leading-none">{lawyer.name}</p>
                                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{lawyer.specialization}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span>Monday, 24 March 2024</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span>10:30 AM - 11:00 AM (IST)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 py-10 border-b border-gray-100">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <p>Consultation</p>
                                        <p className="text-gray-900">{lawyer.price}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <p>Service Fee</p>
                                        <p className="text-gray-900">₹150.00</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <p>Taxes (GST 18%)</p>
                                        <p className="text-gray-900">₹{(lawyer.numericPrice * 0.18).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="py-12">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Total Amount</p>
                                    <p className="text-5xl font-black text-gray-900 tracking-tighter">
                                        ₹{(lawyer.numericPrice + 150 + (lawyer.numericPrice * 0.18)).toLocaleString()}
                                    </p>
                                </div>

                                <Button 
                                    className="w-full h-16 rounded-2xl bg-violet-700 text-white hover:bg-violet-800 active:bg-violet-900 disabled:bg-violet-700 disabled:text-white shadow-2xl shadow-gray-200 transition-all font-black text-base flex items-center justify-center gap-3 uppercase tracking-widest active:scale-[0.98]"
                                    onClick={handlePayment}
                                >
                                    <Lock className="w-4 h-4" />
                                    Confirm & Pay
                                </Button>

                                <p className="text-center text-[10px] font-medium text-muted-foreground mt-6 leading-relaxed px-4">
                                    By confirming, you agree to the <a href="#" className="underline hover:text-foreground transition-colors">Booking Policy</a> and <a href="#" className="underline hover:text-foreground transition-colors">Terms of Service</a>.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-[10px] tracking-wide font-medium text-muted-foreground mt-auto">
                © 2024 Vidhik A.I. Secure payments powered by Vidhik Gateway.
            </footer>
        </div>
    );
}
