import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, FileText, IndianRupee, Gavel } from "lucide-react";

interface ServiceAgreementFormProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (name: string, value: string) => void;
}

export const ServiceAgreementForm: React.FC<ServiceAgreementFormProps> = ({ formData, handleInputChange, handleSelectChange }) => {
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
                        <Label>Service Provider Name</Label>
                        <Input name="providerName" value={formData.providerName} onChange={handleInputChange} placeholder="Full legal name" />
                    </div>
                    <div className="space-y-2">
                        <Label>Provider Type</Label>
                        <Select value={formData.providerType || 'Company'} onValueChange={(value) => handleSelectChange('providerType', value)}>
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
                        <Input name="providerAddress" value={formData.providerAddress} onChange={handleInputChange} placeholder="Registered office address" />
                    </div>
                    <div className="space-y-2">
                        <Label>Provider ID (CIN/GSTIN)</Label>
                        <Input name="providerID" value={formData.providerID} onChange={handleInputChange} placeholder="e.g. GSTIN 27AAAC..." />
                    </div>

                    <div className="md:col-span-2 pt-4 border-t"></div>

                    <div className="space-y-2">
                        <Label>Client Name</Label>
                        <Input name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Full legal name" />
                    </div>
                    <div className="space-y-2">
                        <Label>Client Type</Label>
                        <Select value={formData.clientType || 'Company'} onValueChange={(value) => handleSelectChange('clientType', value)}>
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
                        <Input name="clientAddress" value={formData.clientAddress} onChange={handleInputChange} placeholder="Business address" />
                    </div>
                </div>
            </section>

            {/* Scope of Work */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Engagement Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Effective Date</Label>
                        <Input name="effectiveDate" value={formData.effectiveDate} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label>Expiry Date (if any)</Label>
                        <Input name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Description of Services</Label>
                        <Input name="servicesDescription" value={formData.servicesDescription} onChange={handleInputChange} placeholder="e.g. Software Development, Marketing Services, etc." />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Key Milestones (Optional)</Label>
                        <Input name="milestones" value={formData.milestones} onChange={handleInputChange} placeholder="e.g. UI/UX Design (Month 1), Beta Release (Month 3)" />
                    </div>
                </div>
            </section>

            {/* Commercials */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Commercial Terms</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Service Fees (Including Currency)</Label>
                        <Input name="fees" value={formData.fees} onChange={handleInputChange} placeholder="e.g. INR 50,000 / Month" />
                    </div>
                    <div className="space-y-2">
                        <Label>Payment Terms</Label>
                        <Input name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange} placeholder="e.g. Net 15 days from invoice" />
                    </div>
                    <div className="space-y-2">
                        <Label>IP Ownership of Deliverables</Label>
                        <Select value={formData.ipOwnership || 'Client'} onValueChange={(value) => handleSelectChange('ipOwnership', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Who owns the IP?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Client">Client Owns</SelectItem>
                                <SelectItem value="Provider">Provider Owns (Licensed to Client)</SelectItem>
                                <SelectItem value="Joint">Joint Ownership</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Termination Notice Period</Label>
                        <Input name="terminationNotice" value={formData.terminationNotice} onChange={handleInputChange} placeholder="e.g. 30 Days" />
                    </div>
                </div>
            </section>

            {/* Legal */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Gavel className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Governing Law & Jurisdiction</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Governing Law</Label>
                        <Input name="governingLaw" value={formData.governingLaw} onChange={handleInputChange} placeholder="e.g. India" />
                    </div>
                    <div className="space-y-2">
                        <Label>Jurisdiction (City)</Label>
                        <Input name="jurisdiction" value={formData.jurisdiction} onChange={handleInputChange} placeholder="e.g. Mumbai, Maharashtra" />
                    </div>
                </div>
            </section>
        </div>
    );
};
