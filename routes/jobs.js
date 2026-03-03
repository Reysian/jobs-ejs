const express = require('express');
const router = express.Router();
const {
    getAllJobs,
    addJob,
    createJob,
    getJob,
    updateJob,
    deleteJob
} = require('../controllers/jobs');

// Display all job listings belonging to this user
router.get('/', getAllJobs);

// Add a new job listing
router.post('/', addJob);

// Put up the form to create a new entry
router.get('/new', createJob);

// Get a particular entry and show it in the edit box
router.get('/edit/:id', getJob);

// Update a particular entry
router.post('/update/:id', updateJob);

// Delete an entry
router.post('/delete/:id', deleteJob);

module.exports = router;