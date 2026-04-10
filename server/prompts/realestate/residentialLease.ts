// Residential Lease Agreement Prompt Template
// Specialized for Indian residential property law

import { formatBasePrompt } from '../common/basePrompt';

export interface ResidentialLeaseData {
    // Landlord
    landlordName: string;
    landlordAddress: string;
    landlordPAN: string;

    // Tenant
    tenantName: string;
    tenantAddress: string;
    tenantID: string;

    // Property
    propertyAddress: string;
    propertyDescription: string;
    commencementDate: string;
    leaseDuration: string;

    // Financials
    monthlyRent: string;
    rentDueDate: string;
    escalationTerms?: string;
    securityDepositAmount: string;

    // Operational
    noticePeriod: string;
    lockInPeriod?: string;
    furnishingDetails?: string;
    parkingDetails?: string;
    societyRulesApplicable: boolean;

    // Legal
    disputeResolutionPreference: 'court' | 'arbitration';
    registrationResponsibility: string;
    additionalClauses?: string;
}

export const generateResidentialLeasePrompt = (formData: ResidentialLeaseData): string => {
    const data = {
        landlord_details: {
            name: formData.landlordName,
            address: formData.landlordAddress,
            pan: formData.landlordPAN
        },
        tenant_details: {
            name: formData.tenantName,
            address: formData.tenantAddress,
            id: formData.tenantID
        },
        property_address: formData.propertyAddress,
        property_description: formData.propertyDescription,
        commencement_date: formData.commencementDate,
        lease_duration: formData.leaseDuration,
        monthly_rent: formData.monthlyRent,
        rent_due_date: formData.rentDueDate,
        escalation_terms: formData.escalationTerms,
        security_deposit_amount: formData.securityDepositAmount,
        notice_period: formData.noticePeriod,
        lock_in_period: formData.lockInPeriod,
        furnishing_details: formData.furnishingDetails,
        parking_details: formData.parkingDetails,
        society_rules_applicable: formData.societyRulesApplicable,
        dispute_resolution_preference: formData.disputeResolutionPreference,
        registration_responsibility: formData.registrationResponsibility,
        additional_clauses: formData.additionalClauses
    };

    return `${formatBasePrompt()}

**DOCUMENT TYPE:** RESIDENTIAL LEASE AGREEMENT

APPLICABLE LAWS:
- Transfer of Property Act, 1882
- Information Technology Act, 2000
- Registration Act, 1908
- Indian Stamp Act, 1899

INPUT DATA (JSON):
${JSON.stringify(data, null, 2)}

Please generate the Residential Lease Agreement now based on this data and the provided system instructions.`;
};
