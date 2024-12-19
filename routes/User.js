const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Snippet = require('../models/Snippet'); 

// Route to get user profile and their snippets
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find user by name (case-insensitive match for flexibility)
        const user = await User.findById(id);

        // If user is not found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all snippets created by the user
        const snippets = await Snippet.find({ createdBy: id }).sort({ createdAt: -1 });

        // Prepare public user data
        const publicUserData = {
            name: user.name,
            bio: user.bio,
            profilePicture: user.profilePicture,
            joinDate: user.joinDate,
            totalSnippetsCreated: user.totalSnippetsCreated,
            totalLikes: user.totalLikes,
            interests: user.interests,
        };

        // Send response with user data and snippets
        res.status(200).json({
            user: publicUserData,
            snippets,
        });
    } catch (error) {
        console.error('Error fetching user profile and snippets:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
