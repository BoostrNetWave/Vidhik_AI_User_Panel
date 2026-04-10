import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, User, Target, Calendar, Gavel } from "lucide-react";

interface NDAFormProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (name: string, value: string) => void;
}

export const NDAForm: React.FC<NDAFormProps> = ({ formData, handleInputChange, handleSelectChange }) => {
    return (
        <div className="space-y-8 pt-6">
            {/* Agreement Type */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Agreement Style</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>NDA Type</Label>
                        <Select value={formData.ndaType} onValueChange={(val) => handleSelectChange('ndaType', val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Unilateral">Unilateral (One way)</SelectItem>
                                <SelectItem value="Mutual">Mutual (Both ways)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Purpose of Disclosure</Label>
                        <Input name="purpose" value={formData.purpose} onChange={handleInputChange} placeholder="e.g. Exploring a potential business partnership" />
                    </div>
                </div>
            </section>

            {/* Disclosing Party */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{formData.ndaType === 'Mutual' ? 'Party A' : 'Disclosing Party'}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Legal Name</Label>
                        <Input name="disclosingPartyName" value={formData.disclosingPartyName} onChange={handleInputChange} placeholder="Full legal name" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Registered Address</Label>
                        <Textarea
                            name="disclosingPartyAddress"
                            value={formData.disclosingPartyAddress}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="Full registered address"
                        />
                    </div>
                </div>
            </section>

            {/* Receiving Party */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{formData.ndaType === 'Mutual' ? 'Party B' : 'Receiving Party'}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Legal Name</Label>
                        <Input name="receivingPartyName" value={formData.receivingPartyName} onChange={handleInputChange} placeholder="Full legal name" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Registered Address</Label>
                        <Textarea
                            name="receivingPartyAddress"
                            value={formData.receivingPartyAddress}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="Full registered address"
                        />
                    </div>
                </div>
            </section>

            {/* Confidentiality Scope */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Confidentiality Scope</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Definition of Confidential Information</Label>
                        <Textarea
                            name="confidentialityScope"
                            value={formData.confidentialityScope}
                            onChange={handleInputChange}
                            className="min-h-[100px]"
                            placeholder="State what specific information should be protected (e.g. source code, financial projections, customer lists)"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Exceptions (Optional)</Label>
                        <Textarea
                            name="exceptions"
                            value={formData.exceptions}
                            onChange={handleInputChange}
                            className="min-h-[80px]"
                            placeholder="Standard exceptions apply (public domain, etc.). Add any specific exceptions here."
                        />
                    </div>
                </div>
            </section>

            {/* Duration */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Duration & Effective Date</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Effective Date</Label>
                        <Input name="effectiveDate" value={formData.effectiveDate} onChange={handleInputChange} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label>Confidentiality Duration</Label>
                        <Input name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 3 Years from date of disclosure" />
                    </div>
                </div>
            </section>

            {/* Remedies & Legal */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Gavel className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Legal Clauses</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Injunctive Relief?</Label>
                        <Select value={formData.injunctiveRelief} onValueChange={(val) => handleSelectChange('injunctiveRelief', val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes (Standard)</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Liquidated Damages (Optional)</Label>
                        <Input name="liquidatedDamages" value={formData.liquidatedDamages} onChange={handleInputChange} placeholder="e.g. ₹10,00,000 for any proven breach" />
                    </div>
                    <div className="space-y-2">
                        <Label>Governing Law</Label>
                        <Input name="governingLaw" value={formData.governingLaw} onChange={handleInputChange} placeholder="e.g. Laws of India" />
                    </div>
                    <div className="space-y-2">
                        <Label>Jurisdiction</Label>
                        <Input name="jurisdiction" value={formData.jurisdiction} onChange={handleInputChange} placeholder="e.g. Courts in Mumbai" />
                    </div>
                </div>
            </section>
        </div>
    );
};
