// Shareholder Resolution Prompt Template
// Compliant with Companies Act, 2013 (India)

export const generateShareholderResolutionPrompt = (formData: any): string => {
    const data = {
        company_name: formData.companyName,
        cin: formData.cin,
        registered_office: formData.registeredOffice,
        meeting_type: formData.meetingType,
        meeting_date: formData.meetingDate,
        meeting_time: formData.meetingTime,
        meeting_venue: formData.meetingVenue,
        quorum_present: formData.quorumPresent ?? true,
        resolution_type: formData.resolutionType,
        subject_matter: formData.subjectMatter,
        statutory_reference: formData.statutoryReference,
        resolution_text_details: formData.resolutionDetails,
        authorized_person_details: formData.authorizedPersonDetails,
        certification_signatory: formData.certificationSignatory,
        place_of_signing: formData.placeOfSigning
    };

    return JSON.stringify(data, null, 2);
};
