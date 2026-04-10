import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Calendar, ClipboardCheck, Scale } from "lucide-react";

interface MSAFormProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (name: string, value: string) => void;
}

export const MSAForm: React.FC<MSAFormProps> = ({ formData, handleInputChange, handleSelectChange }) => {
    return (
        <div className="space-y-8 pt-6">
            {/* Parties Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Parties Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Service Provider (Party A)</Label>
                        <Input name="partyAName" value={formData.partyAName} onChange={handleInputChange} placeholder="Full legal name" />
                    </div>
                    <div className="space-y-2">
                        <Label>Provider Type</Label>
                        <Select value={formData.partyAType || 'Company'} onValueChange={(value) => handleSelectChange('partyAType', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Company">Private Limited Company</SelectItem>
                                <SelectItem value="LLP">LLP</SelectItem>
                                <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Provider Address</Label>
                        <Input name="partyAAddress" value={formData.partyAAddress} onChange={handleInputChange} placeholder="Registered office address" />
                    </div>
                    <div className="space-y-2">
                        <Label>Provider CIN/GSTIN</Label>
                        <Input name="partyAID" value={formData.partyAID} onChange={handleInputChange} placeholder="e.g. U72900..." />
                    </div>

                    <div className="md:col-span-2 pt-4 border-t"></div>

                    <div className="space-y-2">
                        <Label>Client (Party B)</Label>
                        <Input name="partyBName" value={formData.partyBName} onChange={handleInputChange} placeholder="Full legal name" />
                    </div>
                    <div className="space-y-2">
                        <Label>Client Type</Label>
                        <Select value={formData.partyBType || 'Company'} onValueChange={(value) => handleSelectChange('partyBType', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Company">Private Limited Company</SelectItem>
                                <SelectItem value="LLP">LLP</SelectItem>
                                <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Client Address</Label>
                        <Input name="partyBAddress" value={formData.partyBAddress} onChange={handleInputChange} placeholder="Business address" />
                    </div>
                </div>
            </section>

            {/* Framework Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Framework Term & Scope</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Effective Date</Label>
                        <Input name="effectiveDate" value={formData.effectiveDate} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label>Initial Term</Label>
                        <Input name="initialTerm" value={formData.initialTerm} onChange={handleInputChange} placeholder="e.g. 3 Years" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Service Categories</Label>
                        <Input name="serviceCategories" value={formData.serviceCategories} onChange={handleInputChange} placeholder="e.g. Professional Consulting, Managed IT Services" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>SOW Mechanism</Label>
                        <Input name="sowMechanism" value={formData.sowMechanism} onChange={handleInputChange} placeholder="e.g. Mutually agreed Statements of Work" />
                    </div>
                </div>
            </section>

            {/* Commercials & Liability */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Commercial Framework</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Standard Billing Cycle</Label>
                        <Input name="billingCycle" value={formData.billingCycle} onChange={handleInputChange} placeholder="e.g. Monthly" />
                    </div>
                    <div className="space-y-2">
                        <Label>Late Payment Interest</Label>
                        <Input name="lateInterestRate" value={formData.lateInterestRate} onChange={handleInputChange} placeholder="e.g. 1.5% per month" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Liability Cap</Label>
                        <Input name="liabilityCap" value={formData.liabilityCap} onChange={handleInputChange} placeholder="e.g. 100% of fees paid in last 12 months" />
                    </div>
                    <div className="space-y-2">
                        <Label>Termination Notice</Label>
                        <Input name="terminationNotice" value={formData.terminationNotice} onChange={handleInputChange} placeholder="e.g. 60 Days" />
                    </div>
                    <div className="space-y-2">
                        <Label>Non-Solicitation Period</Label>
                        <Input name="nonSolicitationPeriod" value={formData.nonSolicitationPeriod} onChange={handleInputChange} placeholder="e.g. 1 Year post termination" />
                    </div>
                </div>
            </section>

            {/* Legal */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Scale className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Governing Law</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Governing Law</Label>
                        <Input name="governingLaw" value={formData.governingLaw} onChange={handleInputChange} placeholder="e.g. India" />
                    </div>
                    <div className="space-y-2">
                        <Label>Jurisdiction (City)</Label>
                        <Input name="jurisdiction" value={formData.jurisdiction} onChange={handleInputChange} placeholder="e.g. Bangalore, Karnataka" />
                    </div>
                </div>
            </section>
        </div>
    );
};
