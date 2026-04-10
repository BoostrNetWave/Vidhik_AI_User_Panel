import DocumentBaseGenerator from '../DocumentBaseGenerator';
import ConvertibleNoteAgreementForm from './ConvertibleNoteAgreementForm';

export default function ConvertibleNoteAgreement() {
    const initialFormData = {
        company_name: '',
        company_cin: '',
        registered_office: '',
        investor_name: '',
        investor_address: '',
        principal_amount: '',
        interest_rate: '',
        issue_date: '',
        maturity_date: '',
        valuation_cap: '',
        discount_rate: '',
        qualified_financing_threshold: '',
        conversion_type: 'automatic',
        repayment_on_maturity: true,
        governing_law: 'Laws of India',
        arbitration_clause: '',
        foreign_investor: false,
        additional_rights: ''
    };

    const sidebarTips = [
        {
            title: "What is a Convertible Note?",
            content: "A short-term debt instrument that converts into equity, usually in conjunction with a future financing round."
        },
        {
            title: "Valuation Cap",
            content: "The maximum valuation at which the note converts into equity, protecting the investor from high valuations."
        },
        {
            title: "Discount Rate",
            content: "A percentage discount on the share price of the future round, rewarding early investors for their risk."
        },
        {
            title: "Qualified Financing",
            content: "A future equity round (like Series A) that meets a minimum amount, triggering automatic conversion."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Convertible Note Agreement"
            description="Generate a legally enforceable debt-to-equity investment instrument under Indian law."
            documentType="convertible-note"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator creates a standard Convertible Note Agreement suitable for early-stage startup investments in India."
            docxFilename="Convertible_Note_Agreement.docx"
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <ConvertibleNoteAgreementForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
