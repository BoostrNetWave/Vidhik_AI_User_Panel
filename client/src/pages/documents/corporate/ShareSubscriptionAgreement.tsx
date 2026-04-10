import DocumentBaseGenerator from '../DocumentBaseGenerator';
import { ShareSubscriptionForm } from './ShareSubscriptionForm';

export default function ShareSubscriptionAgreement() {
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const initialFormData = {
        companyName: 'NexGen Robotics Technologies Pvt Ltd',
        jurisdiction: 'Maharashtra, India',
        investorName: 'Blue Chip Ventures LLP',
        investorType: 'Institutional',
        shareClass: 'CCPS',
        numberOfShares: '5000',
        pricePerShare: '2000',
        closingDate: nextMonth,
        preMoneyValuation: '40,00,00,000'
    };

    const sidebarTips = [
        { title: "Subscription vs SHA", content: "A Subscription Agreement handles the issuance and payment for shares, while a Shareholders Agreement (SHA) governs the relationship and rights between shareholders." },
        { title: "Valuation Cap", content: "Ensure the price per share matches the valuation report (Rule 11UA for Income Tax) to avoid tax implications for the company." },
        { title: "Conditions Precedent", content: "Commonly referred to as CPs—items the company must complete before the investor is obligated to wire the funds." },
        { title: "Stamp Duty", content: "Issuance of share certificates usually attracts stamp duty within 30-60 days; this agreement should mention who bears the cost." }
    ];

    return (
        <DocumentBaseGenerator
            title="Share Subscription Agreement (SSA)"
            description="Professional equity issuance agreement for investors and companies"
            documentType="share-subscription"
            initialFormData={initialFormData}
            docxFilename="share-subscription-agreement.docx"
            sidebarDescription="Close your funding round with a robust, legally sound SSA that defines investment terms, warranties, and closing conditions."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <ShareSubscriptionForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
