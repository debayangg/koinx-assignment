const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env file

const { MONGO_USER, MONGO_PASS, MONGO_DBNAME, MONGO_CLUSTER } = process.env;

// Construct the MongoDB URI
const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${MONGO_DBNAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected successfully')
})
.catch((error) => {
    console.error('Error connecting to MongoDB', error);
});