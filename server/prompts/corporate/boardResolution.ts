// Board Resolution Prompt Template
// For corporate board decisions and resolutions

export const generateBoardResolutionPrompt = (formData: any): string => {
   const data = {
      company_name: formData.companyName,
      cin: formData.cin,
      registered_office: formData.registeredOffice,
      meeting_date: formData.meetingDate,
      meeting_time: formData.meetingTime,
      meeting_place: formData.meetingLocation,
      quorum_present: formData.quorumPresent ?? true,
      resolution_subject: formData.resolutionSubject,
      resolution_details: formData.resolutionDetails || formData.bankName ? `Opening of bank account with ${formData.bankName}, ${formData.bankBranchAddress}` : '',
      authorized_person_name: formData.authorizedSignatoriesText?.split(',')[0]?.trim() || '',
      authorized_person_designation: 'Director',
      certification_signatory: formData.certificationSignatoryDetails?.split('(')[0]?.trim() || '',
      certification_designation: formData.certificationSignatoryDetails?.match(/\(([^)]+)\)/)?.[1] || 'Director',
      additional_authorizations: formData.authorizedSignatoriesText
   };

   return JSON.stringify(data, null, 2);
};
