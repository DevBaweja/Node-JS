const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

/*
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'The Park Camper',
    price: 997,
});

testTour
    .save()
    .then((doc) => {
        console.log(doc);
    })
    .catch((err) => console.log('Error : ', err));

*/
// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
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
Mongoose
Object Data Modeling (ODM) library for MongoDB and Node.js
higher level of abstraction over mongoDB Driver

Features
Schemas to model data and relationships
Easy data validation
Simple query api
Middleware

Mongoose schema 
It models our data,by describing the structure of the data,default values and validation

Mongoose model 
A wrapper of the schema,providing an interface to database for CRUD operations

Schema Type Options Object
const schemaName = new mongoose.Schema({
    key: valueType,
    key: {
        type: valueType,
        required: true,
        unique: true,
    },
    key: {
        type: valueType,
        required: [true,'Error Message'],
    },
    key: {
        type: valueType,
        default: value,
    },
    key: {
        type: String,
        trim: true,
    }
})

const ModelName = mongoose.model('ModelName', schemaName)

ModelName with plural is collection
const DocumentName = new ModelName({ 
    key: value
})

DocumentName.save()
    .then(doc => {

    })
it will return promise and then method have access to doucment object

The schema.path() function returns the instantiated schema type for a given path
*/

/*
MVC
Model View Controller
Model - Business Logic
View - Presentation Logic
Controller - Application Logic

It all start with request that request will hit one of our routes
Routes then delegate request to correct handler function which will be in one of the controller
(There will be one controller of each of our resources)
Then,depending upon incoming request controller then need to interact with one of models
and get required data from models and then controller will then select one of view template
and then send it as response

Application vs Business Logic
Application Logic
Code concerned about application's implementation,not underlying business problems
we are trying to solve ( eg showing and selling tours,managing stock in supermarket,organizing a library)
Concerned about managing request and response
More about techinal stuff or techinal ascepts
Bridge between model and view layers

Business Logic
Code that actually solve the business problem that we set out to solve
Directly related to business rules,how the business works,and business need
ex - 
    creating new tours in database
    Checking if user's password is incorrect
    Validating user's input data
    Ensuring only user who bought a tour can review it

Fat Models/Thin Controllers
Offload as much logic as possible into the models,
keeping controllers simple and lean as possible
*/
/*
Mongoose Function
Model - Collection

# Creating 
Model.create(document)

const newdoc = new Model(document)
newdoc.save().then(doc => {})

const doc = await newdoc.save()

save method is in prototype of Model 
so Model.save() will not work
it will be inherited by new Model(document) objects only 

# Reading  and Quering
Model.find(query)
Model.findOne(query)
Model.findById(id)


# Updating
Model.updateOne(query)
Model.updateMany(query)

const Model.findOneAndUpdate(query,document,{
    new: true,
    runValidators:true,
})
const Model.findByIdAndUpdate(id,document,{
    new: true,
    runValidators:true,
})
new is to get back newly created document
runValidators is to run validation again acc to Model Schema

# Deleting
Model.deleteOne(query)
Model.deleteMany(query)

Model.findOneAndDelete(query)
Model.findOneAndRemove(query)

Model.findByIdAndDelete(id)
Model.findByIdAndRemove(id)

Model.prototype Method are inherited to document created by new Model(document)
const newdoc = new Model(document)
newdoc.save().then(doc => {})

*/
/*
Schema Type Option Object

mongoose.Schema({
    key : [valueType]
})
Array of Objects

*/
/*
Script - import-dev-data.js
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
Script - import-dev-data.js
process.argv contain

dirname of node 
current dirname

Using process.argv to specify import or delete

node dev-data/data/import-dev-data.js --import
node dev-data/data/import-dev-data.js --delete 
*/
/*
url 
localhost:3000/api/v1/tours?duration=5&difficulty=easy&page=2&sort=1&limit=10
Filtering
req.query

By mongoDB find query
await Model.find(query)
await Model.find({
    key: value,
    key: value,
})

By express

await Model.find()
    .where(key,value)
    .where(key,value)

await Model.find()
    .where(key).equals(value)
    .where(key).equals(value)

await Model.find()
    .limit(val)

All of these methods can be chained to Query Object
given by Method.find()
lt,lte,gt,gte,or,and,nor,in,nin,sort
*/
/*
Query

Accessing objects as
obj[StringAsPropertyKey]

delete operator to delete key-value pair 
from object

await Model.find()
will return Query

Query
    .where(key,value)
    .where(key,value)

Query
    .where(key).equals(value)
    .where(key).equals(value)

Query
    .limit(val)

All of these methods can be chained to Query Object
given by Method.find()
lt,lte,gt,gte,or,and,nor,in,nin,sort

Query.where(query)

Query.$where(function () {
    return key == value
})

await will directly return result 
so we need to store Query and then as we chain all the methods
then we can await Query to get results

*/
/*
Complex Query

url
localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&page=2&sort=1&limit=10

await Model.find({
    key: value,
    key: { $gte: value },
    key: { $lte: value },
})

req.query gives exactly same but without $ sign
so we need to implement that as well by replacing
operators with theier corresponding mongo operator

Regular expression
/\b(gte|gt|lte|lt)\b/g

\b to exact word
g for multiple instance
| for or

replace function accepts callback with argumnet as matched word
*/

/*
const tours = await Tour.find(query)


const tours = await Tour.find({
    key: value,
    key: value,
})


const tours = await Tour.find()
    .where(key, value)
    .where(key, value);


const tours = await Tour.find()
    .where(key)
    .equals(value)
    .where(key)
    .equals(value);
*/

// 1A) Filtering using query string
/*
url = localhost:3000/api/v1/tours?duration=5&difficulty=easy&page=2&sort=1&limit=10
queryObj = {
    duration: '5',
    difficulty: 'easy',
    page: '2',
    sort: '1',
    limit: '10'
}
After basic filtering
Removing excludes Fields
queryObj = {
    duration: '5',
    difficulty: 'easy',
}
*/
// 1B) Advance Filtering using query string
/*
    url = localhost:3000/api/v1/tours?duration[gte]=5&price[lte]=1000&difficulty=easy&page=2&sort=price&limit=10
    queryObj = {
    duration: { gte: '5' },
    price: { lte: '1000' },
    difficulty: 'easy',
    page: '2',
    sort: 'price',
    limit: '10'
    }
    After basic filtering
    queryObj = {
        duration: { gte : '5' },
            price: { lte: '1000' },
        difficulty: 'easy'
    }
    After advance filtering
    queryObj = {
        duration: { $gte : '5' },
            price: { $lte: '1000' },
        difficulty: 'easy'
    }
*/
/*
split(regex)
split will split String into Array of String based upon regex

join(regex)
join will join Array of String into String adding regex in between
*/
/*
Sorting

Query.sort(key)
use -key for descending sorting
url : localhost:3000/api/v1/tours?sort=price
Sorting by second part
url : localhost:3000/api/v1/tours?sort=price,ratingsAverage
req.query.sort = 'price,-ratingsAverage'
    After Sorting 
query.sort('price -ratingsAverage)
*/
/*
Projection

url : localhost:3000/api/v1/tours/fields=name,duration,difficulty,price

req.query.fields = 'name,duration,difficulty,price'
After Projection
query.select('name duration difficulty price')

query.select('-__v')
Use - to exclude it from porjection

However + - can not be used together

Also we can directly specify in Schema to exclude some fields
in schema type option object

select: false
*/
/*
Pagination

url : localhost:3000/api/v1/tours?page=2&limit=10

query.skip()
skip given # of documents

query.limit()
limit # of doucment

Defining default value
const page = query.page || value;

Error while accessing page that doesn't exists
Tour.countDocuments()
try{
throw new Error(message)
}
catch(err){

}
it will be catch in catch block
*/
// query.sort().select().skip().limit()
/*
Aliasing
Separate route given to most searched query

here we still want getallTours
so we use middleware function that will manipulate req object
*/

/*
Aggregation Pipeline : Matching and Grouping

we define pipeline that all document from certain collection go through
where they are processed step by step in order to transform them into 
aggregated result
ex - calculating averages,maximum,minimum,distances

await Model.aggregate()
Using aggregation pipeline is just like doing regular query

Array of stages Object with key as stage name and value as another object
Model.aggregate([
    {
        $match: { key : {$gte : value} }
    },
    {
        $group  {
            _id: null,
            key: { $aggregateOperator: '$field' }
        }
    },
    {
        $sort: {
            fieldName : 1 | -1
        }
    },
    {
        $match: {
            _id: { $ne : 'EASY'}
        }
    }
])
$match - Make sure the object query given is satified

$group - Groups document together by _id
if _id is null basically grouping all document 

Aggregate Operator
$avg,$count,$min,$max
$or,$and,$gt,$gte,$lt,$lte$not

Specifying field by '$fieldName'

$sort - Sort doucment based upon $group stage 
As group is now documents

we can repeat stages as well
*/
/*
Aggregation Pipeline : Unwinding and Projecting
Model.aggregate([
    {
        $unwind : '$startDates '
    },
    {
        $match: {
            startDates: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
            },
        },
    },
    {
        $group: {
            _id: { $month: '$startDates' },
            numTourStarts: { $sum: 1 },
            tours: { $push: '$name' },
        },
    },
    {
        $addFields: { month: '$_id' },
    },
    {
        $project: {
            _id: 0,
        },
    },
    {
        $sort: {
            numTourStarts: -1,
        },
    },
    {
        $limit: 12,
    },
])

We use $ if we want tto apply it as value 
when it is key we simply use it as field

$unwind - it will deconstruct each document 
by field specified into its new document

$match - select based upon key statisfing values
$group - group by _id
$push - will create array and element into it
$month will extract month from value
$addFields - adding more fields
$project - use for projection
$sort - use for sorting
$limit - it limit result count
*/

/*
Virtual Properties
Properties that can be derived from another field in Model
and we don't want it to store in database 
ex - age that can be derived from dob

It will be created each time we extract data from database

Schema.virtual(keyToBeCreated).get(function() {
    return this.keyWhichIsPresentInDatabase;
})

use function so that this point to correct place
and not global
As arrow function does not get it own this keyword
as this in this point to current document

To really get this property when requested we need to set option on schema

Schema.set(PropertyName,value)

PropertyName - toJSON,toObject
value - { getters: true }
value - { virtuals: true }

Or simply pass option objectas second argument in new mongoose.Schema(def,option)

we cann't query virtual properties in database as they are not part of database
*/

/*
Just like express,mongoose also have concept of middleware
ex - each time new document is saved before or after saving into database

Pre and Post Hook
Functions to run before or after certain event

Document
Query
Aggregate
Model

Middleware are defined on Schema
*/

/*
Document Middleware
Act upon currently proccesed document

pre | post save hook
pre or post - save event
save event is triggered only on save() or create() 
and not on insertMany()

Also next must be called in middleware stack

Pre middleware have access to this that will point to document
Post middleware have access to document that was just saved in database

save here is hook 
*/
/*
Query Middleware

pre | post find hook
Before or after certain query is executed

this keyword will now point to current query

it also only work for find so we again need findOne
so we use regular expression start with find

Post find hook have access to docs returned from query
*/
/*
Aggregation Middleware

pre | post
Before or after certain aggregation happens

aggregate hook

this keyword point to current aggregation object

this.pipeline() contain all the stages so we need to add another $match stage
returns pipeline object
*/
/*
Model implementing instance methods which are methods that will be available to every document 
after being queried

Data Validation
Validation - checking values are in right format for each field in document schema
and also values have been entered for all of required fields
Sanitization - Inputted data is clean

Schema type option
unique still produces error in duplicate code but it is not validator 
required - available for all data types
maxlength,minlength - available for String
max,min - available for Number,Dates
enum - Specify some values available for String
match - input matches given regular expression
[value,Error Message]

{
    values: [],
    message: String
}

*/
/*
Custom Validators
Function returning true or false

Specify validator we use validate validator property

validate : {
    validator: function,
    message: String
}
it can also be done as [function,String]

*/
