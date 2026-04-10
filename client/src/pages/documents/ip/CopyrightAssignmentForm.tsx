import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, FileText, Globe } from "lucide-react";

interface CopyrightAssignmentFormProps {
    formData: any;
    handleInputChange: (e: any) => void;
    handleSelectChange: (name: string, value: string) => void;
}

export const CopyrightAssignmentForm: React.FC<CopyrightAssignmentFormProps> = ({ formData, handleInputChange, handleSelectChange }) => {
    return (
        <div className="space-y-8 pt-6">
            {/* Assignor & Assignee Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Parties Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Assignor (Transferor) Name</Label>
                        <Input name="assignorName" value={formData.assignorName} onChange={handleInputChange} placeholder="Who owns the copyright?" />
                    </div>
                    <div className="space-y-2">
                        <Label>Assignor Type</Label>
                        <Select value={formData.assignorType || 'Individual'} onValueChange={(value) => handleSelectChange('assignorType', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Individual">Individual</SelectItem>
                                <SelectItem value="Company">Company</SelectItem>
                                <SelectItem value="Firm">Partnership Firm / LLP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Assignor Address</Label>
                        <Input name="assignorAddress" value={formData.assignorAddress} onChange={handleInputChange} placeholder="Complete address of the Assignor" />
                    </div>
                    <div className="space-y-2 border-t pt-4 md:col-span-2"></div>
                    <div className="space-y-2">
                        <Label>Assignee (Transferee) Name</Label>
                        <Input name="assigneeName" value={formData.assigneeName} onChange={handleInputChange} placeholder="Who is receiving the copyright?" />
                    </div>
                    <div className="space-y-2">
                        <Label>Assignee Type</Label>
                        <Select value={formData.assigneeType || 'Company'} onValueChange={(value) => handleSelectChange('assigneeType', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Individual">Individual</SelectItem>
                                <SelectItem value="Company">Company</SelectItem>
                                <SelectItem value="Firm">Partnership Firm / LLP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Assignee Address</Label>
                        <Input name="assigneeAddress" value={formData.assigneeAddress} onChange={handleInputChange} placeholder="Complete address of the Assignee" />
                    </div>
                </div>
            </section>

            {/* Work Details */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Work/Content Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Work Title</Label>
                        <Input name="workTitle" value={formData.workTitle} onChange={handleInputChange} placeholder="e.g. 'Project Alpha Source Code', 'Marketing Graphics 2024'" />
                    </div>
                    <div className="space-y-2">
                        <Label>Work Type</Label>
                        <Select value={formData.workType || 'Literary'} onValueChange={(value) => handleSelectChange('workType', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select work category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Literary">Literary (Books, Software Code, Articles)</SelectItem>
                                <SelectItem value="Artistic">Artistic (Graphics, Logos, Design)</SelectItem>
                                <SelectItem value="Musical">Musical (Compositions)</SelectItem>
                                <SelectItem value="Software/Code">Software / Computer Code</SelectItem>
                                <SelectItem value="Cinematograph Film">Cinematograph Film / Video</SelectItem>
                                <SelectItem value="Sound Recording">Sound Recording</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label>Detailed Work Description</Label>
                        <Input name="workDescription" value={formData.workDescription} onChange={handleInputChange} placeholder="Describe the specific work being assigned" />
                    </div>
                    <div className="space-y-2">
                        <Label>Creation Date (Approx)</Label>
                        <Input name="creationDate" value={formData.creationDate} onChange={handleInputChange} placeholder="e.g. January 2024" />
                    </div>
                    <div className="space-y-2">
                        <Label>Effective Date of Transfer</Label>
                        <Input name="effectiveDate" value={formData.effectiveDate} onChange={handleInputChange} type="date" />
                    </div>
                </div>
            </section>

            {/* Assignment Terms */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Globe className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">Assignment Terms</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Consideration Amount</Label>
                        <Input name="considerationAmount" value={formData.considerationAmount} onChange={handleInputChange} placeholder="e.g. INR 10,000 or 'Nominal Consideration'" />
                    </div>
                    <div className="space-y-2">
                        <Label>Territory</Label>
                        <Input name="territory" value={formData.territory} onChange={handleInputChange} placeholder="e.g. Worldwide" />
                    </div>
                    <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. Perpetual" />
                    </div>
                    <div className="space-y-2">
                        <Label>Governing Law</Label>
                        <Input name="governingLaw" value={formData.governingLaw} onChange={handleInputChange} placeholder="e.g. India" />
                    </div>
                </div>
            </section>
        </div>
    );
};
