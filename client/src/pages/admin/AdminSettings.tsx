import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from "@/layout/AdminLayout";
import { UserNav } from "@/components/dashboard/UserNav";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { 
    ShieldAlert, 
    Users, 
    Save, 
    RefreshCcw,
    Info,
    CheckCircle,
    Gavel,
    Activity,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Briefcase,
    Coins,
    FileText,
    ExternalLink
} from "lucide-react";

export default function AdminSettings() {
    const { tab } = useParams();
    const [configs, setConfigs] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [pendingLawyers, setPendingLawyers] = useState<any[]>([]);
    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // JSON editing state
    const [editingJsonConfig, setEditingJsonConfig] = useState<{[key: string]: any}>({});

    const updateArrayField = (key: string, index: number, field: string, value: any) => {
        setEditingJsonConfig(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            if (copy[key] && copy[key][index] !== undefined) {
                copy[key][index][field] = value;
            }
            return copy;
        });
    };

    const addArrayItem = (key: string, defaultItem: any) => {
        setEditingJsonConfig(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            if (!copy[key]) {
                copy[key] = [];
            }
            copy[key].push(defaultItem);
            return copy;
        });
    };

    const deleteArrayItem = (key: string, index: number) => {
        setEditingJsonConfig(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            if (copy[key]) {
                copy[key].splice(index, 1);
            }
            return copy;
        });
    };

    const moveArrayItem = (key: string, index: number, direction: 'up' | 'down') => {
        setEditingJsonConfig(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            const arr = copy[key];
            if (!arr) return prev;
            
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex >= 0 && targetIndex < arr.length) {
                const temp = arr[index];
                arr[index] = arr[targetIndex];
                arr[targetIndex] = temp;
            }
            return copy;
        });
    };
    
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
                
                // Initialize JSON configs in local state
                const jsonConfigs: {[key: string]: any} = {};
                configData.forEach((c: any) => {
                    if (typeof c.value === 'object' && c.value !== null) {
                        jsonConfigs[c.key] = JSON.parse(JSON.stringify(c.value));
                    }
                });
                setEditingJsonConfig(jsonConfigs);
            }
            
            if (activeTab === 'users' || activeTab === 'overview') {
                const userData = await adminService.getAllUsers();
                setUsers(userData);
            }

            if (activeTab === 'lawyers' || activeTab === 'overview') {
                const pendingData = await adminService.getPendingLawyers();
                setPendingLawyers(pendingData);
            }

            if (activeTab === 'cases' || activeTab === 'overview') {
                const casesData = await adminService.getAllCases();
                setCases(casesData);
            }
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (key: string, value: any) => {
        try {
            const originalConfig = configs.find(c => c.key === key);
            let parsedValue = value;
            if (originalConfig && typeof originalConfig.value === 'number') {
                parsedValue = Number(value);
                if (isNaN(parsedValue)) {
                    toast.error("Value must be a valid number");
                    return;
                }
            }
            await adminService.updateConfig(key, parsedValue);
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

    const renderStepsEditor = (key: string) => {
        const steps = editingJsonConfig[key] || [];
        return (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Steps List</span>
                    <button 
                        onClick={() => addArrayItem(key, { num: "0" + (steps.length + 1), title: "New Step", desc: "Step description", iconName: "Zap" })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Step
                    </button>
                </div>
                
                {steps.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No steps defined. Add some steps above.</p>
                ) : (
                    <div className="space-y-3">
                        {steps.map((step: any, index: number) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 items-start">
                                <div className="flex gap-2 items-center sm:self-center">
                                    <button 
                                        disabled={index === 0}
                                        onClick={() => moveArrayItem(key, index, 'up')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors animate-pulse-subtle"
                                    >
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                        disabled={index === steps.length - 1}
                                        onClick={() => moveArrayItem(key, index, 'down')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-12 gap-3 flex-1 w-full">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">No.</label>
                                        <input 
                                            type="text" 
                                            value={step.num || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'num', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-medium"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon (Lucide)</label>
                                        <input 
                                            type="text" 
                                            value={step.iconName || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'iconName', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-7">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
                                        <input 
                                            type="text" 
                                            value={step.title || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'title', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-semibold"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                                        <textarea 
                                            value={step.desc || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'desc', e.target.value)}
                                            rows={2}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => deleteArrayItem(key, index)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:self-center transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderFeaturesEditor = (key: string) => {
        const features = editingJsonConfig[key] || [];
        return (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Features List</span>
                    <button 
                        onClick={() => addArrayItem(key, { iconName: "Sparkles", title: "New Feature", desc: "Feature description", color: "from-purple-500/20 to-violet-500/20" })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Feature
                    </button>
                </div>
                
                {features.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No features defined. Add some features above.</p>
                ) : (
                    <div className="space-y-3">
                        {features.map((feature: any, index: number) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 items-start">
                                <div className="flex gap-2 items-center sm:self-center">
                                    <button 
                                        disabled={index === 0}
                                        onClick={() => moveArrayItem(key, index, 'up')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                        disabled={index === features.length - 1}
                                        onClick={() => moveArrayItem(key, index, 'down')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-12 gap-3 flex-1 w-full">
                                    <div className="col-span-4">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
                                        <input 
                                            type="text" 
                                            value={feature.title || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'title', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-semibold"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon (Lucide)</label>
                                        <input 
                                            type="text" 
                                            value={feature.iconName || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'iconName', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Color Gradient (Tailwind)</label>
                                        <input 
                                            type="text" 
                                            value={feature.color || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'color', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                                        <textarea 
                                            value={feature.desc || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'desc', e.target.value)}
                                            rows={2}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => deleteArrayItem(key, index)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:self-center transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderPricingEditor = (key: string) => {
        const plans = editingJsonConfig[key] || [];
        return (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pricing Plans</span>
                    <button 
                        onClick={() => addArrayItem(key, { name: "New Plan", priceMonthly: 19, priceYearly: 190, desc: "Plan description", features: ["Feature 1"], gradient: "from-purple-500 to-indigo-600", popular: false, iconName: "Zap" })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Plan
                    </button>
                </div>
                
                {plans.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No plans defined. Add some pricing plans above.</p>
                ) : (
                    <div className="space-y-3">
                        {plans.map((plan: any, index: number) => {
                            const featuresText = (plan.features || []).join('\n');
                            return (
                                <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 items-start">
                                    <div className="flex gap-2 items-center sm:self-center">
                                        <button 
                                            disabled={index === 0}
                                            onClick={() => moveArrayItem(key, index, 'up')}
                                            className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                        >
                                            <ChevronUp className="h-3.5 w-3.5" />
                                        </button>
                                        <button 
                                            disabled={index === plans.length - 1}
                                            onClick={() => moveArrayItem(key, index, 'down')}
                                            className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                        >
                                            <ChevronDown className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-12 gap-3 flex-1 w-full">
                                        <div className="col-span-4">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Plan Name</label>
                                            <input 
                                                type="text" 
                                                value={plan.name || ''} 
                                                onChange={(e) => updateArrayField(key, index, 'name', e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-semibold"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Monthly Price ($)</label>
                                            <input 
                                                type="number" 
                                                value={plan.priceMonthly !== undefined ? plan.priceMonthly : ''} 
                                                onChange={(e) => updateArrayField(key, index, 'priceMonthly', Number(e.target.value))}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Yearly Price ($)</label>
                                            <input 
                                                type="number" 
                                                value={plan.priceYearly !== undefined ? plan.priceYearly : ''} 
                                                onChange={(e) => updateArrayField(key, index, 'priceYearly', Number(e.target.value))}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon (Lucide)</label>
                                            <input 
                                                type="text" 
                                                value={plan.iconName || ''} 
                                                onChange={(e) => updateArrayField(key, index, 'iconName', e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                            />
                                        </div>
                                        <div className="col-span-2 flex items-center pt-5">
                                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-600">
                                                <input 
                                                    type="checkbox" 
                                                    checked={plan.popular || false} 
                                                    onChange={(e) => updateArrayField(key, index, 'popular', e.target.checked)}
                                                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                                                />
                                                Popular
                                            </label>
                                        </div>
                                        <div className="col-span-6">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                                            <input 
                                                type="text" 
                                                value={plan.desc || ''} 
                                                onChange={(e) => updateArrayField(key, index, 'desc', e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                            />
                                        </div>
                                        <div className="col-span-6">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gradient Class (Tailwind)</label>
                                            <input 
                                                type="text" 
                                                value={plan.gradient || ''} 
                                                onChange={(e) => updateArrayField(key, index, 'gradient', e.target.value)}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                            />
                                        </div>
                                        <div className="col-span-12">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Features (one per line)</label>
                                            <textarea 
                                                value={featuresText} 
                                                onChange={(e) => {
                                                    const lines = e.target.value.split('\n').map(l => l.trim()).filter(l => l !== '');
                                                    updateArrayField(key, index, 'features', lines);
                                                }}
                                                rows={4}
                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                            />
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => deleteArrayItem(key, index)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:self-center transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    const renderContactEditor = (key: string) => {
        const cards = editingJsonConfig[key] || [];
        return (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info Cards</span>
                    <button 
                        onClick={() => addArrayItem(key, { iconName: "Mail", title: "New Info", detail: "info@example.com", desc: "Description", color: "from-blue-500 to-indigo-600" })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Info Card
                    </button>
                </div>
                
                {cards.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No contact info cards defined. Add some cards above.</p>
                ) : (
                    <div className="space-y-3">
                        {cards.map((card: any, index: number) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 items-start">
                                <div className="flex gap-2 items-center sm:self-center">
                                    <button 
                                        disabled={index === 0}
                                        onClick={() => moveArrayItem(key, index, 'up')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                        disabled={index === cards.length - 1}
                                        onClick={() => moveArrayItem(key, index, 'down')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-12 gap-3 flex-1 w-full">
                                    <div className="col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Title</label>
                                        <input 
                                            type="text" 
                                            value={card.title || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'title', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white font-semibold"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Icon (Lucide)</label>
                                        <input 
                                            type="text" 
                                            value={card.iconName || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'iconName', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Details</label>
                                        <input 
                                            type="text" 
                                            value={card.detail || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'detail', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Color Gradient (Tailwind)</label>
                                        <input 
                                            type="text" 
                                            value={card.color || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'color', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Description</label>
                                        <textarea 
                                            value={card.desc || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'desc', e.target.value)}
                                            rows={2}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => deleteArrayItem(key, index)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:self-center transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderFaqsEditor = (key: string) => {
        const faqs = editingJsonConfig[key] || [];
        return (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">FAQs List</span>
                    <button 
                        onClick={() => addArrayItem(key, { q: "New Question?", a: "Answer details." })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add FAQ
                    </button>
                </div>
                
                {faqs.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No FAQs defined. Add some FAQs above.</p>
                ) : (
                    <div className="space-y-3">
                        {faqs.map((faq: any, index: number) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 items-start">
                                <div className="flex gap-2 items-center sm:self-center">
                                    <button 
                                        disabled={index === 0}
                                        onClick={() => moveArrayItem(key, index, 'up')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                        disabled={index === faqs.length - 1}
                                        onClick={() => moveArrayItem(key, index, 'down')}
                                        className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors"
                                    >
                                        <ChevronDown className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-12 gap-3 flex-1 w-full">
                                    <div className="col-span-12">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Question</label>
                                        <input 
                                            type="text" 
                                            value={faq.q || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'q', e.target.value)}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Answer</label>
                                        <textarea 
                                            value={faq.a || ''} 
                                            onChange={(e) => updateArrayField(key, index, 'a', e.target.value)}
                                            rows={3}
                                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => deleteArrayItem(key, index)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg sm:self-center transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderContentSettings = () => {
        const filteredConfigs = configs.filter(c => 
            activeTab === 'content' ? (c.category === 'landing' || c.category === 'user_panel') :
            activeTab === 'payments' ? c.category === 'payments' :
            c.category === 'system'
        );

        return (
            <div className="grid gap-6">
                {filteredConfigs.map((config) => {
                    const isJson = typeof config.value === 'object' && config.value !== null;
                    const isImageKey = config.key === 'LANDING_LOGO_URL' || config.key === 'LANDING_HERO_IMAGE';
                    const isLongText = config.key === 'LANDING_HERO_SUBTITLE';

                    return (
                        <div key={config._id} className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4 ${isJson ? 'items-stretch' : 'md:flex-row md:items-center justify-between'}`}>
                            <div className="space-y-1 flex-1">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    {config.key.replace(/_/g, ' ')}
                                    <Info className="h-3.5 w-3.5 text-slate-400" />
                                </h3>
                                <p className="text-sm text-slate-500">{config.description}</p>
                            </div>

                            {isJson ? (
                                <div className="w-full flex flex-col">
                                    {config.key === 'LANDING_HOW_IT_WORKS_STEPS' && renderStepsEditor(config.key)}
                                    {config.key === 'LANDING_FEATURES' && renderFeaturesEditor(config.key)}
                                    {config.key === 'LANDING_PRICING_PLANS' && renderPricingEditor(config.key)}
                                    {config.key === 'LANDING_CONTACT_INFO' && renderContactEditor(config.key)}
                                    {config.key === 'LANDING_FAQS' && renderFaqsEditor(config.key)}
                                    
                                    <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
                                        <button 
                                            onClick={() => handleUpdate(config.key, editingJsonConfig[config.key])}
                                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm"
                                        >
                                            <Save className="h-4 w-4" />
                                            Save {config.key.replace(/_/g, ' ').toLowerCase()} Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-4 items-center">
                                    {isImageKey && config.value && (
                                        <div className="h-10 w-10 rounded border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                                            <img src={config.value} alt="Preview" className="max-h-full max-w-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                                        </div>
                                    )}

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
                                        <div className="flex gap-2 items-start w-full md:w-auto">
                                            {isLongText ? (
                                                <textarea
                                                    defaultValue={config.value}
                                                    id={`input-${config.key}`}
                                                    rows={3}
                                                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-64 md:w-96 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                />
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    defaultValue={config.value}
                                                    id={`input-${config.key}`}
                                                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-64 md:w-80 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                                />
                                            )}
                                            <button 
                                                onClick={() => {
                                                    const val = (document.getElementById(`input-${config.key}`) as HTMLInputElement | HTMLTextAreaElement).value;
                                                    handleUpdate(config.key, val);
                                                }}
                                                className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                                            >
                                                <Save className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const handleApprovePayout = async (caseId: string, index: number) => {
        try {
            await adminService.approvePayout(caseId, index);
            toast.success("Payout approved and released successfully!");
            fetchData();
        } catch (error) {
            toast.error("Failed to approve payout");
        }
    };

    const handleRejectPayout = async (caseId: string, index: number) => {
        try {
            await adminService.rejectPayout(caseId, index);
            toast.success("Payout request rejected");
            fetchData();
        } catch (error) {
            toast.error("Failed to reject payout");
        }
    };

    const renderCasesAndPayouts = () => {
        // Extract all pending payout requests
        const payoutRequests: any[] = [];
        let totalPaidOut = 0;
        
        cases.forEach(c => {
            c.milestones.forEach((m: any, mIdx: number) => {
                if (m.payoutStatus === 'requested') {
                    payoutRequests.push({
                        caseId: c._id,
                        caseTitle: c.title,
                        clientName: c.client?.fullName || 'Client',
                        lawyerId: c.lawyer?._id,
                        lawyerName: c.lawyer?.fullName || 'Lawyer',
                        bankName: c.lawyer?.bankName || 'Not Provided',
                        accountNumber: c.lawyer?.accountNumber || 'Not Provided',
                        ifsc: c.lawyer?.ifsc || 'Not Provided',
                        milestoneTitle: m.title,
                        milestoneIndex: mIdx,
                        amount: m.payoutAmount,
                        proofDocs: m.proofDocs || []
                    });
                }
                if (m.payoutStatus === 'approved') {
                    totalPaidOut += m.payoutAmount;
                }
            });
        });

        const activeCasesCount = cases.filter(c => c.status === 'active').length;

        return (
            <div className="space-y-8">
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Active Cases</p>
                                <h3 className="text-2xl font-bold text-slate-900">{activeCasesCount} / {cases.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                                <Coins className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Payout Requests</p>
                                <h3 className="text-2xl font-bold text-slate-900">{payoutRequests.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                                <Coins className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Total Paid Out</p>
                                <h3 className="text-2xl font-bold text-emerald-600">₹{totalPaidOut.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payout requests list */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-900">Pending Milestone Payout Requests</h3>
                        <p className="text-sm text-slate-500">Verify uploaded proof documents and lawyer bank details before releasing funds.</p>
                    </div>

                    {payoutRequests.length === 0 ? (
                        <div className="p-12 text-center">
                            <CheckCircle className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No pending payout requests.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Case / Milestone</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Lawyer & Payout details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Verification Documents</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payoutRequests.map((req, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 text-sm">{req.caseTitle}</div>
                                            <div className="text-xs text-slate-500 mt-1">Milestone: <span className="font-semibold">{req.milestoneTitle}</span></div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Client: {req.clientName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900 text-sm">{req.lawyerName}</div>
                                            <div className="text-[11px] text-slate-500 mt-1 font-mono">
                                                Bank: {req.bankName} • A/C: {req.accountNumber} • IFSC: {req.ifsc}
                                            </div>
                                            <div className="text-xs font-bold text-primary mt-1.5 flex items-center gap-1">
                                                <Coins className="h-3.5 w-3.5" />
                                                Payout Amount: ₹{req.amount.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.proofDocs.length === 0 ? (
                                                <span className="text-xs text-red-500 font-bold">No Proof Uploaded</span>
                                            ) : (
                                                <div className="space-y-2">
                                                    {req.proofDocs.map((doc: any, dIdx: number) => {
                                                        const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.url);
                                                        return (
                                                            <div key={dIdx} className="space-y-1">
                                                                <a
                                                                                                    href={`http://localhost:3000/lawyer${doc.url}`}
                                                                                                    target="_blank"
                                                                                                    rel="noreferrer"
                                                                                                    className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1.5"
                                                                                                >
                                                                                                    <FileText className="h-3.5 w-3.5 shrink-0" />
                                                                                                    <span className="truncate max-w-[120px]">{doc.name}</span>
                                                                                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                                                                                </a>
                                                                {isImg && (
                                                                    <div className="mt-1 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 w-24 h-16 shadow-sm relative group">
                                                                        <img 
                                                                            src={`http://localhost:3000/lawyer${doc.url}`} 
                                                                            alt={doc.name}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                            <a 
                                                                                href={`http://localhost:3000/lawyer${doc.url}`}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="text-[8px] bg-white text-slate-900 px-1 py-0.5 rounded shadow-sm font-bold"
                                                                            >
                                                                                View
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprovePayout(req.caseId, req.milestoneIndex)}
                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    Approve Payout
                                                </button>
                                                <button
                                                    onClick={() => handleRejectPayout(req.caseId, req.milestoneIndex)}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg text-xs font-bold transition-all"
                                                >
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

                {/* Master cases list */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-900">Cases Registry</h3>
                        <p className="text-sm text-slate-500">Track the overall progress and roadmap stats for all active engagements.</p>
                    </div>

                    {cases.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">No cases recorded yet.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Case Title</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Lawyer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Verification Progress</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Meeting Summary</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Fee</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cases.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 text-sm">{c.title}</div>
                                            <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Status: {c.status}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{c.client?.fullName || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{c.lawyer?.fullName || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 w-40">
                                                <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${c.currentProgress}%` }} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700 shrink-0">{c.currentProgress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.meetingSummaryUrl ? (
                                                <a 
                                                    href={`http://localhost:3000/lawyer${c.meetingSummaryUrl}`}
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-bold hover:underline"
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    <span>View Summary</span>
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium">Pending Call</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900 text-sm">
                                            ₹{c.totalFee.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
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
            case 'cases': return renderCasesAndPayouts();
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
