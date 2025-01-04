const mongoose = require('mongoose');

const dbString = process.env.DB_STRING

mongoose.connect(dbString)
.then(()=>{
    console.log('Connected to mongodb...');
})
.catch((err)=>{
    throw err;
})
