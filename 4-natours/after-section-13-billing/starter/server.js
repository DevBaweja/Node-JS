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

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

stripe.checkout.sessions.create(options)

options = {
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
    costumer_email: req.user.email,
}
stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
        costumer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [
                    `https://www.natours.dev/img/tours/${tour.imageCover}`,
                ],
                amount: tour.price(in cents),
                currency: 'usd' | 'eur';
                quantity: 1
            },
        ],
    });

Custom field
Client reference ID - It allow us to pass data about session that we are currently creating

It is need as once later purchase was successful, we will then get access to this session object again 
in order to mark booking in dataase

line_items - only have some well defined fields
images - must be live images (only work once deployed)
clint_refernce_id - It will need once we book tour (Also after deployed)

npm stripe works only on backend
For front end we need script

On server add script 
https://js.stripe.com/v3/

And it expose Stripe
cont stripe = Stripe(Public_Key)

data-tour-id
dataset.tourId

await stripe.redirectToCheckout({
        sessionId: data.session.id,
    });

Credit Card - 4242 4242 4242 4242
Month/Date - Anything in future

Setting Emails - Successfully payments
*/
/*
Booking Model

User and Tour as parent ref

Also price is stored so that while displaying booking we don't have to check from Tour document
as also tour price might be changed then we will not know how much user paid to us

Also paid is stored as admin might want to create booking outside of that using api
Default is paid as will create mostly by stripe 

Once website is deployed on server we will get access to session object once purchase 
is complete using stripe webhooks

Simply to put data that we need to create new booking right into url as query 
string we need to create query string as stripe will make get request to this url
so we cann't really send  body 

In success url pass all the data
and create route at / with query string
add middleware to create booking and also
redirect to to again / without query string
res.redirect(req.originalUrl.split('?')[0]);
*/
/*
TODO:
API

Implement restriction that users can only review tour that they have actually booked

Implement nested bookings routes 
/tours/:id/bookings
/users/:id/bookings

Improve tour dates 
add participants and soldOut field to each date. A date then becomes like instance of the tour
Then when user books, they need to select one of the dates. A new booking will increase # of participants in the date, untill it is soldOut, so when user book you need to check if tour on selected date is available

Adding api features to bookings also


Implement advance authentication features confirm user email, keep user logged in with refresh tokens,
two factor authentication

Also in admin while delete and updating some resource
Also in booking confirm password of user

TODO:
Website

New page for booking

Filtering in website

Adding intermediate page between payment and the tour ie for selecting date

Search functionality for the tour and maybe in my-tours

Better implementation of front-end

Search by dates

Only adding scripts to the that need them

Implement signup form, similar to login form

On tours details page, if user has taken tour, allow them add a review directly
on website. Implement form for this and also check for time of tour 

Hide entire booking section on the tour details page if current user has already booked
an tour(also prevent duplicate bookings on model)

Implement like tour functionality with favourite tour page

On user account page, implement My Reviews page where all reviews are displayed, and
user can edit them

For administrators, implement all Manage pages, where they can CRUD tours, users, update, delete
*/
