import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password, role } = req.body;
        console.log(`[REGISTER] Attempt for email: ${email}, role: ${role}`);

        if (!fullName || !email || !password) {
            console.log(`[REGISTER] Missing fields`);
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            role: role || 'user'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                userId: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString())
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        console.error('[REGISTER] Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password as string);

        if (isPasswordValid) {
            res.json({
                _id: user._id,
                userId: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString())
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (Needs token - for now handled via userId in body for simplicity as requested 'one by one')
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { userId, fullName, email, phone, designation, location } = req.body;
        console.log(`[UPDATE PROFILE] Attempt for userId: ${userId}`);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (designation) user.designation = designation;
        if (location) user.location = location;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser.id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phone: updatedUser.phone || '',
            designation: updatedUser.designation || '',
            location: updatedUser.location || '',
            token: generateToken(updatedUser.id)
        });

    } catch (error: any) {
        console.error('[UPDATE PROFILE] Error:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
