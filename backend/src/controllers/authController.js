const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
    static async register(req, res) {
        try {
            const { email, password, name } = req.body;

            // Validate input
            if (!email || !password || !name) {
                return res.status(400).json({
                    error: 'Email, password and name are required'
                });
            }

            // Check if user exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    error: 'Email already registered'
                });
            }

            // Create user
            const user = await User.create(email, password, name);

            // Generate token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            });

        } catch (error) {
            console.error('[AUTH] Register error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email and password are required'
                });
            }

            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            // Validate password
            const isValidPassword = await User.validatePassword(user, password);
            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            // Generate token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            });

        } catch (error) {
            console.error('[AUTH] Login error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            res.json({ user });

        } catch (error) {
            console.error('[AUTH] Get profile error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}

module.exports = AuthController;