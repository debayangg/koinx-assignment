const Trade = require('../models/trades').Trade;
const Balance = require('../models/trades').Balance;

// Function to handle data from the CSV file and insert it into the database
const handleData = async (record) => {
    try {
            const newTrade = new Trade({
                userId: record['User_ID'],
                utcTime: new Date(record['UTC_Time']), 
                operation: record['Operation'],
                buy: record['Market'].split('/')[0],
                sell: record['Market'].split('/')[1],
                amount: parseFloat(record['Buy/Sell Amount']), 
                price: parseFloat(record['Price']) 
            });
            await newTrade.save();

        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};

// Function to check the balance of a user at a specific timestamp
const checkBalance = async (utcTime) => {
    try {
        const requiredTrades = await Trade.find({ utcTime: { $lte: utcTime }});

        if (!requiredTrades) {
            return {};
        }

        let result = {};
        for (let i = 0; i < requiredTrades.length; i++) {
            if (!result[requiredTrades[i].buy]) {
                result[requiredTrades[i].buy] = 0;
            }
            if(requiredTrades[i].operation === 'Buy') {
                result[requiredTrades[i].buy] += requiredTrades[i].amount;
            }
            else {
                result[requiredTrades[i].buy] -= requiredTrades[i].amount;
            }
        }

        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        return {}; 
    }
};

module.exports = { handleData, checkBalance };