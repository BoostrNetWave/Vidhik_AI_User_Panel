import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    documentType: {
        type: String,
        required: true
    },
    content: {
        type: String, // HTML/Rich Text content
        required: true
    },
    formData: {
        type: Object, // Store the inputs used to generate this document
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'final', 'archived', 'trash'],
        default: 'draft'
    },
    analysisResults: {
        type: Object, // Stores AI analysis report
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
