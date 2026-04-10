// Minutes of Board Meeting Prompt Template
// Compliant with Section 118 of Companies Act, 2013 and SS-1

export const generateMinutesBoardMeetingPrompt = (formData: any): string => {
    const data = {
        company_details: {
            name: formData.companyName,
            cin: formData.cin,
            registered_office: formData.registeredOffice
        },
        meeting_date: formData.meetingDate,
        meeting_time: formData.meetingTime,
        meeting_venue: formData.meetingVenue,
        directors_present: (formData.directorsPresent || '').split(',').map((s: string) => s.trim()).filter((s: string) => s !== ''),
        directors_on_leave: (formData.directorsOnLeave || '').split(',').map((s: string) => s.trim()).filter((s: string) => s !== ''),
        directors_absent: (formData.directorsAbsent || '').split(',').map((s: string) => s.trim()).filter((s: string) => s !== ''),
        chairperson_name: formData.chairpersonName,
        agenda_items: formData.resolutionsPassed ? formData.resolutionsPassed.split('\n').filter((item: string) => item.trim() !== '').map((item: string) => ({
            title: item.split('.')[0] || 'Agenda Item',
            resolution_text: item
        })) : [],
        interested_directors: formData.interestedDirectors,
        conclusion_time: formData.conclusionTime,
        authorized_signatory: formData.authorizedSignatory,
        additional_notes: formData.otherBusiness
    };

    return JSON.stringify(data, null, 2);
};
