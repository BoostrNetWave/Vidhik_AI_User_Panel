import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, HelpCircle, Upload } from "lucide-react"

export function QuickActions() {
    const navigate = useNavigate();
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Generate Document */}
            <Card
                className="bg-primary text-white border-none shadow-md hover:bg-primary/90 transition-colors cursor-pointer rounded-xl"
                onClick={() => navigate('/documents/hub')}
            >
                <CardHeader className="pb-2">
                    <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                        <Plus className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Generate Document</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-primary-foreground/80 text-sm">
                        Draft legal contracts, NDAs, or court petitions with AI.
                    </CardDescription>
                </CardContent>
            </Card>

            {/* Ask Legal Question */}
            <Card 
                className="hover:shadow-md transition-shadow cursor-pointer rounded-xl border-slate-200"
                onClick={() => navigate('/research')}
            >
                <CardHeader className="pb-2">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 text-primary">
                        <HelpCircle className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold">Ask Legal Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-slate-600 text-sm">
                        AI-powered research and analysis on case laws.
                    </CardDescription>
                </CardContent>
            </Card>

            {/* Upload for Review */}
            <Card 
                className="hover:shadow-md transition-shadow cursor-pointer rounded-xl border-slate-200"
                onClick={() => navigate('/documents/review')}
            >
                <CardHeader className="pb-2">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 text-primary">
                        <Upload className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold">Upload for Review</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-slate-600 text-sm">
                        Compliance checks and risk factors analysis.
                    </CardDescription>
                </CardContent>
            </Card>
        </div>
    )
}
