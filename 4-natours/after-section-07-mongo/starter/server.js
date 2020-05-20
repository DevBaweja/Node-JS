const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
});
/*
noSQL database
vs
SQL Relational database

mongoDB is noSQL database
Each database contain one or more COLLECTIONS(Tables)
Each collections(Tables) conatin one or more data structure called DOCUMENTS(Rows)

MONGODB
MongoDB is document database with the scalability nad flexibility that you want with 
querying and indexing you need

Key fratures
Document based : stores data in document (field-value pair data structure,NoSQL)
Scalable : easy to distribute data across mulitple machine
Flexible : No document data schema required,so each document have different # and types of field(columns)
Removing scope of columns
Performant : Embedded data models,indexing,sharding,flexible documents,native duplication
*/
/*
Documents,Bson and Embedding

Document Structure

{
    "_id" : ObjectID('...'),
    "title": "Rockets, Cars and MongodDB",
    "author": "Elon Musk",
    "length": 3280,
    "published": true,
    "tags": ["MongoDB", "space", "ev"],
    "comments": [
        {"author" : "Jonas","text" : "Interesting stuff!"},
        {"author" : "Bill","text" : "How did you do it?"},
        {"author" : "Jeff","text" : "My rockets are better"}
    ]
}

BSON - similar to json
Data format MongoDB use for data storage
Like json but typed,So MongoDB documents are typed

Storing Array - cann't be done on relation databases
Storing Array of Objects - Embedded documents
Embedding/Denormalizing - Including related data into single document 

In related database data is normalized
So, solution is to create whole new table for comment section

Max size - 16MB for BSON
Each document contain unique id
*/
/*
To create database and use it
use databaseName

Now db stands for current database

To create collection
db.collectionName



It will automatically be converted to JSON to BSON

To find document
db.collectionName.find()
if empty it will return all document from collection

db.collectioName.find({ key : 'value' })
Only those having these key-value pairs will return from it

Show all databases
show dbs

Show all collections
show collections

Quit 
quit()
*/

/*
CRUD operatiom

## Creating documents
db.collectionName.insertOne()
Passing only one javascript object

db.collectionName.insertMany()
Passing Array of javascript Object

## Reading or Quering on documents
db.collectionName.find(query)
query - Object with field 
if no field is given it will find everything from collection

while specifying field in query 
field with same key, last one will be considered

To create db
db.createCollection(collectionName)

## Query Operators

Passing another object for that key

$ sign for operators

Comparsions Operators
less than (lt)
greater than (gt)
less than or equal to (lte)
greater than or equal to (gte)

Not equal to (ne)
we can use regular expression also

In (in) requires Array of values
Not In (nin) reuire Array of values

Logical Operators
AND (and) - Array of object
NOT (not)
OR (or) - Array of object
NOR (nor)

db.collectionName.find({key : {$lte : value},key : {$gte : value}})
db.collectionName.find({ $or : [{key :  {$lte : value}} ,{ key : {$gte : value} }] }).pretty()

Projection

db.collectionName.find({ $or : [{key :  {$lte : value}} ,{ key : {$gt : value} }] },{ name : 1}).pretty()

## Update documents
db.collectionName.updateOne(query,{ $set : {key : value} })
It will update only one even if query select multiple documents
db.collectionName.updateMany(query,{ $set : {key : value} })
It will update many

Update only key:value pairs in document like patch http method

db.collectionName.replaceOne(query,{ })
db.collectionName.replaceMany(query,{ })

Replace document like put http method


## Deleting documents

db.collectionName.deleteOne(query)
db.collectionName.deleteMany(query)

db.collectionName.remove(query)
query - Object with field 
if no field is given it will remove everything from collection

To delete collection 
db.collectionName.drop()

To delete db
db.dropDatabase() 

Pretty
use queryResult.pretty()

cls to clear shell

*/

/*
Connect cluster of compass atlas to mongo compass and mongo shell
*/