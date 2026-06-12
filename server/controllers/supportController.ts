import { Response } from 'express';
import SupportTicket from '../models/SupportTicket';

/**
 * Create a new support ticket
 */
export const createSupportTicket = async (req: any, res: Response) => {
    try {
        const { subject, category, priority, description } = req.body;
        const userId = req.user._id;

        if (!subject || !description) {
            return res.status(400).json({
                error: 'Missing fields',
                message: 'Subject and description are required.'
            });
        }

        // Generate a random ticket ID like TKT-123456
        const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

        const newTicket = new SupportTicket({
            ticketId,
            userId,
            subject,
            category: category || 'General',
            priority: priority || 'Medium',
            description,
            status: 'Open'
        });

        const savedTicket = await newTicket.save();

        res.status(201).json({
            success: true,
            message: 'Support ticket submitted successfully.',
            data: savedTicket
        });
    } catch (error: any) {
        console.error('[Create Support Ticket] Error:', error);
        res.status(500).json({
            error: 'Failed to create support ticket',
            message: error?.message || 'Unknown error'
        });
    }
};

/**
 * Get all support tickets submitted by the logged-in user
 */
export const getUserSupportTickets = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        const tickets = await SupportTicket.find({ userId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: tickets
        });
    } catch (error: any) {
        console.error('[Get Support Tickets] Error:', error);
        res.status(500).json({
            error: 'Failed to fetch support tickets',
            message: error?.message || 'Unknown error'
        });
    }
};
