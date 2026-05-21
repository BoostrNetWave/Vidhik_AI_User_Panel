import mongoose, { Schema, Document } from 'mongoose';

/**
 * SystemConfig Model
 * -------------------
 * This is the central "Brain" for the Super Admin Panel.
 * It allows the admin to update website content, fees, and rules
 * without touching a single line of code.
 */

export interface ISystemConfig extends Document {
    key: string;            // The unique name of the setting (e.g. "LANDING_HERO_TITLE")
    value: any;             // The actual content (string, number, or object)
    category: 'landing' | 'lawyer_panel' | 'user_panel' | 'payments' | 'system';
    description: string;    // Human-readable description for the Super Admin UI
    updatedAt: Date;
}

const SystemConfigSchema: Schema = new Schema({
    key: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    value: { 
        type: Schema.Types.Mixed, 
        required: true 
    },
    category: { 
        type: String, 
        enum: ['landing', 'lawyer_panel', 'user_panel', 'payments', 'system'],
        required: true 
    },
    description: { 
        type: String,
        default: '' 
    }
}, { 
    timestamps: true 
});

const SystemConfig = mongoose.model<ISystemConfig>('SystemConfig', SystemConfigSchema);

export default SystemConfig;
