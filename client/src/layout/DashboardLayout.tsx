import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Mail, Settings, LayoutDashboard, FileText, CheckSquare, Folder, MessageSquare, ChevronLeft, ChevronRight, Users, CreditCard, Briefcase } from "lucide-react"
import { useLocation, useNavigate } from 'react-router-dom';
import { Notifications } from "@/components/dashboard/Notifications"
import { DashboardSearch } from "@/components/dashboard/DashboardSearch"
import { Logo } from '@/components/brand/Logo';

interface DashboardLayoutProps {
    children: React.ReactNode;
    userNav: React.ReactNode;
}

export default function DashboardLayout({ children, userNav }: DashboardLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        document.title = "Vidhik AI - Client Dashboard";
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex min-h-screen bg-secondary/30 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-white border-r flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <div className={`h-24 flex items-center border-b border-slate-200 relative ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
                    <Logo isCollapsed={isCollapsed} className="h-20 w-full" />

                    {/* Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 transition-all focus:outline-none z-50 sm:flex hidden"
                    >
                        {isCollapsed ? <ChevronRight className="h-3 w-3 text-slate-600" /> : <ChevronLeft className="h-3 w-3 text-slate-600" />}
                    </button>
                </div>

                <div className="flex-1 py-6 space-y-1 overflow-y-auto px-3">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/dashboard'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? "Dashboard" : ""}
                        onClick={() => navigate('/dashboard')}
                    >
                        <LayoutDashboard className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">Dashboard</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/document-generator'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? "AI Document Generator" : ""}
                        onClick={() => navigate('/document-generator')}
                    >
                        <FileText className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">AI Document Generator</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/documents/review'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? "Document Review" : ""}
                        onClick={() => navigate('/documents/review')}
                    >
                        <CheckSquare className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">Document Review</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/documents/workspace'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? "My Documents" : ""}
                        onClick={() => navigate('/documents/workspace')}
                    >
                        <Folder className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">My Documents</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/research'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? "Ask Legal Question" : ""}
                        onClick={() => navigate('/research')}
                    >
                        <MessageSquare className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">Ask Legal Question</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/lawyers'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? "Lawyer List" : ""}
                        onClick={() => navigate('/lawyers')}
                    >
                        <Users className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">Lawyer List</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/cases'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? "Case Management" : ""}
                        onClick={() => navigate('/cases')}
                    >
                        <Briefcase className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">Case Management</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/billing'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? "Billing & Plans" : ""}
                        onClick={() => navigate('/billing')}
                    >
                        <CreditCard className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">Billing & Plans</span>}
                    </Button>

                    <div className="pt-4 mt-4 border-t border-slate-200">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start gap-3 h-10 px-3 rounded-md transition-colors ${location.pathname === '/settings'
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                            title={isCollapsed ? "Settings" : ""}
                            onClick={() => navigate('/settings')}
                        >
                            <Settings className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`flex flex-col w-full transition-all duration-300 ease-in-out ${isCollapsed ? 'pl-20' : 'pl-64'
                    }`}
            >
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="relative w-full max-w-md">
                        <DashboardSearch />
                    </div>

                    <div className="flex items-center gap-4">
                        <Notifications />
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100 h-9 w-9">
                            <Mail className="h-5 w-5" />
                        </Button>
                        <div className="h-6 w-px bg-slate-200 mx-1" />
                        <div className="flex items-center gap-3">
                            {!isCollapsed && (
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-900 leading-none">
                                        {JSON.parse(localStorage.getItem('user_profile_data') || '{}').fullName || 'User'}
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                                        {JSON.parse(localStorage.getItem('user_profile_data') || '{}').designation || 'Legal Member'}
                                    </p>
                                </div>
                            )}
                            {userNav}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 bg-secondary/30">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
