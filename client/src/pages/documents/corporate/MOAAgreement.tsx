import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import MOAForm from './MOAForm';

const MOAAgreement: React.FC = () => {
    const initialData = {
        companyName: 'Vidhik AI Solutions Private Limited',
        companyType: 'Private Limited',
        state: 'Maharashtra',
        mainObjects: 'To carry on the business of providing AI-powered legal technology solutions, drafting automated legal documents, providing legal research tools, and developing software for law firms and legal professionals.',
        ancillaryObjects: 'To acquire trademarks, patents, and other intellectual property; to enter into partnerships; to borrow or raise money for business purposes; to do all such other things as are incidental or conducive to the attainment of the main objects.',
        liabilityType: 'Limited by Shares',
        authorizedCapital: '10,00,000',
        totalShares: '1,00,000',
        faceValue: '10',
        subscribers: '1. Rahul Sharma, S/o Sunil Sharma, R/o Mumbai - 50,000 shares.\n2. Priya Verma, D/o Anil Verma, R/o Pune - 50,000 shares.',
        witnessDetails: 'Mr. Sunil Gupta, S/o Mr. Ramesh Gupta, residing at Flat 402, Lotus Apartments, Andheri West, Mumbai - 400053.'
    };

    const sidebarTips = [
        { title: "Name Clause", content: "The Name Clause must exactly match the name approved by ROC." },
        { title: "Objects Clause", content: "The Objects Clause should be drafted broadly to avoid ultra vires acts." },
        { title: "Main Objects", content: "Main objects should clearly define the core business of the company." },
        { title: "Authorized Capital", content: "Capital should be sufficient for initial business needs." },
        { title: "Subscribers", content: "Ensure subscriber details match their PAN/Aadhar records." }
    ];

    return (
        <DocumentBaseGenerator
            title="Memorandum of Association (MOA)"
            description="Generate a legally compliant MOA under Companies Act, 2013"
            documentType="moa"
            initialFormData={initialData}
            docxFilename="memorandum-of-association.docx"
            sidebarDescription="The MOA is the charter of the company and defines its constitution and scope of powers."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <MOAForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default MOAAgreement;
