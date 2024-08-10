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

// Create a model based on the schema
const Trade = mongoose.model('Trade', TradeSchema);
exports.Trade = Trade;