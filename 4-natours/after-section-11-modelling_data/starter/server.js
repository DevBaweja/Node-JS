const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception! Shutting down...');
    console.log(err.name, err.message);
    // console.log(err);
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
MongoDB Data Modeling
Unstructured data into Structured, Logical Data Model

Online Shopping
categories
product
suppliers
customers
cart
orders

1) Different types of relationships between data
2) Referencing/Normalization or Embedding/Denormalization
3) Embedding or Referencing other documents
4) Types of Referencing

1) Different types of relationships between data
# One-One
One field can have only one value
movie - name

# One-Many
One-Few
movie - awards  
One-Many
movie - reviews
One-Ton
app - log

# Many-Many
movie - actor

2) Referencing/Normalization or Embedding/Denormalization

Referenced/Normalized
Related dataset have separate documents

movie - actor 
Child Referencing
Array of ObjectID are stored in that document to create reference

Embedded/Denormalized
Related dataset is stored in single document

movie - actor
Embedding into single document
Array of documents are stored in that document to form dereference form

In sql, we can only store data in normalized form
In nosql, we will prefer to store data in denormalized form

Denormalized
Pros : Performance -  Getting all information in one query
Cons : Impossible to query Embedded document on its own
Normalized 
Pros : Performance - It is easier to query each doucment on its own
Cons : We need more queries to get data from referenced document

3) Embedding or Referencing other documents
Deciding when to denormalize and when to normalize

# Relationship Type(how two datasets are related)
Embedding
    One-One
    One-Few
    One-Many
Referencing
    One:many
    One:Ton
    Many:Many

Data access pattern(Read/Write ratio, How often data is readen and written)
Embedding
    Data is mostly readen
    Data does not change quickly
    High read/write ratio
    ex - movies & images
Referencing
    Data is mostly written
    Data is updated a lot
    Low read/write ratio
    ex - movies & reviews
Data Closeness(how much data is related)
Embedding
    Dataset really belong together
    ex - users & email addresses
Referencing
    Need for querying both datasets on their own
    ex - movies & images quiz

4) Types of Referencing
Child
Reference of related child doucment in the parent document
In nosql child referencing is actually possible as we cann't have arrays in sql
However making these array so huge also is anti pattern of nosql so we should avoid it
Tight coupling of parent and child making it to be less standalone
    One:Few 
16mb limit of bson document
Parent 
Reference of parent document in each child document
Even in sql we can only do parent referencing
More isolated and more standalone
Parent have no idea how many and where is child documents
    One:Many
    One:Tok

Two-way
Actually no parent and child
Sibling have reference to another sibling document
Making siblings more standalone
   Many-Many

*/
/*
Priniciples
1) Structure your data to match way that your application queries and updates data
2) Identify questions that arise from your application's use cases first, and then model your data so that questions can be answered in most effective way
3) Favour embedding especially in One-Few and One-Many
4) One:Ton and Many:Many usually goes with referencing
5) Use referencing if data is updated a lot and if you need to frequently access dataset on its own
6) Use embedding if data is mostly read and rarely updated, and when dataset belong intrinsically together
7) Don;t allow array to grow indefinitely, Normalized it
Child referencing in one:many
Parent referencing in one:ton
8) Use two-way in many-many
*/
/*
Relationships

tours
    userID:[<id>,<id>]
users
Child referencing or Embedding in case of guide or lead guide
Few:Few

tours
    locations:[<location>,<location>]
locations
Embedding
Few:Few

tours
users
reviews
    tourId: <id>
    userId: <id>
1:Many
Parent Referencing

tours
users
bookings
    tourId: <id>
    userId: <id>
1:Many
Parent Referencing
*/
/*
Modelling Locations(Geospatial Data)
Point, MultiPoint, Line, Polygon, MultiPolygon
GeoJSON

In order to form geoJSON we need to give it type and coordinates
and then specify schema type option for each of them

key:{
    type:{
        // Schema type options
    },
    coordinates:{
        // Schema type options
    }
}

startLocation: {
    // GeoJSON
    type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
    },
    coordinates: {
        type: [Number]
    },
    address: String,
    description: String
}
Array of Number with longitude and latitude
Moslty latitude and longitude

Latitude - Horizontal position (in degree) starting from equator
Range 0(equator) to 90(pole)
longitude - Vertical position (in degree) starting from point of intersection with Meridian line
Range -90(meridian) to 90(meridian)

In order to specify geospatial data with mongoose we need to create an object with two neccessary fields type and coordinates
It not really document itself rather just object in order to make it document we will create array of geoJSON objects

Creating Array of Object will make them as document
It can be proved that Array of Object is document in themself as they have their own id property

Geospatial Queries
Finding location that are closest to certain points
Finding all location inside certain raduis or certain sphere
*/
/*
Embedding users in tours in case of guide
User will simply add array of user id 
Then we will get that user document and add that user and embed it into tour document

As we don't want schema we will directly use
guides : Array it is array of ids that user will add then we will embed them
And best way is pre save hook

Then use user.findById(id) for all ids and then store them into Promise array
Executing all promises at same time 
Promise.all(Array);
*/
/*
const Schema = mongoose.Schema
Schema.Types.ObjectId
*/
/*
Child Referencing users in tours in case of guide
To create reference we will create array of object with type as Schema.Types.ObjectId
guide : [
    {
        type: Schema.Types.ObjectId
        ref: 'User'
    }
]
User will simply add array of user id 
In ref we actually now even need to import User model

And array will be of type ObjectId
However it not doing validation of that user id which is inputted
Also we will store ids and in output we need to show up that user just like before
*/
/*
Populating
To display reference objects ids actual data into output
In Query middleware
use this.populate('key')
It will then access that value from ref collection and populate it to output

It will look like data have been always embedded in fact it is in different collection

Also instead of query middleware we can simply put on getTourById route
as in getAllTours we don't want to populate guides

Selecting with populate

populate('key','select')
populate('guides','-__v')

populate({
    path: 'guides',
    select: '_id name email role'
})
*/
/*
Parent Referencing
reviewModel is made for parent referencing
Also option have toJSON and toObject getters and virtuals set to true
so that virtual properties can be shown

Instead of array we simply use object with type of Schema.Types.ObjectId
and ref set to User and Tour

Also making route for reviews
and adding populate for user and tour
*/
/*
Virtual Populate

To get all reviews related to one specific tour or user
Meanging other way around this problem arise as we use parent referencing
so parent does not know about it child

Manually query for reviews when query for tour is done
Also do child reference on parent but ie why we picked child referencing to avoid this

Virtual Populate
Way of keeping array of child on parent without actually persisting it to database

touSchema.virtual('reviews',option)
option = {
    ref: 'Review',
    localField: '_id',
    foreignField: 'tour',
}
localField: find where localField is equal to
foreignField: foreignField where ref is actually stored

Then we will populate it
*/
/*
Summary 
We started doing only parent referencing on the review.
But that made it so that on the tours,
we had no access to its corresponding reviews.

And the easiest fix for that would be
to also do child referencing on the tours.
that we do not actually want to keep an array of all the child documents
on the parent document

Use Virtual Populate
So, keeping a reference to all the child documents on the parent document virtually
but without actually persisting that information to the database.

And then, finally, we also turned off one of the populates that we had on the review.
to avoid an inefficient chain of populates.
*/
/*
Nested Routes
Manually passing tourId and userId to create review
userId will come from current logged in user and tourId should come from current tour
Encoded into url

POST tour/tourId/reviews
Nested route
Parent-Child Relationship between resources
Accessing reviews resource on tours resource

GET tour/tourId/reviews
Should give all reviews of that tour

GET tour/tourId/reviews/reviewId

This is easier way of reading and understanding how api works
than messing around with query string

So we nest route in tours resources
reviewController will be accessed in tourController which is not ideal considering independence and modularity of routes
Put route creating review in tour router which is work of review router
*/
/*
Merge Params
Use for nested routes

Then we need reviewRouter in tourRouter
router.use('/:tourId/reviews', reviewRouter);

Again mounting reviewRouter on this url

One thing here is that now this reviewRouter doesn't have access to tourId parameter

Also we need to set mergeParams in the express.Router in reviewRouter

Due to this when getAllReviews can accessed from different route so we need to handle that if tourId is given and when we want to display all reviews
*/
/*
Handler Factory Functions
All controller have pretty similar things
So factory function is function that returns another function
All of this works due to closure as inner function have access to outer function even after outer function have already returned

When we create deleteReview and updateReview due to mergeParams we can access it by another way also
/api/v1/tours/tourId/reviews
will be redirected to reviewRouter only 

All of this is factory function are mostly by admins
*/
/*
Importing dev-data
Also turn off validation
In order to import data since password is already encrypted we need to turn off encryption in pre save hook
*/
/*
Improving Read Performance with Indexes

query.explain()

We can create indexex on specify fields in collection
Mongo automatically create index on _id field by default

Add schema type options 
index set to true on that field in Model
Also add
schema.index({field:1/-1})
1 - Sorting index in ascending order
-1 - Sorting index in descending order

When ever we specify any field to be unique it also gets it index to improve fast read performance
In order to ensure uniqueness mongoose behind the scene it will create a unique index of this field 

Single field index
Index with only one field
Compound field index
Index with more than one field
It will even work if only one field is queried

Index themself takes lot of space so clear thing is that we cann't set indexs to all of field as index size will grow even more than documents themself and finding in index file will also take way more time

To decide which field we need to index it depends upon access pattern of application and we don't want to overdo with indexes

Also indexes get updated each time underlying collection is updated 
collection with high write-read ratio (Mostly written to) then it would make absolute no sense to create index on any of field  
*/
/*
Calculating Average Rating on Tours

Storing summary of related dataset on main dataset is popular techinque in data modelling

Static Method
in reviewModel which will take tourId and calculate ratingsAverage and ratingQuantity and then also update that to tours resources

And then we will call this function each time any reviews resource is created, updated or deleted

Review.calcAverageRatings()
It is static method of Model
which we will add on schema
reviewSchema.statics.function

This keyword in static methods belongs to Model which then we can apply aggregate and get all stats

Also we want to do Review.calcAverageRatings()
on pre save hook which is applied on schema 

And schema is use to build Model and in Model building we use schema

this in pre save hook belongs to Document
this.constructor is constructor which created this document and ie Model

Also we need to do it on post after current review will be saved
Post hook doesn't get access to next 

We are allowed to use another tourModel in another only in static methods and only parent are allowed to be in child

When review is updated or deleted
For findByIdAndUpdate,findByIdAndDelete we don't have document middleware we only have query middleware

Also query middleware for only these and not findOne
findOneAnd 
as behind the scene mongoose actually uses findOneAndUpdate,findOneAndDelete 

Since we need current document to get access to tourId and this.constructor ie Model to use static methods
we will execute query of query middleware as this points to query and not document
this.findOne() will then give us document we need

Problem her is that if we call that function again to calcAverageRatings we will still use non-updated data as it is in pre hook
Also we cann't simply make pre to post hook otherwise this will not point to query as query has been executed

Then we will create post middleware again and then call that function 
However kick is that we will pass information from pre to post middleware by set that property to this variable
*/
/*
Summary
In order to be able to run calcAverageRatings
also on update and on delete
we actually need to use the query middleware
that Mongoose gives us for these situations.
Okay, so, we do not have a handy document middleware, which works, for these functions but instead we need to use the query middleware,
and in that one, we do not directly have access
to the current document. And so we need to go around that
by using this findOne, and so basically retrieving the current document from the database. We then store it on the current query variable,
we then get access to it in the post middleware.
And it's then only in the post middleware
where we actually calculate the statistics for reviews.
And remember that we do it this way
because if we did it right in pre middleware function,
then the underlying data would not have been updated at that point and so the calculated statistics would not really be up to date.
*/
/*
Preventing duplicate reviews
On same tour by same user
(tour,user) - unique
which can be easily done by indexing
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

option set unique: true as even when indexing some field we always don't want them to be unique compoundly

Rounding of ratingsAverage
set in schema type option
It will ge called each value is set for this field
Math.round(val*10)/10
It round off to integer

Use set when we want to persisting data
Use get when we want to just show in output
*/
/*
Geospatial Query in MongoDb

We can also use geospatial queries in mongoose like 
query.within()
When ever instead of passing filter objects we use chaining on query it means we are using mongoose
and whenever we are passing filter object means we are using mongoDb

find({
    $geoWithin: {
        $geometry:{
            type: 'Polygon
        }
    }
})
Build in geometry $box,$polygon,$center,$centerSphere

Also mongoDb takes lng,lat instead of convention of google maps lat,lng

find({
    $geoWithin: {
        $centerWithin:[
            [<lng>,<lat>],<raduis>
        ]
    }
})
raduis must be in radians

In order to do geospatial queries we need to index to field on which geospatial queries will be executed
tourSchema.index({startLocation: '2dsphere'})

2d - Fictional point on 2d plane
2dsphere - Real point on sphere

Use analyse schema in compass we can easily visualize geospatial queries
*/
/*
Aggregation in Geospatial 

Tour.aggregate([
    {
        $geoNear: {
            key: '$startLocation',
            near: {
                type: 'Point',
                coordinates: [+lng, +lat],
            },
        }
    }
])

There is stage ie geoNear which is specific to geospatial
It always need to be first one in the pipeline
Also it need that geospatial field must have geospatial index (2dsphere)

if there is only one field having geospatial index
$geoNear will automatically use that index in order to perform that calculate 
in case of multiple geospatial index 
key : 'startLocation'
must be used

near - Center point
which must be specified as geoJson
near: {
    type: 'Point',
    coordinates: [lng,lat]
}
distanceField : 'distance'
*/
/*
MongoDb documentation and then go to references
*/
