import React from 'react';

// --- CONSTANT PREVIEW DESIGN CONFIGURATION ---
// These styles define the "Premium A4 Paper" look and should remain constant
// to maintain professional document presentation.
export const PREVIEW_DESIGN = {
    // Outer container: Desktop-like surface with radial grid
    container: "w-full bg-slate-200/50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] py-16 px-4 min-h-[800px] flex justify-center",

    // The "Paper": A4 dimensions with professional drop shadow
    paper: "bg-white shadow-[0_10px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-[210mm] min-h-[297mm] p-[25.4mm] mx-auto",

    // Typography: Legal-grade serif settings
    typography: "prose max-w-none font-['Lora',serif] text-slate-900",

    // Heading & Paragraph overrides
    proseStyles: "prose-headings:text-black prose-headings:font-['Lora',serif] prose-headings:font-bold " +
        "prose-h1:text-3xl prose-h1:mb-12 prose-h1:text-center prose-h1:uppercase prose-h1:tracking-[0.2em] " +
        "prose-h2:text-xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:uppercase prose-h2:tracking-widest prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-3 " +
        "prose-h3:text-lg prose-h3:mt-10 prose-h3:mb-6 " +
        "prose-p:mb-8 prose-p:leading-[1.8] prose-p:text-justify " +
        "prose-ul:ml-8 prose-ol:ml-8 prose-li:mb-3"
};

interface DocumentPreviewProps {
    content: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ content }) => {
    return (
        <div id="document-preview-content" className={PREVIEW_DESIGN.container}>
            <div
                className={`${PREVIEW_DESIGN.paper} ${PREVIEW_DESIGN.typography} ${PREVIEW_DESIGN.proseStyles}`}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};
