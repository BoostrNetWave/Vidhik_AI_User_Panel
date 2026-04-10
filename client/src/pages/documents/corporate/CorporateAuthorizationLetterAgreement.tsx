import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import CorporateAuthorizationLetterForm from './CorporateAuthorizationLetterForm';

const CorporateAuthorizationLetterAgreement: React.FC = () => {
    const initialData = {
        companyName: '',
        companyCin: '',
        registeredOffice: '',
        authorizedPersonName: '',
        authorizedPersonDesignation: '',
        idDetails: '',
        authorityRecipient: '',
        purposeOfAuthorization: '',
        scopeDetails: '',
        monetaryLimit: '',
        validityStartDate: '',
        validityEndDate: '',
        boardResolutionDate: '',
        revocable: true,
        additionalConditions: ''
    };

    return (
        <DocumentBaseGenerator
            documentType="corporate-authorization-letter"
            title="Corporate Authorization Letter"
            description="Letter authorizing a person to act for a company for a specified purpose."
            initialFormData={initialData}
            sidebarTips={[
                { title: "Limited Authority", content: "Always specify the exact scope of authority to prevent unauthorized actions." },
                { title: "Validity Period", content: "It's best practice to include a validity start and end date for control." },
                { title: "Board Resolution", content: "Mentioning a Board Resolution adds legal weight and confirms corporate approval." }
            ]}
            sidebarDescription="Generate a legally valid authorization letter suitable for banks, authorities, and vendors."
            docxFilename="Corporate_Authorization_Letter.docx"
            renderForm={(formData, handleInputChange, _handleSelectChange, setFormData) => (
                <CorporateAuthorizationLetterForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default CorporateAuthorizationLetterAgreement;
