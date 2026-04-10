import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import PowerOfAttorneyCorporateForm from './PowerOfAttorneyCorporateForm';

const PowerOfAttorneyCorporateAgreement: React.FC = () => {
    const initialData = {
        company_name: '',
        company_cin: '',
        registered_office: '',
        authorized_signatory_name: '',
        authorized_signatory_designation: '',
        board_resolution_date: '',
        attorney_name: '',
        attorney_address: '',
        attorney_id_details: '',
        purpose_of_poa: '',
        specific_powers: [],
        monetary_limit: '',
        geographic_limit: '',
        delegation_allowed: false,
        effective_date: '',
        expiry_date: '',
        revocable: true,
        registration_required: false,
        additional_clauses: ''
    };

    return (
        <DocumentBaseGenerator
            documentType="power-of-attorney-corporate"
            title="Power of Attorney (Corporate)"
            description="Legal document for corporate representation authorizing an individual to act on behalf of the company."
            initialFormData={initialData}
            sidebarTips={[
                { title: "Define Scope Clearly", content: "Avoid blanket 'all acts' language. Specify exactly what the attorney can and cannot do." },
                { title: "Registration", content: "PoAs involving property rights or high-value transactions often require mandatory registration before a Sub-Registrar." },
                { title: "Revocation", content: "Ensure you maintain the right to revoke the PoA unless it's intended to be irrevocable for a specific reason." }
            ]}
            sidebarDescription="Generate a legally enforceable Corporate Power of Attorney compliant with Indian laws."
            docxFilename="Power_of_Attorney_Corporate.docx"
            renderForm={(formData, handleInputChange, _handleSelectChange, setFormData) => (
                <PowerOfAttorneyCorporateForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default PowerOfAttorneyCorporateAgreement;
