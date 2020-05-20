const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// Getting environment variables
dotenv.config({ path: './config.env' });

const app = require('./app');

// Connecting database
const DB = process.env.DATABASE_LOCAL.replace(
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

// Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

/*
In mongo shell
Server - mongo "mongodb+srv://cluster0-ta2cm.mongodb.net/test"  --username dev
Local - mongod and mongo

In application
Server - mongodb+srv://dev:<PASSWORD>@cluster0-ta2cm.mongodb.net/natours?retryWrites=true&w=majority
Local - mongodb://localhost:27017/natours

In mongo compass
Server - mongodb+srv://dev:<password>@cluster0-ta2cm.mongodb.net/natours
Local - mongodb://127.0.0.1:27017

mongoose.connect(DB,{ }) - object to avoid warning
It will return promise and then method have access to connection object
con.connections
*/
