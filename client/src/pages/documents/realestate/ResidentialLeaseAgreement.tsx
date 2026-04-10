import DocumentBaseGenerator from '../DocumentBaseGenerator';
import { ResidentialLeaseForm } from './ResidentialLeaseForm';

export default function ResidentialLeaseAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        landlordName: 'Sanjay Kapoor',
        landlordAddress: 'House No. 124, Sector 15-A, Noida, Uttar Pradesh 201301',
        landlordPAN: 'BKPPS5678Q',
        tenantName: 'Anjali Sharma',
        tenantAddress: 'C-22, Malviya Nagar, Jaipur, Rajasthan 302017',
        tenantID: 'Aadhaar: XXXX-XXXX-1234',
        propertyAddress: 'Apartment 502, Tower B, Prestige Lakeside Habitat, Varthur, Bangalore 560087',
        propertyDescription: '3 BHK Semi-furnished Apartment with Modular Kitchen, 3 Bathrooms, and 2 Balconies',
        commencementDate: today,
        leaseDuration: '11 Months',
        monthlyRent: 'INR 45,000 (Forty Five Thousand per month)',
        rentDueDate: '5th of every month',
        escalationTerms: '5% increase upon renewal for next term',
        securityDepositAmount: 'INR 2,00,000 (Refundable, Interest-free)',
        noticePeriod: '1 Month (30 Days)',
        lockInPeriod: '6 Months',
        furnishingDetails: 'Includes 3 Air Conditioners, Geysers in all bathrooms, and Wardrobes in all bedrooms',
        parkingDetails: '2 Dedicated basement car parking slots',
        societyRulesApplicable: true,
        disputeResolutionPreference: 'court',
        registrationResponsibility: 'Shared equally (50:50) between Landlord and Tenant',
        additionalClauses: 'Tenant is responsible for monthly society maintenance charges and utilities.'
    };

    const sidebarTips = [
        { title: "Residential Purpose", content: "Ensure the agreement explicitly prohibits commercial activities (like running a boutique or office) to avoid zoning violations." },
        { title: "11-Month Term", content: "In many Indian states, an 11-month lease is common to avoid complex rent control laws, though registration is still legally required for leases." },
        { title: "Security Deposit", content: "The deposit is typically 2 to 10 months of rent, depending on the city. It should be refunded within 7 days of vacation." },
        { title: "Maintenance", content: "Tenant usually pays for day-to-day minor repairs, while major structural issues are the Landlord's expense." }
    ];

    return (
        <DocumentBaseGenerator
            title="Residential Lease Agreement"
            description="A clear and legally enforceable rental agreement for houses and apartments in India."
            documentType="residential-lease"
            initialFormData={initialFormData}
            docxFilename="residential-lease-agreement.docx"
            sidebarDescription="Generate a professional residential rental agreement with clear terms on rent, deposit, and society rules."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <ResidentialLeaseForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
