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
Client Side Vs Server Side Rendering

Server Side
Database - Get Data - Build Website with Template + Browser 
Client Side
Database - Get Data - Json + Browser + Build Website with Template
*/
/*
Server Side Rendering with Pug in Express

Template Engine
Create template and easily fill up template with data
Pug,handleBars,EGS


app.set('view engine','pug')
app.set('views','./views')
It will then connect app with views

here we are using ./ it is relative path where node project is run so it might not be always in starter
so we need absolute path __dirname

app.set('views',path.join(__dirname, 'views'))

Another nice trick is to use path core module of node
path.join(__dirname, 'views')
*/
/*
Pug

npm i pug

However express will automatically require it and use it we don't need to explicit require pug
<h1>Heading</h1>
h1 Heading

app.get('/',(req, res)=>{
    res.status(200).render('base')
})

base.pug will render from './views'

render is used to render html or pug into browser
Indentation sensitive syntax

Basic template structure of pug

doctype html

html(lang="en")
    head
        meta(charset="UTF-8")
        meta(name="viewport",content="width=device-width, initial-scale=1.0")
        title document
    body

Attributes are given with paranthesis instead of putting them together in <> tag

Also attribute separation is done with commas instead of empty space in html
or actually we can use both empty space and as well as commma

Also we can use single quotes instead of double quotes in html
*/
/*
Also now public folder is been rendered by express as we mentioned

app.use(express.static(`${__dirname}/public`))
So all of the css,js and img files will go into public folder
And in pug we can directly assume that we are in public folder and use that as only rendered folder is public and also each of these get their own request which can be fulfilled by public folder

Also as in public static folder we don't need to specify public in it so request is fulfilled correctly

Each of its own asset actually trigger its own http request
We don't have route handler of any of these assets

Get request to this url of assets
express.static all the static assets will automatically be served from folder called public
*/
/*
Variables in Pug
Data is passed as option in render where use render base 

echo is done in pug by using 
title= title

1) Use this first

app.set('views', __dirname + '/public/views');
app.set('view engine', 'pug');

2) Then pass this to first visit

app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});

3) Then echo in template file "index.pug" in "/public/views"

html
   head
   title= title
body
   h1= message

These variables are then called locals in pug files

Comment in pug

This // will create comment that will be visible in html ie html comment
This //- will create comment that will be hidden ie comment in pug file

Variables or locals in pug 
h1= tour
This type of code is called buffer code
h1= JavaScript Code

Buffered Code 
Code that produce output in html it can be simply variable or it can be javascript code
tag= Variable | JavaScript code

Unbuffered Code
Code that will not produce output in html ie simply javascript code
- JavaScript code

Interpolation 
#{}
Even her ewe can write Javascript code

<!DOCTYPE html>
doctype html
html(lang='en')
    head
        meta(charset='UTF-8')
        meta(name='viewport', content='width=device-width, initial-scale=1.0')
        title Natours | #{tour}
        link(rel="stylesheet", href="css/style.css")
        link(rel="shortcut icon", type="image/png",href="img/favicon.png")
    body
        h1= tour.toUpperCase()
        //- h1= tour

        - const text = 'How are you?';
        h3= text
        p= user

Actually we can still use html in pug

In some case we really need to put in same line as code
li: a(href='/') About us
can be done by using : colon
*/
/*
Including files into Pug Templates

include includes/fileName

Extending our base template with blocks

In case of overview or tour, we want to put content of that specific page no footer and no header
Inject this content into base template
Extending

Parent - Put block
block content

Child - Redefine
extends parent

Redefine
block content

Each file can extends only one other file
But we can have different block in each of file

Parent includes child template
Child extends Parent template

As child will then copy code of parent and replace it with the block that we created in child template
Also it looks like parent with then be able to access locals of child
However it is done as value of locals be replaced after code have been copied 
*/
/*
each tour in tours

In alt=`${}` we can now use template string

= Javascript Code / Variable
#{Javascript Code / Variable}

Javascript Code = `${}`

In order to create real space between inline-element in pug we can | piped line
*/
/*
Mixin 
mixin name()

+name()

each tour,index in tours

Index can also be available

Unbuffered Code
- Javascript Code
*/
/*
Adding 
block append head
block prepend head

Also using client side public/js for client side map
Now actually we can do ajax calls to get that data in client side
However another way is use data attribute on html and expose that data into that and then read it from there using dataset

#map(data-locations = `${JSON.stringify()}`)
Then in js
JSON.parse(selector.dataset.locations)
will retunrn data as it is

Also to read it we need that html is rendered first then js file is runned actually this is main reason why we out users scripts files in end of html
*/
/*
Mapbox

cdn - Content Delivery Network


<script src='https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js'></script>
<link href='https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.css' rel='stylesheet' />

Create new Access token 
mapboxgl.accessToken

const map = new mapboxgl.Map({
    container: 'map'.
    style: '',
    center: [lng,lat],
    zoom: <int>,
    interactive: true    
})

Container will contain map with given id 'map'
Create new style and then add it here
Then center as array of coordinates similar to mongodb
zoom
interactive

const bounds = new mapboxgl.LatLngBounds();
Creating bound which will then be extend to coordinates

Also creating marker with
new mapboxgl.Marker({
    element: el,
    anchor: 'bottom' 
}).setLngLat(coordinates).addTo(map)

bounds.extend(coordinate)

map.fitBounds(bounds);
*/
/*
Client side making ajax calls to login 
Now cookie will be created

Getting access to cookies in req by express
npm i cookie-parser

app.use(cookieParser());

req.cookies

In authController add else if for cookie also

Also protect viewRoute with authController which check for cookie

res.locals() - way to transport from server side to templates
which can then be used by template to determine if user is logged in or not

Pug also support if else 

Bundling file using parcel 
parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js
*/
/*
Logging out users

As cookie is http-only so it cann't be manipulate in any way
So to log out 

Reloading page
window.setTimeout(()=>{
    location.assign('/')
},1000)

loction.reload(true)

Here true is that will force reload from server and not from browser cache

Since jwt is set as some dummy text 
jwt.verify will return error which we don't want in case of loggedIn 
so we will remove catchAsync and add try catch block to it and in catch simply call next middleware
*/
/*
Form html tag can also be used to submit request to end point for updating data 

form(action='url' method='POST')
Default way to send data
URL Encoding
Also specify name to send data


And simpler solution is offcourse using api call and make post request to ajax

Now it will also not work as need to parse data coming from form
app.use(express.urlencoded);

*/
