import { Request, Response } from 'express';
import SystemConfig from '../models/SystemConfig';
import User from '../models/User';

/**
 * Admin Controller
 * Handles all requests from the Super Admin Panel
 */

// @desc    Get all system configurations
// @route   GET /api/admin/config
export const getConfigs = async (req: Request, res: Response) => {
    try {
        const configs = await SystemConfig.find({});
        res.json(configs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching configurations' });
    }
};

// @desc    Update a specific configuration
// @route   PUT /api/admin/config
export const updateConfig = async (req: Request, res: Response) => {
    try {
        const { key, value } = req.body;
        
        const config = await SystemConfig.findOneAndUpdate(
            { key },
            { value },
            { new: true }
        );

        if (!config) {
            return res.status(404).json({ message: 'Configuration not found' });
        }

        res.json({ message: 'Configuration updated successfully', config });
    } catch (error) {
        res.status(500).json({ message: 'Error updating configuration' });
    }
};

// @desc    Get all users on the platform (Lawyers & Clients)
// @route   GET /api/admin/users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// @desc    Get pending lawyers for approval
// @route   GET /api/admin/pending-lawyers
export const getPendingLawyers = async (req: Request, res: Response) => {
    try {
        const lawyers = await User.find({ role: 'lawyer', isApproved: false }).select('-password');
        res.json(lawyers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending lawyers' });
    }
};

// @desc    Approve a lawyer
// @route   POST /api/admin/approve-lawyer/:id
export const approveLawyer = async (req: Request, res: Response) => {
    try {
        const lawyer = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );

        if (!lawyer) {
            return res.status(404).json({ message: 'Lawyer not found' });
        }

        res.json({ message: 'Lawyer approved successfully', lawyer });
    } catch (error) {
        res.status(500).json({ message: 'Error approving lawyer' });
    }
};

// @desc    Manually verify a user (Email verification)
// @route   POST /api/admin/verify-user/:id
export const verifyUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User verified successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying user' });
    }
};

// @desc    Get all APPROVED lawyers for public list
// @route   GET /api/admin/public/lawyers
export const getPublicLawyers = async (req: Request, res: Response) => {
    try {
        const lawyers = await User.find({ role: 'lawyer', isApproved: true }).select('-password');
        res.json(lawyers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lawyers' });
    }
};
