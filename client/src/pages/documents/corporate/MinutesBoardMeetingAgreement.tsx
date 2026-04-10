import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import MinutesBoardMeetingForm from './MinutesBoardMeetingForm';

const MinutesBoardMeetingAgreement: React.FC = () => {
    const initialData = {
        companyName: '',
        cin: '',
        registeredOffice: '',
        meetingNumber: '',
        meetingDate: '',
        meetingTime: '',
        meetingVenue: '',
        chairpersonName: '',
        directorsPresent: '',
        directorsAbsent: '',
        invitees: '',
        resolutionsPassed: '',
        otherBusiness: '',
        nextMeetingInfo: ''
    };

    const sidebarTips = [
        { title: "Statutory Requirement", content: "Section 118 of the Companies Act, 2013 requires every company to cause minutes of the proceedings of every board meeting to be prepared and signed." },
        { title: "Timeline", content: "Minutes should be recorded in the Minutes Book within 30 days of the conclusion of the meeting." },
        { title: "Secretarial Standard-1", content: "SS-1 provides detailed guidance on the format and content of board meeting minutes, including attendance and resolution details." },
        { title: "Signing", content: "Minutes must be signed and dated by the Chairman of the meeting or the Chairman of the next meeting." },
        { title: "Preservation", content: "Minutes of all meetings must be preserved permanently in physical or electronic form with Timestamp." }
    ];

    return (
        <DocumentBaseGenerator
            title="Minutes of Board Meeting"
            description="Official record of proceedings and resolutions passed during a meeting of the Board of Directors."
            documentType="minutes-board-meeting"
            initialFormData={initialData}
            docxFilename="minutes-board-meeting.docx"
            sidebarDescription="Minutes serve as the official legal record of board decisions and are critical for corporate compliance."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <MinutesBoardMeetingForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default MinutesBoardMeetingAgreement;
