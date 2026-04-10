import DocumentBaseGenerator from '../DocumentBaseGenerator';
import ESOPPlanForm from './ESOPPlanForm';

export default function ESOPPlanAgreement() {
    const initialFormData = {
        company_name: '',
        company_cin: '',
        registered_office: '',
        effective_date: '',
        total_option_pool: '',
        percentage_of_capital: '',
        eligibility_criteria: '',
        vesting_schedule: '',
        exercise_price_mechanism: '',
        exercise_period: '',
        lock_in_period: '',
        accelerated_vesting: true,
        governing_law: 'Laws of India',
        listed_company: false,
        advisors_included: false,
        foreign_employees: false,
        additional_conditions: ''
    };

    const sidebarTips = [
        {
            title: "ESOP Pool Size",
            content: "Typically, early-stage startups reserve 10-15% of their fully diluted capital for the ESOP pool."
        },
        {
            title: "Vesting & Cliff",
            content: "A standard 4-year vesting with a 1-year cliff is common. No options vest before the cliff period ends."
        },
        {
            title: "Exercise Price",
            content: "The price at which employees buy the shares. Setting it at FMV helps avoid immediate tax implications."
        },
        {
            title: "Taxation",
            content: "ESOPs are taxed as perquisites when exercised and as capital gains when the shares are sold."
        }
    ];

    return (
        <DocumentBaseGenerator
            title="Employee Stock Option Plan (ESOP)"
            description="Generate a legally compliant ESOP Plan document for your company under Indian law."
            documentType="esop-plan"
            initialFormData={initialFormData}
            sidebarTips={sidebarTips}
            sidebarDescription="This generator creates a comprehensive ESOP Plan compliant with the Companies Act, 2013."
            docxFilename="ESOP_Plan_Document.docx"
            renderForm={(formData, handleInputChange, _handleSelectChange, setFormData) => (
                <ESOPPlanForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
