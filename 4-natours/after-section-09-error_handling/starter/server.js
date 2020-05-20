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

/*
Node Debugger
npm i ndb
*/

/*
Undefined Routes
If we want to handle all the undefined routes we would define that route in the end of all the routes

Also route should be for every noun(url) and every verb(http method)

app.all('*')
* is for every noun (url)
all is for every verb (http method)
*/

/*
In app.js module we cann't log directly and expect it to run every time request is done
As it is wrapped and imported to server.js module
and app.js module will be loaded only once into server.js module

req.originalUrl
req.url

If code is able to reach at this point it means request response cycle has not yet finished
Middleware are added to middlestack in order they are defined in code
*/

/*
Recording videos
Use screenCast Mode
WordWarp is quite handy
*/
/*
Operational Errors
Problem that we can predict will happen at some point, so we need to handle them in advance
ex - 
Invalid path accessed 
Invalid user input
(validator error in mongoose)
Failed to connect server,database
Request Timeout

Programming Error
Bugs developer introduce to code
ex - 
Reading properties of undefined
Passing invalid objects
Using await without async
*/

/*
Error Handling Middleware for Operational Errors

Passing three argument it is predicted as middleware 
req,res,next

Passing four argument it is predicted as error handler
err,req,res,next

In error handler we will use 
err.statusCode
err.status
which will be set explicity while creating new Error()

and err.message will be implicit in new Error(message)

we will use next(error) and pass argument ie if next(error) is called with argument then express automatically know that there was error

In error handling middleware we will not call next() as res will be send

err.stack will give stack trace  of the error

Also if we want to preserve stack and not add our own Error Class into
that stack trace

Error.capturestackTrace(this,this.constructor)

This function call of appError will not pollute stack Trace

Also we put global Error handler into controller
*/
/*
Whenever we need error we will use next() and error as object 
which will be identified by express app that we to call errorController
global error handler

appError will create error for app
and set message, status and statusCode which will be passed to the errorController global error handler

errorController will execute middleware (err,req,res,next)
which will then send response as error and end request-reponse cycle
*/
/*
Error handling in async-await
Wrapping async function of controller into catchAsync

catchSync in Utils will return function that will be executed 
when we hit route
as it is an asycn function it will return promise and we can then attach catch on it and call next 
ie why we also need to pass next into the every async function 

Also however here we are not using next() and passing appError 
which will done be done
*/
/*
Production vs Development
This logic can be implemented in errorController global error handler which we are always caling by next(err)

isOperational - every error generated using appError class is operational error and in production mode it should not leak data
into client

Mongoose validator error doesn't have isOperational
Get tour with invalid id
Create new tour validator error

We will then return Error created by appError Class 

To loop over values of objects
Object.values(obj)
*/
/*
Error Outside Express
Unhandled Promise Rejections
Simply chain .then().catch()

Handling unhandled rejection promises globally 

Each time there is unhandled rejection promises in application or in nodejs
process object will emit an object called unhandled rejection 

process.on('unhandledRejection',callback)
ex - Mongodb database connection

In that case we use process.exit(1)
0 - success
1 -  Uncaught Exception

Also we use server.close(()=> process.exit(1))
as it will give server time to process pending request at that time

*/
/*
Now all async code error has been handled 
About sync code
Catching Uncaught Exceptions
All error and bug which are not handled anywhere

process.on('uncaughtException',callback)
*/
/*
In case of unhandledRejection
process.exit(1) is not mandatory
however in uncaughtException
we need to exit() process as it is in unclean state
Also uncaughtException should be at top as to start listening even before any error occur

In case uncaughtException is in express middleware 
then express automatically goes to error handler middleware
*/
