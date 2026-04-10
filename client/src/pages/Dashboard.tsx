import DashboardLayout from "@/layout/DashboardLayout"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { AIDocumentGenerator } from "@/components/dashboard/AIDocumentGenerator"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { UserNav } from "@/components/dashboard/UserNav"
import { Calendar } from "lucide-react"

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const fullName = user.fullName || 'User';
    // const designation = user.designation || 'Legal Member';

    // Format current date: "Sunday, 29 March 2026"
    const currentDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <DashboardLayout userNav={<UserNav />}>
            {/* Header Section */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Welcome back, {fullName}
                </h1>
                <div className="flex items-center text-sm text-slate-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{currentDate}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            {/* Quick Actions */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    Quick Actions
                </h2>
                <QuickActions />
            </div>

            {/* AI Document Generator */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    AI Document Generator
                </h2>
                <AIDocumentGenerator />
            </div>

            {/* Recent Activity */}
            <RecentActivity />
        </DashboardLayout>
    )
}
