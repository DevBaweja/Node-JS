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
Payments, Emails, Booking
*/
/*
Multer - Middleware to handle multi part form data,
which is form encoding used to upload files from form

npm i multer
As we need it in userRoutes only so use that middleware only there

const upload = multer({dest: 'public/img/user' })
Middleware
upload.single('field')

So to pass that image to next middleware it will then put information 
about file on the req object

req.file

Using form-data in postman
req.body doesn't contain any information about as 

Multer Storage and Multer Filter
const multerStorage = multer.diskStorage({ 
    destination: (req, file, cb)=>{
        cb(null, 'public/img/users')
    },
    filename: (req, file, cb)=>{
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
})

We can also choose to store file in memory as buffer
This destination: (req, file, cb) is callback
cb - callback similar to next
cb(null,'public/img/users')

mimetype conatin extension
image/jpeg

null or err

const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image'))
        cb(null,true)
    else
        cb(err,false)
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})
*/
/*
Image Processing
Sharp
npm i sharp
Another middleware before uploadUserPhoto
Since we are doing processing we prefer image to be in buffer 
instead of storing directly to file system in the in multer storage

const multerStorage = multer.diskStorage();

req.file.buffer

sharp(req.file.buffer)
Then chain multiple methods in order to do image processing on image
resize(500,500,options)
toFormat('jpeg')
Then we can use jpeg methods
jpeg({quality: 90})

Now we need to again store that file into disk
toFile(`public/img/users${req.file.filename}`)

Since we move to memoryStorage filename is not defined so we need to defined it to req.file.filename 
in order to pass it middleware updateMe as before

In UI for form 
input.form__upload(type='file', accept='image/*')

Also if we want it to do without api 
form.form.form-user-data(action='/submit-user-data', method='POST',enctype='multipart/form-data')

enctype must be added


However in API
const form = new FormData();

form.append('name', document.getElementById('name').value);
form.append('email', document.getElementById('email').value);
form.append('photo', document.getElementById('photo').files[0])

and send form as it in api call
*/
/*
Uploading mulitple images using multer

upload.fields([
    {
        name: 'imageCover',
        maxCount: 1,
    },
]);

This name is for field which will be passed in req.body and 
req.file  is created by multer middleware

If we need only one field with mulitple images

upload.array('images', 3);

req.files
*/
/*
Complex Email Handler

Build email templates
sendGrid Service

new Email(user, url).sendWelcome()
url can be reset url 

Then this sendWelcome which is more specific version of send
will take care of the template and subject to be passed

Also then in send it will create transporter by calling createTransport method which
indeed take care of the mode of application
and Finally send method will send the email

res.render('') creates html based upon pug template

pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,options);
options - we can pass locals

However here we need that sendWelcome to create html template

Also we can then add text removing all the html element

npm i string-strip-html
npm i html-to-text

htmlToText.fromString(html)

Converted from HTML using https://html2pug.now.sh/

*/
/*
SendGrid

Setup Guide
SMTP Relay 
or we can use web api 
but as we are using nodemailer we must choose SMTP relay

Also nodemailer service of sendgrid is already defined
So instead of host and port just set service

MailSac service to create disposable

*/
/*
Billing

Accepting credit card using Stripe

Settings/Branding to add logo and all

Checkout with Server

Stripe WorkFlow

Back-end Stripe Checkout Session (Secret Key)
Front-end Requiest Checkout Session
Front-end Charge credit card using Session (Public Key)
Back-end Use Stripe Webhook to create New Booking (Secret Key) - only done on deployed website


Creating route for /checkout-session/:tourId
And creating session

npm i stripe
*/
