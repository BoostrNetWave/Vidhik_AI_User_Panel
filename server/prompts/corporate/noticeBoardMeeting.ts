// Notice of Board Meeting Prompt Template
// Compliant with Section 173 of Companies Act, 2013 and SS-1

export const generateNoticeBoardMeetingPrompt = (formData: any): string => {
    const data = {
        company_name: formData.companyName,
        cin: formData.cin,
        registered_office: formData.registeredOffice,
        notice_date: formData.noticeDate || new Date().toLocaleDateString('en-IN'),
        meeting_date: formData.meetingDate,
        meeting_day: formData.meetingDay,
        meeting_time: formData.meetingTime,
        meeting_venue: formData.meetingVenue,
        mode_of_meeting: formData.modeOfMeeting || (formData.virtualOption ? 'virtual' : 'physical'),
        directors_list: formData.directorsList,
        agenda_items: formData.agenda ? formData.agenda.split('\n').filter((item: string) => item.trim() !== '') : [],
        issuing_authority_name: formData.issuingAuthorityName,
        issuing_authority_designation: formData.issuingAuthorityDesignation
    };

    return JSON.stringify(data, null, 2);
};
