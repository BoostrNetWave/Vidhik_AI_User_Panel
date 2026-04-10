// NDA (Non-Disclosure Agreement) Prompt Template
// Specialized for confidentiality agreements under Indian law

import { formatBasePrompt } from '../common/basePrompt';

export interface NDAFormData {
    // Parties
    disclosingPartyName: string;
    disclosingPartyAddress: string;
    receivingPartyName: string;
    receivingPartyAddress: string;

    // NDA Specifics
    ndaType: 'Unilateral' | 'Mutual';
    purpose: string;
    effectiveDate: string;
    duration: string; // e.g., "3 years from date of disclosure"

    // Confidential Information
    confidentialityScope: string;
    exceptions?: string;

    // Legal Terms
    governingLaw: string;
    jurisdiction: string;

    // Remedies
    liquidatedDamages?: string;
    injunctiveRelief: 'Yes' | 'No';
}

export const generateNDAPrompt = (formData: NDAFormData): string => {
    const ndaType = formData.ndaType === 'Mutual' ? 'MUTUAL' : 'UNILATERAL';

    return `${formatBasePrompt()}

**DOCUMENT TYPE:** NON-DISCLOSURE AGREEMENT (${ndaType})

**APPLICABLE LAWS:**
- Indian Contract Act, 1872
- Information Technology Act, 2000
- Specific Relief Act, 1963 (for injunctive relief)

**DOCUMENT STRUCTURE REQUIRED:**

1. **TITLE AND DATE**
   - Title: "NON-DISCLOSURE AGREEMENT" or "CONFIDENTIALITY AGREEMENT"
   - Date and place of execution

2. **PARTIES SECTION**
   - Disclosing Party: ${formData.disclosingPartyName}
     Address: ${formData.disclosingPartyAddress}
   ${formData.ndaType === 'Mutual' ? `- (Note: In mutual NDA, both parties are Disclosing and Receiving Parties)` : ''}
   - Receiving Party: ${formData.receivingPartyName}
     Address: ${formData.receivingPartyAddress}

3. **RECITALS (WHEREAS CLAUSES)**
   - Context: ${formData.purpose}
   - Purpose of disclosure
   - Intent to protect confidential information

4. **DEFINITIONS**
   Define the following terms clearly:
   - "Confidential Information"
   - "Disclosing Party"
   - "Receiving Party"
   - "Purpose"
   - "Effective Date"

5. **CONFIDENTIAL INFORMATION**
   Scope: ${formData.confidentialityScope}
   
   Include:
   - Comprehensive definition of what constitutes confidential information
   - Forms: written, oral, electronic, visual
   - Examples: trade secrets, business plans, technical data, financial information
   
   Exceptions (Standard + Custom):
   ${formData.exceptions || `
   - Information in public domain (not due to breach)
   - Information already in possession prior to disclosure
   - Information independently developed
   - Information disclosed with written consent
   - Information required by law to be disclosed
   `}

6. **OBLIGATIONS OF RECEIVING PARTY**
   - Maintain confidentiality
   - Use only for stated purpose: ${formData.purpose}
   - Exercise reasonable care (at least equal to own confidential information)
   - Limit disclosure to need-to-know personnel
   - Not reverse engineer or attempt to discover
   - Return/destroy upon request or termination

7. **TERM AND TERMINATION**
   - Effective Date: ${formData.effectiveDate}
   - Duration: ${formData.duration}
   - Survival of obligations after termination
   - Return/destruction of materials upon termination

8. **INTELLECTUAL PROPERTY**
   - No transfer of IP rights
   - All disclosed information remains property of Disclosing Party
   - No license granted except as expressly stated

9. **REMEDIES**
   ${formData.liquidatedDamages ? `
   - Liquidated Damages: ${formData.liquidatedDamages}
   ` : ''}
   ${formData.injunctiveRelief === 'Yes' ? `
   - Injunctive Relief: Acknowledge that breach may cause irreparable harm
   - Right to seek injunctive relief without posting bond
   ` : ''}
   - Damages for breach
   - Specific performance

10. **NO WARRANTY**
    - Information provided "as is"
    - No warranty of accuracy or completeness
    - No obligation to enter into further agreements

11. **NON-SOLICITATION (Optional but recommended)**
    - Non-solicitation of employees/consultants
    - Duration: Typically same as confidentiality duration

12. **GENERAL PROVISIONS**
    - Governing Law: ${formData.governingLaw}
    - Jurisdiction: ${formData.jurisdiction}
    - Entire Agreement
    - Amendment (must be in writing)
    - Severability
    - Waiver
    - Notices (address for notices)
    - Counterparts

13. **EXECUTION**
    - Signature blocks for both parties
    - Name, title, date for authorized signatories
    ${formData.ndaType === 'Mutual' ? '- Ensure both parties sign in their dual capacity' : ''}

**SPECIFIC DRAFTING GUIDELINES FOR NDA:**

1. **Precision in Definition:** Be extremely precise in defining "Confidential Information"
2. **Reasonable Restrictions:** Ensure restrictions are reasonable and not overly broad
3. **Clear Duration:** Specify exact duration (e.g., "3 years from date of disclosure" not just "3 years")
4. **Remedies:** Clearly state available remedies including equitable relief
5. **Practical Enforceability:** Ensure all provisions are practically enforceable
6. **Mutual Fairness:** ${formData.ndaType === 'Mutual' ? 'Ensure equal obligations on both parties' : 'Balance protection with reasonable obligations'}

**INDIAN LAW SPECIFIC CONSIDERATIONS:**

1. **Stamp Duty:** Note that this document may require stamp duty (varies by state)
2. **Section 27 of Contract Act:** Ensure non-compete provisions (if any) don't violate restraint of trade
3. **Injunctive Relief:** Reference Specific Relief Act, 1963, Section 38
4. **Governing Law:** Specify which state's laws apply if within India
5. **Arbitration:** Consider including arbitration clause under Arbitration and Conciliation Act, 1996

Generate the complete NDA now as pure HTML, ensuring all above requirements are met.
`;
};
