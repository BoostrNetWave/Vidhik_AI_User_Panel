import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, Landmark, Users, Sparkles } from 'lucide-react';

interface MOAFormProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    setFormData?: (data: any) => void;
}

const MOAForm: React.FC<MOAFormProps> = ({
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
                companyType: 'Private Limited', // Added for completeness
                state: 'Karnataka',
                registeredOffice: 'No. 123, 5th Floor, Prestige Trade Tower, Palace Road, Bangalore, Karnataka 560001',
                mainObjects: 'To carry on the business of providing artificial intelligence based legal technology solutions, document automation, and legal research services.',
                ancillaryObjects: 'To acquire, build, and maintain software infrastructure, data centers, and related technologies for the fulfillment of main objects.',
                liabilityType: 'Limited by Shares',
                authorizedCapital: '10,00,000', // Mapped to existing field
                totalShares: '1,00,000', // Added for completeness
                faceValue: '10', // Mapped to existing field
                subscribers: "Rahul Sharma, S/o Sunil Sharma, R/o Mumbai - 5,000 shares.\nPriya Singh, D/o Anand Singh, R/o Delhi - 5,000 shares.", // Added for completeness
                witnessDetails: "Mr. X, S/o Mr. Y, residing at 123, Main Street, Bangalore." // Added for completeness
            });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-end pt-4">
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
                            <Label htmlFor="companyName">Proposed Company Name</Label>
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
                                onValueChange={(v: any) => handleSelectChange('companyType', v)}
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
                        <div className="space-y-2">
                            <Label htmlFor="state">State of Registered Office</Label>
                            <Input
                                id="state"
                                name="state"
                                placeholder="e.g. Maharashtra"
                                value={formData.state || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Objects Clause */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <FileText className="h-5 w-5" />
                        Objects Clause
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="mainObjects">Main Objects to be pursued (on incorporation)</Label>
                        <Textarea
                            id="mainObjects"
                            name="mainObjects"
                            placeholder="State the primary business activities..."
                            className="min-h-[120px]"
                            value={formData.mainObjects || ''}
                            onChange={handleInputChange}
                        />
                        <p className="text-xs text-muted-foreground italic">
                            Tip: Describe the core business activities the company will undertake.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ancillaryObjects">Ancillary/Other Objects</Label>
                        <Textarea
                            id="ancillaryObjects"
                            name="ancillaryObjects"
                            placeholder="Matters necessary for furtherance of objects..."
                            value={formData.ancillaryObjects || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Liability & Capital */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Landmark className="h-5 w-5" />
                        Liability & Capital Structure
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="liabilityType">Liability of Members</Label>
                            <Select
                                value={formData.liabilityType || 'Limited by Shares'}
                                onValueChange={(v: any) => handleSelectChange('liabilityType', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select liability type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Limited by Shares">Limited by Shares</SelectItem>
                                    <SelectItem value="Limited by Guarantee">Limited by Guarantee</SelectItem>
                                    <SelectItem value="Unlimited">Unlimited</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="authorizedCapital">Total Authorized Capital (INR)</Label>
                            <Input
                                id="authorizedCapital"
                                name="authorizedCapital"
                                placeholder="e.g. 1,00,000"
                                value={formData.authorizedCapital || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="totalShares">Total Number of Shares</Label>
                            <Input
                                id="totalShares"
                                name="totalShares"
                                placeholder="e.g. 10,000"
                                value={formData.totalShares || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="faceValue">Face Value per Share (INR)</Label>
                            <Input
                                id="faceValue"
                                name="faceValue"
                                placeholder="e.g. 10"
                                value={formData.faceValue || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Subscribers */}
            <Card className="border-violet-100 shadow-sm">
                <CardHeader className="bg-violet-50/50 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-violet-800">
                        <Users className="h-5 w-5" />
                        Subscriber Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subscribers">Subscribers (Name, Father's Name, Address, Shares)</Label>
                        <Textarea
                            id="subscribers"
                            name="subscribers"
                            placeholder="Enter subscriber details..."
                            className="min-h-[100px]"
                            value={formData.subscribers || ''}
                            onChange={handleInputChange}
                        />
                        <p className="text-xs text-muted-foreground italic">
                            Example: Rahul Sharma, S/o Sunil Sharma, R/o Mumbai - 5,000 shares.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="witnessDetails">Witness Details (Optional)</Label>
                        <Input
                            id="witnessDetails"
                            name="witnessDetails"
                            placeholder="e.g. Mr. X, S/o Mr. Y, residing at..."
                            value={formData.witnessDetails || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MOAForm;
