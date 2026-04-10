import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import DirectorResignationForm from './DirectorResignationForm';

const DirectorResignationAgreement: React.FC = () => {
    const initialData = {
        companyName: '',
        registeredOffice: '',
        directorName: '',
        din: '',
        designation: '',
        resignationDate: '',
        effectiveDate: '',
        reason: '',
        transitionSupportRequired: false,
        additionalStatements: ''
    };

    return (
        <DocumentBaseGenerator
            documentType="director-resignation"
            title="Resignation of Director Letter"
            description="Letter for director resignation addressed to the Board of Directors of an Indian company."
            initialFormData={initialData}
            sidebarTips={[
                { title: "Statutory Filing", content: "The resignation must be filed with the ROC in Form DIR-12 within 30 days." },
                { title: "Effective Date", content: "Ensure the effective date matches your actual last day of service for legal clarity." }
            ]}
            sidebarDescription="Generate a legally compliant resignation letter suitable for board submission and ROC filing."
            docxFilename="Director_Resignation_Letter.docx"
            renderForm={(formData, handleInputChange, _handleSelectChange, setFormData) => (
                <DirectorResignationForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default DirectorResignationAgreement;
