import React from 'react';
import DocumentBaseGenerator from '../DocumentBaseGenerator';
import DirectorAppointmentForm from './DirectorAppointmentForm';

const DirectorAppointmentAgreement: React.FC = () => {
    return (
        <DocumentBaseGenerator
            title="Director Appointment Letter"
            description="Formal appointment letter for a new director under Companies Act, 2013."
            documentType="director-appointment"
            initialFormData={{
                companyName: '',
                companyCin: '',
                registeredOffice: '',
                directorName: '',
                directorAddress: '',
                din: '',
                appointmentType: 'Non-Executive',
                designation: '',
                effectiveDate: '',
                termDuration: '',
                remunerationDetails: '',
                boardResolutionDate: '',
                shareholderApprovalRequired: false,
                additionalTerms: ''
            }}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <DirectorAppointmentForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
            sidebarTips={[
                { title: 'DIN Requirement', content: 'Ensure the director has a valid DIN before appointment.' },
                { title: 'Board Approval', content: 'A board resolution must be passed before issuing the letter.' },
                { title: 'Independent Directors', content: 'Need a separate declaration of independence.' }
            ]}
            sidebarDescription="Generate legally compliant appointment letters for Executive, Non-Executive, and Independent Directors."
            docxFilename="Director_Appointment_Letter.docx"
        />
    );
};

export default DirectorAppointmentAgreement;
