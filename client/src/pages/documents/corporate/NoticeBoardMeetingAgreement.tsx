import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import NoticeBoardMeetingForm from './NoticeBoardMeetingForm';

const NoticeBoardMeetingAgreement: React.FC = () => {
    const initialData = {
        companyName: '',
        meetingDate: '',
        meetingTime: '',
        meetingVenue: '',
        agenda: '',
        virtualOption: false
    };

    const sidebarTips = [
        { title: "Statutory Requirement", content: "Section 173(3) requires every board meeting to be called by giving at least 7 days' notice." },
        { title: "Agenda", content: "While not explicitly mandated by Sec 173, SS-1 requires the agenda to be sent at least 7 days before the meeting." },
        { title: "Virtual Meetings", content: "Directors can participate via video call. The notice must specify the options for such participation." },
        { title: "Shorter Notice", content: "To transact urgent business, a meeting may be called at shorter notice if at least one independent director is present." },
        { title: "Mode of Delivery", content: "Notice must be delivered by hand, post, or electronic means (Email)." }
    ];

    return (
        <DocumentBaseGenerator
            title="Notice of Board Meeting"
            description="Official notice to directors for calling a meeting of the Board of Directors."
            documentType="notice-board-meeting"
            initialFormData={initialData}
            docxFilename="notice-board-meeting.docx"
            sidebarDescription="A formal notice is a statutory requirement before any valid Board Meeting can take place."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <NoticeBoardMeetingForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
};

export default NoticeBoardMeetingAgreement;
