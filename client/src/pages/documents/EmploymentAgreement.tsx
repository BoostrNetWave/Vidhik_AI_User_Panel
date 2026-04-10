import DocumentBaseGenerator from './DocumentBaseGenerator';
import { EmploymentForm } from './employment/EmploymentForm';

export default function EmploymentAgreement() {
    const initialFormData = {
        employerName: 'Vidhik AI Technologies Pvt Ltd',
        employerRegNumber: 'U72900KA2024PTC123456',
        employerAddress: 'Level 4, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059',
        authSignatoryName: 'Anand Sharma',
        authSignatoryDesignation: 'Director',
        employeeName: 'Rahul Varma',
        employeeEmail: 'rahul.varma@example.com',
        employeePhone: '+91 98765 43210',
        employeeAddress: 'Flat 202, Silver Oaks Apartments, Koramangala 4th Block, Bangalore 560034',
        jobTitle: 'Senior Product Manager',
        department: 'Product Management',
        reportingManager: 'CEO',
        startDate: '2024-03-01',
        employmentType: 'Permanent',
        workLocation: 'Bangalore Office',
        salaryAmount: '1,80,000',
        salaryFrequency: 'Monthly',
        salaryBreakdown: 'Basic: 90,000; HRA: 45,000; Special Allowance: 45,000',
        leaveEntitlements: '24 days per annum (18 Earned, 6 Sick)',
        insuranceBenefits: 'Group Health Insurance cover of ₹5,00,000 for self and family',
        probationApplicable: 'Yes',
        probationDuration: '6 Months',
        confidentialityScope: 'All trade secrets, business strategies, and customer data belonging to the Company.',
        confidentialityDuration: 'During and 3 years after employment',
        ipOwnership: 'All work-product created during employment belongs exclusively to the Company.',
        nonCompete: 'No',
        nonCompeteDuration: '1 Year',
        nonCompeteGeography: 'India',
        nonSolicitationDuration: '1 Year',
        noticePeriodEmployee: '90 Days',
        noticePeriodEmployer: '90 Days',
        terminationGrounds: 'Misconduct, Fraud, Material Breach of Policy',
        governingLaw: 'Laws of India',
        jurisdiction: 'Bangalore, Karnataka',
        placeSigning: 'Bangalore',
        dateSigning: new Date().toISOString().split('T')[0]
    };

    const sidebarTips = [
        { title: "Statutory Compliance", content: "Ensure salary breakdown includes PF, ESI, and Gratuity as per Indian labor laws." },
        { title: "Probation Terms", content: "Permanent employment usually includes a 3-6 month probation period with specific termination notice." },
        { title: "Restrictive Covenants", content: "Non-compete clauses must be reasonable in scope and duration to be enforceable in India." },
        { title: "IP Assignment", content: "Explicitly state that all work-product created during employment belongs to the employer." }
    ];

    return (
        <DocumentBaseGenerator
            title="Employment Agreement"
            description="Generate a legally compliant employment contract for India"
            documentType="employment-contract"
            initialFormData={initialFormData}
            docxFilename="employment-agreement.docx"
            sidebarDescription="Drafting a comprehensive employment agreement helps minimize future disputes and clearly defines the employer-employee relationship."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <EmploymentForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}


        />
    );
}
