const mongoose = require('mongoose');

const dbString = process.env.MONGO_URI

mongoose.connect(dbString)
.then(()=>{
    console.log('Connected to mongodb...');
})
.catch((err)=>{
    throw err;
})
