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

            userBalance = await Balance.find({
                userId: record['User_ID'] , 
                currency: record['Market'].split('/')[0] 
            });
            if (userBalance.length === 0) {
                const newBalance = new Balance({
                    userId: record['User_ID'],
                    currency: record['Market'].split('/')[0],
                    balance: parseFloat(record['Buy/Sell Amount']),
                    utcTime: new Date(record['UTC_Time'])
                });
                await newBalance.save();
            } else {
                const updatedBalance = userBalance.pop();
                if (record['Operation'] === 'BUY') {
                    updatedBalance.balance += parseFloat(record['Buy/Sell Amount']);
                }
                else {
                    updatedBalance.balance -= parseFloat(record['Buy/Sell Amount']);
                }
                updatedBalance.utcTime = new Date(record['UTC_Time']);
                await updatedBalance.save();
            }

        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};

// Function to check the balance of a user at a specific timestamp
const checkBalance = async (utcTime) => {
    try {
        const latestBalances = await Balance.find({ utcTime: { $lte: utcTime } }).sort({ utcTime: -1 });

        if (!latestBalances) {
            return {};
        }

        let result = {};
        for (let i = 0; i < latestBalances.length; i++) {
            if(!result.hasOwnProperty(latestBalances[i].currency)) {
                result[latestBalances[i].currency] = latestBalances[i].balance;
            }
        }

        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        return {}; 
    }
};

module.exports = { handleData, checkBalance };