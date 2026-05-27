import { Response } from 'express';
import Case from '../models/Case';
import User from '../models/User';

export const getCasesForClient = async (req: any, res: Response): Promise<void> => {
    try {
        const cases = await Case.find({ client: req.user._id })
            .populate('lawyer', 'fullName email phone location title expertise avatar')
            .sort({ createdAt: -1 });
        res.json(cases);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCaseById = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const kase = await Case.findOne({ _id: id, client: req.user._id })
            .populate('lawyer', 'fullName email phone location title expertise avatar');

        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }
        res.json(kase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const approvePlan = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const kase = await Case.findOneAndUpdate(
            { _id: id, client: req.user._id },
            { $set: { planApproved: true } },
            { new: true }
        ).populate('lawyer', 'fullName email phone location title expertise avatar');

        if (!kase) {
            res.status(404).json({ message: 'Case not found' });
            return;
        }

        res.json(kase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const hireLawyer = async (req: any, res: Response): Promise<void> => {
    try {
        const { lawyerId, title, description, totalFee } = req.body;

        if (!lawyerId || !title || !description || !totalFee) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const lawyerUser = await User.findOne({ _id: lawyerId, role: 'lawyer' });
        if (!lawyerUser) {
            res.status(404).json({ message: 'Lawyer not found' });
            return;
        }

        const newCase = await Case.create({
            title,
            description,
            client: req.user._id,
            lawyer: lawyerId,
            totalFee: Number(totalFee),
            currentProgress: 0,
            planSubmitted: false,
            planApproved: false,
            milestones: []
        });

        res.status(201).json(newCase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
