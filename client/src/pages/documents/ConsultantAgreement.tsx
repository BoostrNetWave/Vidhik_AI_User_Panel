import DocumentBaseGenerator from './DocumentBaseGenerator';
import { ConsultantForm } from './employment/ConsultantForm';

export default function ConsultantAgreement() {
    const initialFormData = {
        clientName: 'Digital Flow Innovations Pvt Ltd',
        clientAddress: 'Third Floor, Cyber Hub, DLF Phase 3, Gurgaon, Haryana 122002',
        clientRegNumber: 'U74140HR2023PTC654321',
        consultantName: 'Kaveri Analytics & Advisory',
        consultantAddress: '15th Main, Sector 7, HSR Layout, Bangalore 560102',
        consultantPAN: 'AAACK1234L',
        consultantGST: '29AAACK1234L1Z5',
        effectiveDate: new Date().toISOString().split('T')[0],
        term: '6 Months',
        autoRenewal: 'No',
        servicesDescription: 'Strategic market analysis for FinTech expansion in Southeast Asia. Includes competitor bench-marking and product-market fit reports.',
        deliverables: 'Bi-weekly strategic reports and one final expansion blueprint.',
        milestones: 'Phase 1: Market Analysis (Month 2); Phase 2: Competitor Review (Month 4); Phase 3: Final Blueprint (Month 6)',
        consultancyFee: '2,50,000',
        paymentTerms: 'Within 7 days of milestone completion',
        paymentSchedule: 'Milestone-based (30% on start, 40% on mid-term, 30% on completion)',
        expenseReimbursement: 'Yes',
        confidentiality: 'Strict non-disclosure of all Client business models and expansion strategies.',
        ipOwnership: 'Full assignment of all report contents to Client upon full payment of fees.',
        terminationNotice: '15 Days',
        governingLaw: 'Laws of India',
        jurisdiction: 'Delhi, India'
    };

    const sidebarTips = [
        { title: "TDS Compliance", content: "Under Section 194J, Clients must deduct TDS (usually 10% or 2%) on professional fees." },
        { title: "Avoid Employment Terms", content: "Ensure zero mention of 'benefits', 'salary', or 'leave' to keep the Independent Contractor status clear." },
        { title: "IP Assignment", content: "Explicitly state that work product transfer is contingent upon full payment of fees." },
        { title: "GST Requirements", content: "If the consultant's turnover exceeds ₹20 Lakhs, GST registration and invoicing are mandatory." }
    ];

    return (
        <DocumentBaseGenerator
            title="Consultant Agreement"
            description="Professional Independent Contractor Agreement for freelancers and advisors"
            documentType="consultant-agreement"
            initialFormData={initialFormData}
            docxFilename="consultant-agreement.docx"
            sidebarDescription="Clearly defining the scope of services and payment terms is critical for successful consulting engagements in India."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <ConsultantForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
