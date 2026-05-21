import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from "@/layout/AdminLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { 
    Settings, 
    Globe, 
    CreditCard, 
    ShieldAlert, 
    Users, 
    Save, 
    RefreshCcw,
    Info,
    CheckCircle,
    XCircle,
    Gavel,
    Activity
} from "lucide-react";

export default function AdminSettings() {
    const { tab } = useParams();
    const navigate = useNavigate();
    const [configs, setConfigs] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [pendingLawyers, setPendingLawyers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Map URL tab to internal tab state
    const activeTab = tab || 'overview';

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'content' || activeTab === 'payments' || activeTab === 'system' || activeTab === 'overview') {
                const configData = await adminService.getConfigs();
                setConfigs(configData);
            }
            
            if (activeTab === 'users' || activeTab === 'overview') {
                const userData = await adminService.getAllUsers();
                setUsers(userData);
            }

            if (activeTab === 'lawyers' || activeTab === 'overview') {
                const pendingData = await adminService.getPendingLawyers();
                setPendingLawyers(pendingData);
            }
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (key: string, value: any) => {
        try {
            await adminService.updateConfig(key, value);
            toast.success("Updated successfully");
            fetchData();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await adminService.approveLawyer(id);
            toast.success("Lawyer approved successfully!");
            fetchData();
        } catch (error) {
            toast.error("Approval failed");
        }
    };

    const renderOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Total Users</p>
                        <h3 className="text-2xl font-bold text-slate-900">{users.length}</h3>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                        <Gavel className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Pending Approvals</p>
                        <h3 className="text-2xl font-bold text-slate-900">{pendingLawyers.length}</h3>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                        <Activity className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">System Status</p>
                        <h3 className="text-2xl font-bold text-emerald-600">Healthy</h3>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLawyerApproval = () => (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900">Pending Lawyer Approvals</h3>
                <p className="text-sm text-slate-500">Review and approve new lawyer registrations.</p>
            </div>
            {pendingLawyers.length === 0 ? (
                <div className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No pending approvals at the moment.</p>
                </div>
            ) : (
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Lawyer Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Specialization</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pendingLawyers.map((lawyer) => (
                            <tr key={lawyer._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{lawyer.fullName}</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-tighter">New Registration</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{lawyer.expertise || "General Practice"}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{lawyer.email}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleApprove(lawyer._id)}
                                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                                        >
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            Approve
                                        </button>
                                        <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors">
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    const renderUserManagement = () => (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900">Master User List</h3>
                <p className="text-sm text-slate-500">View and manage all accounts on the platform.</p>
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">User</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Join Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{user.fullName}</div>
                                <div className="text-xs text-slate-400">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                    user.role === 'lawyer' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {user.role === 'lawyer' ? (
                                    <div className="space-y-1">
                                        <span className={`flex items-center gap-1.5 text-xs font-medium ${user.isApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            {user.isApproved ? 'Approved' : 'Pending Approval'}
                                        </span>
                                        {!user.isVerified && (
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        await adminService.verifyUser(user._id);
                                                        toast.success("User verified manually");
                                                        fetchData();
                                                    } catch (e) { toast.error("Verification failed"); }
                                                }}
                                                className="text-[10px] text-blue-600 font-bold hover:underline"
                                            >
                                                Verify Manually
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Active
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 text-right">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderContentSettings = () => {
        const filteredConfigs = configs.filter(c => 
            activeTab === 'content' ? (c.category === 'landing' || c.category === 'user_panel') :
            activeTab === 'payments' ? c.category === 'payments' :
            c.category === 'system'
        );

        return (
            <div className="grid gap-6">
                {filteredConfigs.map((config) => (
                    <div key={config._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                {config.key.replace(/_/g, ' ')}
                                <Info className="h-3.5 w-3.5 text-slate-400" />
                            </h3>
                            <p className="text-sm text-slate-500">{config.description}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            {typeof config.value === 'boolean' ? (
                                <button 
                                    onClick={() => handleUpdate(config.key, !config.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        config.value ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                    }`}
                                >
                                    {config.value ? 'Turn OFF' : 'Turn ON'}
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        defaultValue={config.value}
                                        id={`input-${config.key}`}
                                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    />
                                    <button 
                                        onClick={() => {
                                            const val = (document.getElementById(`input-${config.key}`) as HTMLInputElement).value;
                                            handleUpdate(config.key, val);
                                        }}
                                        className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
                                    >
                                        <Save className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderContent = () => {
        if (loading) return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <RefreshCcw className="h-8 w-8 text-purple-300 animate-spin" />
                <p className="text-slate-400 font-medium">Syncing with Central Database...</p>
            </div>
        );

        switch(activeTab) {
            case 'overview': return renderOverview();
            case 'lawyers': return renderLawyerApproval();
            case 'users': return renderUserManagement();
            case 'content': 
            case 'payments':
            case 'system': return renderContentSettings();
            default: return renderOverview();
        }
    };

    return (
        <AdminLayout userNav={<UserNav />}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <ShieldAlert className="h-8 w-8 text-purple-600" />
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {activeTab === 'overview' ? 'Global overview of the Vidhik AI ecosystem.' : 
                         activeTab === 'lawyers' ? 'Manage and verify lawyer credentials for the platform.' :
                         'Modify system settings and configurations.'}
                    </p>
                </div>
                <button 
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Sync Data
                </button>
            </div>

            <div className="space-y-8">
                {renderContent()}
            </div>
        </AdminLayout>
    );
}
