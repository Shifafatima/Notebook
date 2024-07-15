const mongoose=require('mongoose');

const mongoURI="mongodb://localhost:27017/iNotebook"

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

module.exports=connectToMongo
