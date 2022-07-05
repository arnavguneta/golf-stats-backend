const mongoose = require('mongoose')

// Command to start db: /mnt/c/Users/arnav/mongodb/bin/mongod.exe --dbpath=C:/Users/arnav/mongodb-data
console.log(process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL).catch((error) => {console.log(error)})