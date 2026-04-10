import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Briefcase, Lock, ArrowRight, Mail, TrendingUp, Users } from "lucide-react"

const generators = [
    {
        id: "employment-contract",
        name: "Employment Agreement",
        description: "Professional contracts for permanent hires.",
        icon: FileText,
        color: "text-violet-600",
        bgColor: "bg-violet-50",
        path: "/documents/employment-contract-generator"
    },
    {
        id: "consultant-agreement",
        name: "Consultant Agreement",
        description: "Standard terms for independent contractors.",
        icon: Briefcase,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        path: "/documents/consultant-agreement"
    },
    {
        id: "nda",
        name: "Non-Disclosure Agreement",
        description: "High-accuracy confidentiality & protection agreements.",
        icon: Lock,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        path: "/documents/nda"
    },
    {
        id: "offer-letter",
        name: "Offer Letter",
        description: "Create professional job offer letters in seconds.",
        icon: Mail,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        path: "/documents/offer-letter"
    },
    {
        id: "share-subscription",
        name: "Share Subscription",
        description: "Equity issuance agreements for funding rounds.",
        icon: TrendingUp,
        color: "text-violet-600",
        bgColor: "bg-violet-50",
        path: "/documents/share-subscription"
    },
    {
        id: "board-resolution",
        name: "Board Resolution",
        description: "Official documentation for corporate decisions.",
        icon: Users,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        path: "/documents/board-resolution"
    }
]

export function AIDocumentGenerator() {
    const navigate = useNavigate();

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {generators.map((gen) => (
                <Card
                    key={gen.id}
                    className="group hover:shadow-md transition-shadow cursor-pointer rounded-xl border-slate-200"
                    onClick={() => navigate(gen.path)}
                >
                    <CardHeader className="pb-2">
                        <div className={`h-10 w-10 ${gen.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                            <gen.icon className={`h-6 w-6 ${gen.color}`} />
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-800">
                            {gen.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                            {gen.description}
                        </p>
                        <div className="flex items-center text-xs font-bold text-violet-600">
                            Get Started <ArrowRight className="ml-1 h-3 w-3" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
