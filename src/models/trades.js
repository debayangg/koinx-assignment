const mongoose = require('mongoose');

// Schema for the Trade 
const TradeSchema = new mongoose.Schema({
    userId: Number,
    utcTime: Date,
    operation: String,
    market: String,
    buy: String,
    sell: String,
    amount: Number,
    price: Number
});

// Schema for the Balance at a specific timestamp for a currency
const BalanceSchema = new mongoose.Schema({
    userId: Number,
    currency: String,
    balance: Number,
    utcTime: Date
});

// Create a model based on the schema
const Trade = mongoose.model('Trade', TradeSchema);
const Balance = mongoose.model('Balance', BalanceSchema);
exports.Trade = Trade;
exports.Balance = Balance;