/*
Express is minimal node.js framework,a higher level of abstraction

Express contains robust set of features : 
Complex Routing
Easier handling of requests and responses
Middleware
Server-side Rendering

Express allow rapid development of node.js applications

Express makes it easier to organize our application into MVC(Models Views Components) Architecture
*/

// NOTE:
// 3 rd Party Modules (npm)
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware Stack
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// User Middleware
app.use((req, res, next) => {
    console.log('Incoming Request');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

/*
app.get('/', (req, res) => {

  // res.statusCode = 200;
  // res.status(200);

  // res.send('Hello from server side');
  res.status(200).json({
    message: 'Hello from server side!',
    app: 'Natours',
  });
});

app.post('/', (req, res) => {
  res.status(200).send('You can post to this endpoint...');
});
*/

/*
// Get All Tours
app.get('/api/v1/tours', getAllTours);

// Create New Tour
app.post('/api/v1/tours', createNewTour);

// Get Tour By Id
app.get('/api/v1/tours/:id', getTourById);

// Patch Tour By Id
app.patch('/api/v1/tours/:id', updateTourById);

// Delete Tour By Id
app.delete('/api/v1/tours/:id', deleteToursById);
*/

// Routes
// Tours Resource
/*
app.route('/api/v1/tours').get(getAllTours).post(createNewTour);

app.route('/api/v1/tours/:id')
    .get(getTourById)
    .patch(updateTourById)
    .delete(deleteTourById);
*/
// Users  Resource
/*
app.route('/api/v1/users').get(getAllUsers).post(createNewUser);

app.route('/api/v1/users/:id')
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById);
*/

// This middleware work for this url only

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

/*
const app = express()

In http we have to specify get or post requests
In express we have methods for get or post request

Complex routing can be done in url of get or post methods
setting
res.statusCode = 200 in http
res.status(200) in express

Writable stream methods of res object
res.write()
res.end()

res.pipe()

In express
res.send()

To send json we use response header
set its Content-Type : applocation/json
and send json in body with JSON.stringify to javascript object

In express we use res.json()
and pass javascript object
*/

/*
API and Restful API design

API - Application Program Interface
piece of software that can be used by another piece of software, in order to allow application to talk to each other

Web api 
Database - Json Data - API

Appilcation can be 
Nodejs fs or http API's (node APIs - Core node modules)
Browser DOM javascript API
With object oriented programming, when exposing methods to public,we are creating API

Rest architecture
Representational States Transfer - way of building web api's in logical way making them easy to consume

## 1 Separate api into logical resources 

Key abstraction of information in rest is resource
Resources - Object or representation of something that has data associated to it
Any information that can be named can be resource   
ex - tours,users,reviews

## 2 Exposed structured, resource-based URLs(nouns)
http://www.natours.com/addNewTour - Complete is url
/addNewTour - Api endpoint

/getTour
/updateTour
/deleteTour
/getToursByUser
/deleteToursByUser

However this is bad, endpoints should contain only resources(nouns not verbs)
and use http methods for actions(verbs)

## 3 Use http methods(verbs)

/addNewTour - POST /tours
/getTour - GET /tours  
/updateTour - PUT or PATCH /tours
/deleteTour - DELETE /tours
/getToursByUser - GET /users/tours
/deteleToursByUser - DELETE /users/tours
Verb is now associated with http method and we have endpoints as resource nouns only
Use resouces name in plural


GET /tours/tourId
GET /tours/tourName

GET /tours?tourId=&tourName=

GET /users/userId/tours/tourId
DELETE /users/userId/tours/tourId

GET - Read operation on data (Read)
POST - Write operation on data (Create)
PUT - Update client is supposed to send entire updated object (Update)
PATCH - Update client is supposed to send only part of object that has been changed (Update)
DELETE - Delete operation on data (Delete)

Basic CRUD operation Create,Read,Update,Delete

To perform different actions on data reading,writing,updating,deleting
api should use http methods and not urls



## 4 Send data as json
[{
    "id": 5,
    "tourName": "The Park Camper",
    "rating": "4.9",
    "guides": [{
            "name": "Steven Miller",
            "role": "Lead Guide"
        },
        {
            "name": "Lisa Brown",
            "role": "Tour Guide"
        }
    ]
}]
JSON is lightweight data interchange format
Similar to js object

Array of Objects with each object have key-value pair 
Key must be string
Value can be String,Number,Boolean,Objects,Array


Response formatting
Jsend
{
    "status": "success",
    "data": {
            [{
            "id": 5,
            "tourName": "The Park Camper",
            "rating": "4.9",
            "guides": [{
                    "name": "Steven Miller",
                    "role": "Lead Guide"
                },
                {
                    "name": "Lisa Brown",
                    "role": "Tour Guide"
                }
            ]
        }]
    }
}

Wrapping data into additional object is call Enveloping

Jsopn:API
OData Json Protocol

5 Be stateless
All states is handled on the client.This means that each request must contain all the
information necessary to process a certain request.
The server should not have to remember previous requests

State simply refer to piece of data in application thate might change over time
ex - loggedIn,currentPage

GET /tours/nextPage 
state on server side
nextPage = currentPage+1
send(nextPage)

state on client side
GET /tours/pages/pageNo
send(pageNo) 

statelessness and statefulness - Application

*/

/*
app.get('url', (req, res) => {

});
is called route handler in express

In post we have access to req.body which is send by client side
Out of box express don't provide body data on request
We have use middleware - middle of request and response
we consume middleware by app.use()

For req.body we have use middleware express.json()

Use object to assign to merge two objects
const obj = Object.assign(obj1,obj2)

Rsponding to url parameters

Routing to variable
/api/v1/tours/:id
Using colon to specify

And req.params have access to all of these variable defined in url

Using :? for optional params
/api/v1/tours/:id/:x?/:y?

In case routing goes to multiple function 
source code order comes into picture

/api/v1/tours
/api/v1/tours/id?

200 - OK (Read or Update )
201 - Created ( Create )
204 - No Content ( Delete )
404 - Not Found (No CRUD)
500 - Internal Server Error (Not yet implemented)
*/

/*
Middleware and Request Response Cycle

Incoming request to server
(req,res) are generated

Middleware is usually done on req ie parsing of req object 
Everthing is middleware

ex - parsing body,logging,setting headers,route
Middleware Stack
Order of middleware stack is defined by source code order

Each middleware have access to next() to call next middleware from the stack
However,last middleware is always route and it does res.send()

This whole is called request-response cycle

In order to consume middleware app.use()
Always use middleware before route
*/

/*
3rd party Middleware

Logging Middleware
npm i morgan    

HTTP Method - GET,POST,PUT,PATCH..
url 
statusCode 
Time (in ms)
Size of Response (in bytes)
*/

/*
Mouting Multiple Routes

express.Router() to create new router 
and use it as middleware to url

Mouting a new Router on route(url)
*/
/*
Param Middleware
Only run for certain parameters in url

route.param()

*/
/*
Environment variables are global variables which 
defines environment in which node app is running

app.get('env')
env variable is set by express


process.env variable is set by nodejs
comes from process core module

NODE_ENV is needed by express
NODE_ENV define whether we are in development or production mode
*/
/*
Eslint + Prettier

eslint - show errors and format code 
prettier - format code
eslint-config-prettier - disable formatting for eslint
eslint-plugin-prettier - eslint show formatting error using prettier
eslint-config-airbnb - style guide
eslint-plugin-node - specific eslint rules for nodejs

eslint-plugin-import
eslint-plugin-jsx-a11y
eslint-plugin-react


*/
