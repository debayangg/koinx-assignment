const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { handleData, checkBalance } = require('../utils/utils');
const multer = require('multer');
const { Readable } = require('stream');

const router = new express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to serve the index.html file
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Endpoint to upload a CSV file and analyze its contents
router.post('/analyse-csv', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        if (req.file.mimetype !== 'text/csv') {
            return res.status(400).json({ message: 'Invalid file type' });
        }
        const results = [];
        const fileStream = Readable.from(req.file.buffer);

        fileStream
            .pipe(csv())
            .on('data', (data) => {
                handleData(data);
                results.push(data);
            })
            .on('end', () => {
                res.json({ result: results });
            })
            .on('error', (err) => {
                res.status(500).json({ error: 'Failed to parse CSV file', details: err.message });
            });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});

// Endpoint to get the balance of a user at a specific timestamp
router.post('/get-balance', async (req, res) => {
    try{
        if(!req.body.hasOwnProperty('timestamp')) {
            return res.status(400).json({ error: 'Missing timestamp property' });
        }
        if(isNaN(Date.parse(req.body.timestamp))) {
            return res.status(400).json({ error: 'Invalid timestamp' });
        }
        let utcTime = new Date(req.body.timestamp);
        const balance = await checkBalance(utcTime);
        return res.json(balance);
    } catch(error){
        return res.status(500).json({ error: 'An error occurred', details: error.message });
    }
});



module.exports = router;
