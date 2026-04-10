// Consultant Agreement Prompt Template
// Specialized for freelancer/independent contractor agreements

import { formatBasePrompt } from '../common/basePrompt';

export interface ConsultantAgreementData {
    // Parties
    clientName: string;
    clientAddress: string;
    clientRegNumber?: string;
    consultantName: string;
    consultantAddress: string;
    consultantPAN?: string;
    consultantGST?: string;

    // Agreement Specifics
    effectiveDate: string;
    term: string; // e.g., "6 months", "1 year"
    autoRenewal: 'Yes' | 'No';

    // Scope of Work
    servicesDescription: string;
    deliverables?: string;
    milestones?: string;

    // Compensation
    consultancyFee: string;
    paymentTerms: string;
    paymentSchedule: string;
    expenseReimbursement: 'Yes' | 'No';

    // Legal Terms
    confidentiality: string;
    ipOwnership: string;
    terminationNotice: string;
    governingLaw: string;
    jurisdiction: string;
}

export const generateConsultantAgreementPrompt = (formData: ConsultantAgreementData): string => {
    return `${formatBasePrompt()}

**DOCUMENT TYPE:** CONSULTANT/FREELANCER AGREEMENT

**APPLICABLE LAWS:**
- Indian Contract Act, 1872
- Income Tax Act, 1961 (Section 194J - TDS on Professional Fees)
- Goods and Services Tax Act, 2017 (if applicable)
- Information Technology Act, 2000 (for IP and confidentiality)

**DOCUMENT STRUCTURE REQUIRED:**

1. **TITLE AND DATE**
   - Title: "CONSULTANT AGREEMENT" or "INDEPENDENT CONTRACTOR AGREEMENT"
   - Date: ${formData.effectiveDate}

2. **PARTIES SECTION**
   - Client: ${formData.clientName}
     Address: ${formData.clientAddress}
     ${formData.clientRegNumber ? `Registration: ${formData.clientRegNumber}` : ''}
   - Consultant: ${formData.consultantName}
     Address: ${formData.consultantAddress}
     ${formData.consultantPAN ? `PAN: ${formData.consultantPAN}` : ''}
     ${formData.consultantGST ? `GSTIN: ${formData.consultantGST}` : ''}

3. **RECITALS**
   - Client requires professional consulting services
   - Consultant has expertise in the required field
   - Parties wish to formalize the engagement

4. **DEFINITIONS**
   Define key terms:
   - "Services"
   - "Deliverables"
   - "Consultancy Fee"
   - "Confidential Information"
   - "Intellectual Property"

5. **APPOINTMENT AND SCOPE OF SERVICES**
   - Client engages Consultant as independent contractor (NOT employee)
   - Services Description: ${formData.servicesDescription}
   ${formData.deliverables ? `- Deliverables: ${formData.deliverables}` : ''}
   ${formData.milestones ? `- Milestones: ${formData.milestones}` : ''}
   - Consultant has autonomy in performing services
   - No employer-employee relationship created

6. **TERM**
   - Effective Date: ${formData.effectiveDate}
   - Duration: ${formData.term}
   - Auto-Renewal: ${formData.autoRenewal}
   - Termination provisions

7. **CONSULTANCY FEE AND PAYMENT**
   - Fee: ${formData.consultancyFee}
   - Payment Terms: ${formData.paymentTerms}
   - Payment Schedule: ${formData.paymentSchedule}
   ${formData.expenseReimbursement === 'Yes' ? `- Expense Reimbursement: Pre-approved expenses to be reimbursed against valid receipts` : ''}
   - Tax Deduction at Source (TDS) as per Section 194J
   - GST implications (if applicable)
   - Invoice requirements

8. **INDEPENDENT CONTRACTOR STATUS**
   - Consultant is independent contractor, not employee
   - No employment benefits provided
   - Consultant responsible for own taxes and compliance
   - No right to company benefits, insurance, or leave
   - Consultant may work for other clients

9. **CONFIDENTIALITY**
   Scope: ${formData.confidentiality}
   - Non-disclosure obligations
   - Use only for services under this agreement
   - Return of confidential materials on termination
   - Duration: Survives termination

10. **INTELLECTUAL PROPERTY**
    IP Ownership: ${formData.ipOwnership}
    - Work product ownership
    - Assignment of IP rights
    - Pre-existing IP exclusions
    - Moral rights waiver (if applicable)

11. **REPRESENTATIONS AND WARRANTIES**
    By Consultant:
    - Authority to enter agreement
    - Services will be performed professionally
    - No conflicts of interest
    - Owns/has rights to any contributed materials
    - Compliance with applicable laws

12. **INDEMNIFICATION**
    - Consultant indemnifies Client for:
      - Breach of agreement
      - Negligence or willful misconduct
      - IP infringement claims
      - Tax liabilities

13. **TERMINATION**
    - Notice Period: ${formData.terminationNotice}
    - Termination for convenience (with notice)
    - Termination for cause (immediate)
    - Effects of termination:
      - Payment for services rendered
      - Return of materials
      - Survival of certain clauses

14. **NON-SOLICITATION**
    - Consultant shall not solicit Client's employees/clients
    - Duration: Typically 12 months post-termination
    - Reasonable geographic scope

15. **LIABILITY AND LIMITATION**
    - Limitation of liability clause
    - Exclusion of consequential damages
    - Insurance requirements (if any)

16. **GENERAL PROVISIONS**
    - Governing Law: ${formData.governingLaw}
    - Jurisdiction: ${formData.jurisdiction}
    - Independent contractor clause (emphasized)
    - No partnership or joint venture created
    - Assignment restrictions
    - Entire agreement
    - Amendment (in writing)
    - Severability
    - Waiver
    - Notices
    - Force majeure

17. **EXECUTION**
    - Signature blocks for both parties
    - Date and place of signing

**SPECIFIC DRAFTING GUIDELINES FOR CONSULTANT AGREEMENTS:**

1. **Independent Contractor Emphasis:** Clearly establish consultant is NOT an employee
2. **Tax Implications:** Mention TDS under Section 194J and GST if applicable
3. **Scope Clarity:** Be very specific about scope of services to avoid disputes
4. **IP Clarity:** Clearly state who owns work product
5. **Payment Terms:** Detailed payment schedule and invoice requirements
6. **No Benefits:** Explicitly state no employment benefits apply

**INDIAN LAW SPECIFIC CONSIDERATIONS:**

1. **Section 194J (TDS):** Client must deduct tax at source on professional fees
2. **GST:** If Consultant is GST-registered, GST applies to services
3. **No Employee Status:** Ensure no employer-employee relationship implied
4. **Contract Labor Act:** Ensure compliance if applicable
5. **Stamp Duty:** May be required based on state laws

Generate the complete Consultant Agreement now as pure HTML, ensuring all above requirements are met.
`;
};
