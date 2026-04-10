import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    User, 
    Star, 
    MapPin, 
    ShieldCheck, 
    Clock, 
    MessageSquare, 
    ArrowRight,
    Filter,
    Award} from 'lucide-react';
import DashboardLayout from "@/layout/DashboardLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const lawyers = [
    {
        id: 1,
        name: "Adv. Rajesh Kumar",
        specialization: "Corporate Law",
        experience: "15+ Years",
        rating: 4.9,
        reviews: 124,
        location: "New Delhi",
        status: "Online",
        verified: true,
        price: "₹2,500/session",
        tags: ["Mergers & Acquisitions", "Contract Law", "Compliance"]
    },
    {
        id: 2,
        name: "Adv. Priya Singh",
        specialization: "Family & Civil Law",
        experience: "12+ Years",
        rating: 4.8,
        reviews: 89,
        location: "Mumbai",
        status: "Online",
        verified: true,
        price: "₹2,000/session",
        tags: ["Divorce", "Property Disputes", "Civil Litigation"]
    },
    {
        id: 3,
        name: "Adv. Amit Verma",
        specialization: "Criminal Law",
        experience: "20+ Years",
        rating: 5.0,
        reviews: 215,
        location: "Bangalore",
        status: "Busy",
        verified: true,
        price: "₹3,500/session",
        tags: ["Bail", "White Collar Crime", "Cyber Law"]
    },
    {
        id: 4,
        name: "Adv. Neha Gupta",
        specialization: "Intellectual Property",
        experience: "8+ Years",
        rating: 4.7,
        reviews: 56,
        location: "Hyderabad",
        status: "Online",
        verified: true,
        price: "₹1,800/session",
        tags: ["Trademarks", "Patents", "Copyright"]
    },
    {
        id: 5,
        name: "Adv. Vikram Sethi",
        specialization: "Taxation Law",
        experience: "18+ Years",
        rating: 4.9,
        reviews: 142,
        location: "Chennai",
        status: "Online",
        verified: true,
        price: "₹3,200/session",
        tags: ["GST", "Income Tax", "Corporate Tax"]
    },
    {
        id: 6,
        name: "Adv. Ananya Rao",
        specialization: "Civil Litigation",
        experience: "10+ Years",
        rating: 4.6,
        reviews: 74,
        location: "Pune",
        status: "Online",
        verified: true,
        price: "₹2,200/session",
        tags: ["Land Disputes", "Recovery Suits", "Writ Petitions"]
    },
    {
        id: 7,
        name: "Adv. Sanjay Mehta",
        specialization: "Corporate Law",
        experience: "25+ Years",
        rating: 5.0,
        reviews: 310,
        location: "Kolkata",
        status: "Online",
        verified: true,
        price: "₹5,000/session",
        tags: ["IPO", "Banking Law", "Insolvency"]
    },
    {
        id: 8,
        name: "Adv. Meera Joshi",
        specialization: "Criminal Law",
        experience: "14+ Years",
        rating: 4.8,
        reviews: 92,
        location: "Ahmedabad",
        status: "Online",
        verified: true,
        price: "₹2,800/session",
        tags: ["Anticipatory Bail", "Criminal Appeals", "NDPS"]
    }
];

export default function AILawyerList() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Corporate", "Criminal", "Family", "Civil", "IP Law", "Taxation"];

    const filteredLawyers = lawyers.filter(lawyer => {
        const matchesSearch = 
            lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lawyer.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lawyer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lawyer.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategory === "All" || 
            lawyer.specialization.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            (selectedCategory === "IP Law" && lawyer.specialization === "Intellectual Property");

        return matchesSearch && matchesCategory;
    });

    return (
        <DashboardLayout userNav={<UserNav />}>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Lawyer List</h1>
                        <p className="text-muted-foreground font-medium">Connect with verified legal experts powered by AI matching.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl border-border font-semibold h-11">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                        <Button className="bg-violet-700 text-white hover:bg-violet-800 rounded-xl font-bold h-11 shadow-sm">
                            Book Consultation
                        </Button>
                    </div>
                </div>

                {/* Lawyer Search Box - Redesigned as per image intent with Shadcn colors */}
                <div className="relative group max-w-4xl mx-auto">
                    <div className="relative bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4 transition-all duration-300">
                        <div className="flex-1 flex items-center gap-4 w-full">
                            <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                                <Search className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Input 
                                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg font-semibold placeholder:text-muted-foreground/60"
                                placeholder="Lawyer Search (Find by name, specialization, or location...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="h-8 w-[1px] bg-border mx-2 hidden md:block"></div>
                            <Button className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 px-8 font-bold transition-all shadow-sm">
                                Search Experts
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            className={`rounded-xl font-semibold h-9 px-5 whitespace-nowrap transition-all ${
                                selectedCategory === cat 
                                ? "bg-primary text-primary-foreground shadow-sm" 
                                : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Lawyer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredLawyers.length > 0 ? (
                        filteredLawyers.map((lawyer) => (
                            <Card key={lawyer.id} className="rounded-2xl border border-border bg-card hover:shadow-md transition-all duration-300 group overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        {/* Profile Image / Avatar Placeholder */}
                                        <div className="relative shrink-0">
                                            <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center border border-border shadow-sm">
                                                <User className="h-10 w-10 text-muted-foreground/40" />
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-card flex items-center justify-center ${
                                                lawyer.status === "Online" ? "bg-green-500" : "bg-gray-300"
                                            }`}>
                                                {lawyer.status === "Online" && (
                                                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-xl font-bold text-foreground">{lawyer.name}</h3>
                                                        {lawyer.verified && (
                                                            <ShieldCheck className="h-4 w-4 text-primary" />
                                                        )}
                                                    </div>
                                                    <p className="text-primary font-semibold uppercase tracking-wider text-[10px]">{lawyer.specialization}</p>
                                                </div>
                                                <div className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-lg border border-border">
                                                    <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                                                    <span className="font-bold text-foreground text-xs">{lawyer.rating}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                                    <Clock className="h-4 w-4 text-muted-foreground/60" />
                                                    {lawyer.experience} exp.
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                                    <MapPin className="h-4 w-4 text-muted-foreground/60" />
                                                    {lawyer.location}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {lawyer.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="bg-secondary/50 text-muted-foreground border-none font-semibold text-[9px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="pt-5 flex items-center justify-between border-t border-border mt-5">
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Consultation Fee</p>
                                                    <p className="text-base font-bold text-foreground">{lawyer.price}</p>
                                                </div>
                                                <Button 
                                                    className="rounded-xl h-10 px-5 bg-violet-700 text-white hover:bg-violet-800 font-bold gap-2 transition-all"
                                                    onClick={() => navigate(`/lawyers/${lawyer.id}`)}
                                                >
                                                    View Profile
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
                                <Search className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No lawyers found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                            <Button 
                                variant="link" 
                                className="mt-4 text-primary font-bold"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All");
                                }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* Bottom CTA / Premium Section */}
                <div className="bg-primary text-primary-foreground rounded-3xl p-10 relative overflow-hidden shadow-sm">
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-5 max-w-xl text-center md:text-left">
                            <Badge variant="outline" className="text-primary-foreground border-primary-foreground/30 font-bold text-[10px] px-3 py-1 rounded-full tracking-widest uppercase">Premium Membership</Badge>
                            <h2 className="text-3xl font-bold leading-tight">Join the network of top legal professionals.</h2>
                            <p className="text-primary-foreground/80 font-medium text-base leading-relaxed">List your practice on Vidhik AI and reach thousands of potential clients looking for expert legal assistance.</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-5 pt-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/20">
                                        <Award className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold text-sm">Expert Verification</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/20">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold text-sm">Priority Support</span>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-2xl h-16 px-10 font-bold text-lg shadow-sm transition-all">
                                List Your Practice
                            </Button>
                            <p className="text-center text-primary-foreground/60 text-[10px] font-bold uppercase tracking-widest">Trusted by 5,000+ Lawyers</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
