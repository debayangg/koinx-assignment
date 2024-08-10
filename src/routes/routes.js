const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { handleData, checkBalance } = require('../utils/utils');

const router = new express.Router();

// Endpoint to analyze a locally stored CSV file
router.get('/analyze-csv', (req, res) => {
    try {
        const filePath = path.resolve(__dirname, 'file.csv');

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        let results = [];
        fs.createReadStream(filePath)
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
