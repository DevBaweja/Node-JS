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
Authentication, Authorization and Security

Authentication and Authorization
User logged in have access to certain part of app which is not accessed by user which is not logged in

User signing in, logging in, accessing pages or routes
JSON Web Tokens
*/

/*
Creating authController for alias signup
Using catchAsync for error handling
userSchema is created

Moongose document middleware
pre save hook to encrypt data

Also confirm Password have validator which run on only create and save
so be careful in update as it will not be validated even through we specify 
runValidators on update as option

this.isModified(key)
to check if key was modified

Also in case of update we will use save as well as it is pre save hook 
and also to run validators of confirmPassword

Then in pre save hook encryption of password will be done 
Hashing Algorithm bcrypt
npm i bcryptjs

bcrypt will salt password and will generate hash it
Salting is done so that similar password doesn't generate same hash

bcrypt.hash(password,cost)
default cost = 10

Also as we don't want to store passwordConfirm so we set it to undefined
Even it is required it means it is required input and may or may not be stored in database 
*/
/*
JWT 
JSON Web Token
stateless solution for authentication
No need for storing session state on server

Avoiding to store user logged in state on server using sessions

Client will make post request on '/login'
with email and password

On server it will check if user exists and create unique JWT and send it to client
Which will be stored either in cookies or localStorage without leaving any state on server
Server doesn't know which user are logged in

When user try to access protected part of application
JSON Web Token is send with request and once request hit server it will then verify JSON Web Token is valid and requested protected data is send to client and if JSON Web Token is not valid it will send error that it cann't access that resource

This all must be done over https - secure encrypted http
in order to prevent access to passwords or json web tokens
*/
/*
JWT Working

1.2.3
3 parts separated by period - Header, Payload, Verify Signature
debugger
jwt.io

1) Header
    Algorithm and Token Type
Meta data about token itself

2) Payload
    Data
Data that we can encode

These two are plain text that will be encoded and not encrypted
anyone will be able to decode them and to read them

3) Signature
it is created using header, payload and secret that is saved on server

Signing json web token
Signing algo - takes header, payload and secret to create unique signature

Verfying on server side
It will check if no third party have alter the header and payload of json web token

Once JWT is received then it will take header, payload and secret
and generate test signature

Original Signature is still in JWT so we need to compare original signature with test signature to verify valid JWT

Without the secret, one will be able to manipulate JWT data however they will never be able to create valid signature for the new data
*/
/*
Passport

JWT library
Signing and Verifying

Sign using jwt.sign(payload,secret,[options])
expireIn : 1000(ms) 5s 10h 2d

To log out user after this much peroid of time

Login will simply check all credentials and checks in database and return
token using jwt.sign(payload,secret,[option])
To check in database we will use findOne(query)
and we also need password to check if it is also correct 
chain select('+field') as we set it select in schema type option so we this explicit chain

password is also made select to false in schema type object of User model as to not show it when we get all users

Also now encrypted password and user password must be compared 

bcrypt
In user model we will check does password match with this document encrypted password
For that we will use instance method that is available on every document so that we can then call it directly from authController

userSchema.methods.functionName 
we can then use this.password however as we have select in document schema type option of password
so this.password is unavailable 

bcrypt.compare()
it also async function
200 Ok
201 Created
204 No Content
400 Bad Request 
401 Unauthorized
403 Forbidden
404 Not Found
429 Too Many Requests
500 Internal Server Error
*/
/*
Protecting resources
We will use protect middleware before giving access to resource

In that we need to get token and we usually send token with http headers with the request which can be accessed via req.headers

Token is set in header as Authorization to Bearer Token

Verification token
By verifying token and decoding it we will whether user is allowed to access and also which user want to access as it in token payload as user id of mongodb
jwt.verify(token,secret,callback)
to get test signature and compare it with original token signature

This verify is async function and need callback however we need function to return promise so we will promisify this function

Node build in promisify function
util module
promisify need async function and return promise version of that function

The expire and created at are also passed to payload so that it can then identify if token has been expired or not in verify method

Then if we can get user id we can check if user still exits and was not deleted
so that if user delete its account then token will also become unvalid
it is like sign out and unvalidating token of the user 
Even if user sign out token will remain valid that is whole purpose of log in if token is absent user will not be able to log in

However we cann't unvalid it as we don't have it. as it is stored to client
so we can check if user still exist in database or not

Check if user changed password after token issued
To do this we will again use instance method on schema
wich give access to document to use that function

To do this we will create new field passwordChangedAt and then compare it with json token iat -  issued at field

getTime will convert date into ms format as iat timestamp which is in s format
*/
/*
Postman Setup

Environment Setup 
in Production mode or in Development mode

URL - 
Environment variables are access by {{ URL }}

Pasting token in request header Authorization Bearer Token automated by postman 

In test of signup and login we will set environment variable of the token received

pm.environment.set(key,value)
value will be pm.response.json().value
To convert it into json 

Now in Authorization use Beare Token and {{ jwt }} environment variable
*/
/*
Authorization User roles and Permission
Again middleware and it will need roles that are allowed to do next() middleware
Added role in schema type option object

Usually we cann't pass argument in middleware
ie it will need to return another function which can have access to req,res,next
Also it have access to roles due to Closures
Also now we have access to all information about current user as protect function req.user is set to currentUser 

Also protect will always run after restrictTo   
*/
/*
Password Reset Functionality: Reset Token
1) User send post request to forget password route with only email
It will then create reset token and send that to email address that was provided
Simple random token not json web token

Finding user with that email 
Create token using random bytes function from build in crypto module
crypto.randomBytes(32).toString('hex')
We will never store password and reset tokens in database
crypto.createHash('sha256').update(resetToken).digest('hex')

logging as object will tell us variable name along with value
After updating value we need to save document to store it in database
validator must be deactivated before saving document
so we pass option validateBeforeSave 

2) User then send token from his email along with new password in order to update password
NodeMailer
util email

nodemailer.createTransport({ 
    service: 'Gmail',
    auth: {
        user: ,
        pass: ,
    }
})

Active the gmail "less secure app" option

SendGrid
Mailgun

Development service which fakes to send emails to real addresses
but these emails end up trapped in development inbox

Mailtrap
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD,
    },
});
const mailOptions = {
    from: 'Dev Baweja <devbaweja576@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
};

transporter.sendMail(mailOptions);
return promise
    
resetURL
req.protocol
req.get('host')

While comparing it again with encrypted password in database we can again encrypt token and compare it with one stored in database

typeof key
key instanceof Object

Validator will check required field and we have no need to check if req.body.password exists or notifieras otherwise it will be set to undefined and mongo demand will not be fulfilled

Also updating changedPasswordAt will be in middleware pre save hook
so that it is done automatically
also we will use this.isNew
*/
/*
Updating user details
It will be updateMe - currently auth user
Only update name and email

If we again use save then we will get error as we are not specified all validation
findByIdAndUpdate()
we can use this as we are not dealing with password

findByIdAndUpdate(id,data,option)
option new: true
so that it will return updated user instead of previous user 
*/
/*
Deleting user
We will set active field
deleteMe
it will not be selected in getAllUsers - hiding complexity
and default value to active

Also we want whole user to hidden in getAllUsers so we will use query middleware to match
*/
/*
Security

1) Compromised Database
Attack gets access to database
Encrypt passwords with salt and hash(bcrypt)
Encrypt passwords reset tokens(SHA 256)

2) Brute Force Attacks
Use bcrypt (to make login requests slow)
Implement rate limiting (express-rate-limit)
Implement maximum login attempts

3) Cross Site Scripting (XSS) Attack
It allow hacker to read localStorage ie why we will not store JWT in localStorage it will be stored in HTTP Only cookies
Browser can send and receive cookies but cann't access or modify cookies
Sanitize user input data
Set special http headers (helmet package)

4) Denial Of Service (DOS) Attack
Attack send so many request to server that server breaks down
Implement rate limiting (express-rate-limit)
Limit body payload(in body-parser)
Avoid evil regular expression

5) Nosql Query Injection
Attacks instead of inputting valid data, inject query in order to create wuery expressions that are gonna translate to true
Use mongoose for MongoDB(SchemaTypes)
Sanitize user input data

Practices
Always use https
Create random password reset tokens with expiry dates
Deny access to JWT after password change
Don't commit sensitive config data to Git
Don't send error details to clients
Prevent Cross-Site Request Forgery(csurf package)
Require re-authentication before high-value action
Implement blacklist of untrusted JWT
Confirm user email address after creating account
Keep user logged in with refresh tokens
Implement two-factor authentication (OTP)
Prevent Parameter pollution causing Uncaught Exception
*/
/*
JWT via Cookies
Cookies - Information that server can send to clients and when client receives cookies it will then automatically store it and send back along with all future request to same server

res.cookie(key,value,option)
option
{
    expires:,
    secure:,
    httpOnly:,
}
secure to make sure that it only in https
httpOnly to make sure browser cann't access and modify cookie

Also in send token we define user.password = undefined before send data
*/
/*
Implementing Rate Limiter
Global middleware function
npm i express-rate-limit
It limit IP address and requests made by that IP

In app js we simply use

limiter = rateLimit(options)
options 
max - # of request
windowMs - Time(in ms)
message : error message

limiter is now an middleware function
app.use('/api',limiter)
*/
/*
Setting security http header
npm i helmet
In middleware we need function and not function call
app.use(helmet())
will return middleware function

Limit amount of data that goes into body in body-parser
app.use(express.json(options))
options
limit: 10kb
*/
/*
Data Sanitization against NoSQL query injection and Cross-Site Scripting Attacks (XSS Attackes)
Clean all data that come into application from malicious code
It must be done after body-parser only

NoSql Injection
{ "$gt" : "" }
Something that is always true

npm i express-mongo-sanitize
app.use(mongoSanitize())
will return middleware function

npm i xss-clean
app.use(xss())
will return middleware function
*/
/*
Prevent Parameter Pollution
If we specify more than one time same parameter then it will create Array which might be unexpected for apiFeatures

Http Parameter Pollution
npm i hpp

Using last parameter from multiple parameter given
 
{} to be key-value pair in console.log
{this.} will not work as intended

app.use(hpp(options))
options
whitelist : ['duration']
as it will work on duration

*/
