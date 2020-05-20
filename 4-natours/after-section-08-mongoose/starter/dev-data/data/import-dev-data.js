const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

// Getting environment variables
dotenv.config({ path: './config.env' });

// Connecting database
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then((con) => {
        // console.log(con.connections);
        console.log('DB connection successful');
    });

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Import data into DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded !');
    } catch (err) {
        console.log('Error : ', err);
    }
    process.exit();
};

// Detele all data from DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted !');
    } catch (err) {
        console.log('Error : ', err);
    }
    process.exit();
};

console.log(process.argv);
if (process.argv[process.argv.length - 1] === '--import') importData();
if (process.argv[process.argv.length - 1] === '--delete') deleteData();
// deleteData();
// importData();
/*
Here we are not calling it from this file only

as require('mongoose') and require('dotenv') will then not be able to work
as it need to be run where application is present
so go to starter 
node dev-data/data/import-dev-data.js


In file system ./ will mean starter
ie why we use ${__dirname}

However in require() ./ will mean this current directory

*/
/*
process.argv contain

dirname of node 
current dirname

Using process.argv to specify import or delete

node dev-data/data/import-dev-data.js --import
node dev-data/data/import-dev-data.js --delete 
*/
