const express = require('express');
const router = express.Router();
const snippetModel = require('../models/Snippet');
const isAuthenticated = require("../middlewares/isAuthenticated");

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

     

        // Convert page and limit to numbers
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

       
        // Paginate results
        const snippets = await snippetModel
            .find()
            .populate("createdBy", "name")
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ createdAt: -1 }); // Sorting by newest first

        // Get total count for pagination
        const totalSnippets = await snippetModel.countDocuments();

        res.status(200).json({
            snippets,
            totalSnippets,
            currentPage: pageNum,
            totalPages: Math.ceil(totalSnippets / limitNum),
        });
    } catch (error) {
        console.error('Error fetching snippets:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/add', isAuthenticated, async (req, res) => {
    
   
    
    try {
        const { title, code, language, description, tags } = req.body;

        // Validate required fields
        if (!title || !code || !language) {
            return res.status(400).json({ message: 'Title, code, and language are required fields.' });
        }

        // Create a new snippet
        const newSnippet = new snippetModel({
            title,
            code,
            language,
            description,
            tags,
            createdBy: req.user.userId, 
            
        });  
        const savedSnippet = await newSnippet.save();

        res.status(201).json({
            message: 'Snippet created successfully.',
            snippet: savedSnippet,
        });
    } catch (error) {
        console.error('Error adding snippet:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



module.exports = router;
