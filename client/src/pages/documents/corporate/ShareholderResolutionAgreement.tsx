import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import ShareholderResolutionForm from './ShareholderResolutionForm';

const ShareholderResolutionAgreement: React.FC = () => {
    const initialData = {
        companyName: '',
        meetingType: '',
        meetingDate: '',
        meetingVenue: '',
        chairpersonName: '',
        resolutionDetails: '',
        proxies: ''
    };

    const sidebarTips = [
        { title: "Meeting Types", content: "AGMs are annual. EGMs are for urgent matters between AGMs." },
        { title: "Quorum", content: "Ensure the meeting has the required quorum as per Section 103 of Companies Act, 2013." },
        { title: "Special vs Ordinary", content: "Specify if the resolution is 'Ordinary' (simple majority) or 'Special' (75% majority)." },
        { title: "Notice Period", content: "General meetings usually require 21 clear days' notice unless shorter notice is agreed." },
        { title: "Proxies", content: "Members have a right to appoint proxies to attend and vote on their behalf." }
    ];

    return (
        <DocumentBaseGenerator
            title="Shareholder Resolution"
            description="Generate formal decisions and resolutions passed by company shareholders."
            documentType="shareholder-resolution"
            initialFormData={initialData}
            docxFilename="shareholder-resolution.docx"
            sidebarDescription="Shareholder resolutions are official records of decisions made by the owners of the company."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <ShareholderResolutionForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default ShareholderResolutionAgreement;
