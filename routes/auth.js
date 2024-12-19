const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password, interests, bio } = req?.body || {};

    // Input validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all required fields' });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.',
        });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    try {
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profilePicture: 'default-profile-pic.jpg',
            interests: interests || [],
            bio: bio || '',
        });

        // Save the new user
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully!',
            user: {
                name: newUser.name,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
                interests: newUser.interests,
                bio: newUser.bio,
            },
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req?.body || {};
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'JWT secret is not defined in the environment variables' });
    }

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Check if user exists
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set token in cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
        });

        // Respond with user info
        res.json({
            message: 'Login successful!',
            user: {
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                interests: user.interests,
                bio: user.bio,
                token,
                userId: user._id,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});


router.post("/logout", (req, res) => {
    // Clear the JWT token cookie
    res.clearCookie("token", { httpOnly: true, secure: true });
    return res.json({ message: "Logged out successfully" });
});


router.post("/isauth", (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
   
    const JWT_SECRET =  process.env.JWT_SECRET; 
   

    if (!token) {
        return res.status(401).json({ message: 'No token provided. Please log in.' });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Send the token as a cookie and user data in the response
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3600000,  
            sameSite: 'None', 
        });

        // You can send the user data along with the response
        return res.status(200).json({
            message: 'Authentication successful',
            user: decoded // decoded data should contain the user information
        });
    });
});

module.exports = router;
