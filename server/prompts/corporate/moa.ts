// Memorandum of Association (MOA) Prompt Template
// Compliant with Companies Act, 2013 (India)

export const generateMOAPrompt = (formData: any): string => {
    const data = {
        company_name: formData.companyName,
        company_type: formData.companyType || 'Private',
        registered_state: formData.state,
        main_objects: formData.mainObjects,
        ancillary_objects: formData.ancillaryObjects,
        liability_type: formData.liabilityType || 'limited by shares',
        authorized_share_capital: formData.authorizedCapital,
        number_of_shares: formData.totalShares,
        face_value_per_share: formData.faceValue,
        subscriber_details: typeof formData.subscribers === 'string'
            ? formData.subscribers.split('\n').map((s: string) => ({ details: s.trim() }))
            : formData.subscribers,
        witness_details: formData.witnessDetails || 'As per subscription clause'
    };

    return JSON.stringify(data, null, 2);
};
