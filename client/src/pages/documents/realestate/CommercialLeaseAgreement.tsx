import DocumentBaseGenerator from '../DocumentBaseGenerator';
import { CommercialLeaseForm } from './CommercialLeaseForm';

export default function CommercialLeaseAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        lessorName: 'Rajesh Malhotra',
        lessorAddress: 'Flat 402, Sea View Apartments, Juhu, Mumbai, Maharashtra 400049',
        lessorPAN: 'AMPMW1234K',
        lesseeName: 'TechVantage Innovations Pvt Ltd',
        lesseeAddress: 'Level 5, Cyber Hub, DLF Phase 3, Gurgaon, Haryana 122002',
        lesseeID: 'U72200DL2022PTC394851',
        propertyAddress: 'E-45, First Floor, Okhla Industrial Estate, Phase III, New Delhi 110020',
        unitDetails: 'Unit No. 101, First Floor',
        area: '3,200 Sq. Ft. (Super Built-up)',
        commencementDate: today,
        leaseTerm: '3 Years (36 Months)',
        lockInPeriod: '12 Months',
        monthlyRent: 'INR 2,40,000 (Two Lakh Forty Thousand per month)',
        escalationTerms: '5% increase in base rent after every 12 months',
        gstApplicable: true,
        securityDepositAmount: 'INR 14,40,000 (Fourteen Lakh Forty Thousand - equivalent to 6 months rent)',
        permittedUse: 'General Office administration and Software Development activities',
        maintenanceStructure: 'Lessee to pay Monthly CAM and Electricity; Lessor to pay Property Taxes',
        terminationNoticePeriod: '3 Months (90 Days)',
        registrationResponsibility: 'Vendor to bear Stamp Duty; Registration charges shared equally (50:50)',
        disputeResolutionDetails: 'Through Arbitration in Delhi; Jurisdiction of Delhi Courts',
        additionalClauses: 'Lessor provides 4 dedicated car parking slots at no extra cost.'
    };

    const sidebarTips = [
        { title: "Lock-in Period", content: "A lock-in period ensures that the Tenant cannot vacate (and the Landlord cannot evict) before a certain time without paying the remaining rent." },
        { title: "Rent Escalation", content: "Standard commercial escalations in India range from 5% to 15% after every 1 to 3 years." },
        { title: "Registration", content: "Leases longer than 11 months MUST be registered to be admissible as evidence in court under the Registration Act." },
        { title: "Structural Repairs", content: "The Lessor is usually responsible for structural repairs, while the Lessee handles day-to-day internal maintenance." }
    ];

    return (
        <DocumentBaseGenerator
            title="Commercial Lease Agreement"
            description="A comprehensive rental agreement for office spaces, retail outlets, or commercial buildings compliant with Indian law."
            documentType="commercial-lease"
            initialFormData={initialFormData}
            docxFilename="commercial-lease-agreement.docx"
            sidebarDescription="Generate legally robust commercial lease agreements with clear terms on rent, deposit, and maintenance."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <CommercialLeaseForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
