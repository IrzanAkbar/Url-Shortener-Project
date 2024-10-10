const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Zann:cKM64lhUbwA5CMDj@cluster0.vkr0w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
