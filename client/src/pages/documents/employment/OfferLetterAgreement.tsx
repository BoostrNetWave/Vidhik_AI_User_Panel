import DocumentBaseGenerator from '../DocumentBaseGenerator';
import { OfferLetterForm } from './OfferLetterForm';

export default function OfferLetterAgreement() {
    const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const initialFormData = {
        candidateName: 'Aditi Nair',
        candidateAddress: 'Flat 405, Skyview Residency, Whitefield, Bangalore, Karnataka 560066',
        position: 'Senior UI/UX Designer',
        department: 'Product Design',
        reportingManager: 'Vikas Mehta (Head of Design)',
        joiningDate: oneMonthLater,
        salary: '₹22,00,000 (Twenty-Two Lakhs) per annum CTC',
        expiryDate: twoWeeksLater,
        probationPeriod: '6 Months',
        noticePeriod: '60 Days',
        workLocation: 'Bangalore Office (Hybrid - 3 days in office)',
        companyName: 'Vidhik AI Technologies Pvt Ltd',
        companyAddress: 'Level 4, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059'
    };

    const sidebarTips = [
        { title: "Offer vs Contract", content: "An offer letter is a formal intent to hire. It's usually followed by a detailed Employment Agreement on the day of joining." },
        { title: "CTC Transparency", content: "Clearly state if the salary is 'Cost to Company' (CTC) or 'Gross Salary' to avoid ambiguity during joining." },
        { title: "Subject to BGV", content: "Always mention that the offer is contingent upon successful background verification and submission of relieving letters." },
        { title: "Validity Period", content: "Typically, an offer should be valid for 3-7 days to encourage timely decision-making from high-quality candidates." }
    ];

    return (
        <DocumentBaseGenerator
            title="Job Offer Letter"
            description="Professional job offer communication for prospective employees"
            documentType="offer-letter"
            initialFormData={initialFormData}
            docxFilename="job-offer-letter.docx"
            sidebarDescription="Attract top talent with a professional, clear, and legally sound offer letter that highlights all key benefits and expectations."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <OfferLetterForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
