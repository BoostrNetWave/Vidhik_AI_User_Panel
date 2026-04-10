
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function DocumentGenerationPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Generic Document Generator</h1>
                <p className="text-gray-600 mb-8">
                    This is a generic placeholder. Please select a specific document template from the hub.
                </p>
                <Button
                    onClick={() => navigate('/document-generator')}
                    className="w-full gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Templates
                </Button>
            </div>
        </div>
    );
}
