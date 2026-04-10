import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import ArticlesOfAssociationForm from './ArticlesOfAssociationForm';

const ArticlesOfAssociationAgreement: React.FC = () => {
    const initialData = {
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
    };

    const sidebarTips = [
        { title: "Table F", content: "Most private companies adopt Table F of Schedule I as their model articles." },
        { title: "Share Transfer", content: "AOA must contain restrictions on the transfer of shares for private companies." },
        { title: "Director Powers", content: "Clearly define the powers and duties of directors to avoid future disputes." },
        { title: "Borrowing Powers", content: "Directors usually need specific authorization in AOA to borrow money beyond certain limits." },
        { title: "General Meetings", content: "Provisions for notice and quorum of meetings should comply with Section 101-103." }
    ];

    return (
        <DocumentBaseGenerator
            title="Articles of Association (AOA)"
            description="Generate internal rules and regulations for your company under Companies Act, 2013"
            documentType="aoa"
            initialFormData={initialData}
            docxFilename="articles-of-association.docx"
            sidebarDescription="The AOA contains the internal rules and regulations for the management of the company."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <ArticlesOfAssociationForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />


            )}
        />
    );
};

export default ArticlesOfAssociationAgreement;
