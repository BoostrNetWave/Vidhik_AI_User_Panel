import mongoose, { Schema, Document } from 'mongoose';

export interface IResearch extends Document {
    query: string;
    answer: string;
    title: string;
    category: string;
    createdAt: Date;
}

const ResearchSchema: Schema = new Schema({
    query: { type: String, required: true },
    answer: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'General Research' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IResearch>('Research', ResearchSchema);
