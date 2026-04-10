import DocumentBaseGenerator from '../DocumentBaseGenerator';
import { BoardResolutionForm } from './BoardResolutionForm';

export default function BoardResolutionAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        companyName: 'NexGen Robotics Technologies Pvt Ltd',
        cin: 'U72900KA2023PTC198273',
        registeredOffice: 'No. 42, 4th Floor, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059',
        meetingDate: today,
        meetingTime: '11:00 AM',
        meetingLocation: 'Registered Office at Mumbai',
        meetingPlaceType: 'Physical',
        quorumPresent: true,
        resolutionSubject: 'Opening of Corporate Bank Account',
        resolutionDetails: 'The Board discussed the requirement of opening a new current account for the company\'s operations in Gujarat and decided to approach HDFC Bank for the same.',
        chairpersonName: 'Anand Sharma',
        directorsPresent: 'Anand Sharma, Rahul Varma, Aditi Nair',
        bankName: 'HDFC Bank',
        bankBranchAddress: 'GIFT City, Gandhinagar, Gujarat',
        accountType: 'Current Account',
        modeOfOperation: 'Severally',
        authorizedSignatoriesText: 'Rahul Varma (Director, DIN: 09871234), Aditi Nair (Director, DIN: 07654321)',
        certificationSignatoryDetails: 'Anand Sharma (Director, DIN: 08765432)'
    };

    const sidebarTips = [
        { title: "Circular vs Meeting", content: "A Board Meeting requires physical or video presence. A Circular Resolution is passed by sending the draft to all directors for signature without a formal meeting." },
        { title: "Certified True Copy", content: "Most banks and government bodies require a 'Certified True Copy' of the resolution signed by the Chairman or Company Secretary." },
        { title: "Quorum", content: "Ensure that the number of directors present meets the minimum quorum (generally 1/3rd or 2 directors, whichever is higher) as per the Companies Act." },
        { title: "Resolution Format", content: "Resolutions must start with 'RESOLVED THAT' followed by the specific decision, and then 'RESOLVED FURTHER THAT' for authorizations." }
    ];

    return (
        <DocumentBaseGenerator
            title="Board Resolution"
            description="Official corporate documentation for board-level decisions"
            documentType="board-resolution"
            initialFormData={initialFormData}
            docxFilename="board-resolution.docx"
            sidebarDescription="Generate legally compliant board resolutions with proper statutory phrasing and 'Certified True Copy' formatting."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <BoardResolutionForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
