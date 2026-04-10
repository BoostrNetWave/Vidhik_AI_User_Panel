import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Landmark, Sparkles, Users, Shield, Scale } from 'lucide-react';

interface ArticlesOfAssociationFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

const ArticlesOfAssociationForm: React.FC<ArticlesOfAssociationFormProps> = ({
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData
}) => {

    const fillDummyData = () => {
        if (setFormData) {
            setFormData({
                ...formData,
                companyName: 'Vidhik AI Solutions Private Limited',
                companyType: 'Private Limited',
                authorizedCapital: '10,00,000',
                numberOfDirectors: '3',
                transferRestrictionsRequired: true,
                nomineeDirectorAllowed: true,
                retirementByRotationApplicable: false,
                commonSealRequired: false,
                borrowingLimit: '50,00,000',
                additionalGovernanceClauses: 'The Board shall have the power to appoint an Advisory Committee for strategic decisions. Any dispute between shareholders shall be settled via arbitration in Mumbai.'
            });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fillDummyData}
                    className="gap-2 text-violet-600 border-violet-200 hover:bg-violet-50"
                >
                    <Sparkles className="h-4 w-4" />
                    Fill Dummy Data
                </Button>
            </div>

            {/* Section 1: Company Details */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Building2 className="h-5 w-5" />
                        Company Identification
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                id="companyName"
                                name="companyName"
                                placeholder="e.g. Vidhik AI Solutions Private Limited"
                                value={formData.companyName || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="companyType">Company Type</Label>
                            <Select
                                value={formData.companyType || 'Private Limited'}
                                onValueChange={(v) => handleSelectChange('companyType', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select company type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Private Limited">Private Limited</SelectItem>
                                    <SelectItem value="Public Limited">Public Limited</SelectItem>
                                    <SelectItem value="One Person Company (OPC)">One Person Company (OPC)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Capital & Borrowing */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Landmark className="h-5 w-5" />
                        Capital & Borrowing
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="authorizedCapital">Authorized Share Capital (INR)</Label>
                            <Input
                                id="authorizedCapital"
                                name="authorizedCapital"
                                placeholder="e.g. 10,00,000"
                                value={formData.authorizedCapital || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="borrowingLimit">Borrowing Limit (INR)</Label>
                            <Input
                                id="borrowingLimit"
                                name="borrowingLimit"
                                placeholder="e.g. 50,00,000"
                                value={formData.borrowingLimit || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Board Structure */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Users className="h-5 w-5" />
                        Board of Directors
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="numberOfDirectors">Proposed Number of Directors</Label>
                            <Input
                                id="numberOfDirectors"
                                name="numberOfDirectors"
                                type="number"
                                placeholder="e.g. 3"
                                value={formData.numberOfDirectors || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-violet-100 transition-colors">
                            <Checkbox
                                id="nomineeDirectorAllowed"
                                checked={formData.nomineeDirectorAllowed || false}
                                onCheckedChange={(checked) => handleSelectChange('nomineeDirectorAllowed', checked as string)}
                            />
                            <Label htmlFor="nomineeDirectorAllowed" className="text-sm font-normal cursor-pointer">Allow Nominee Directors</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-violet-100 transition-colors">
                            <Checkbox
                                id="retirementByRotationApplicable"
                                checked={formData.retirementByRotationApplicable || false}
                                onCheckedChange={(checked) => handleSelectChange('retirementByRotationApplicable', checked as string)}
                            />
                            <Label htmlFor="retirementByRotationApplicable" className="text-sm font-normal cursor-pointer">Retirement by Rotation Applicable</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Governance Options */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Shield className="h-5 w-5" />
                        Governance & Restrictions
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-violet-100 transition-colors">
                            <Checkbox
                                id="transferRestrictionsRequired"
                                checked={formData.transferRestrictionsRequired !== false}
                                onCheckedChange={(checked) => handleSelectChange('transferRestrictionsRequired', checked as string)}
                            />
                            <Label htmlFor="transferRestrictionsRequired" className="text-sm font-normal cursor-pointer">Include Share Transfer Restrictions</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded-lg border border-transparent hover:border-violet-100 transition-colors">
                            <Checkbox
                                id="commonSealRequired"
                                checked={formData.commonSealRequired || false}
                                onCheckedChange={(checked) => handleSelectChange('commonSealRequired', checked as string)}
                            />
                            <Label htmlFor="commonSealRequired" className="text-sm font-normal cursor-pointer">Common Seal Required</Label>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="additionalGovernanceClauses" className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-violet-600" />
                            Additional Governance Clauses (Optional)
                        </Label>
                        <Textarea
                            id="additionalGovernanceClauses"
                            name="additionalGovernanceClauses"
                            placeholder="Enter any specific governance rules, dispute resolution clauses, etc..."
                            className="min-h-[120px]"
                            value={formData.additionalGovernanceClauses || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ArticlesOfAssociationForm;
