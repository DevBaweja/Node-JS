/*
Event Emitters - emits events and then Event Listeners - listen events and calls attached callbacks functions
OBSERVER Pattern - there is an observer (Event Listener) which keeps observing the subject (Event Emitter) 
which will eventually emit event that listener is waiting for
*/

/*
const EventEmitter = require('events');
const state = {};
state.sale = false;
state.costumers = [];
state.orders = [];


class ShoppingApp extends EventEmitter{
    constructor() {
        super();
    }
}
const App = new ShoppingApp();

App.on('newSale', () => {
    console.log('There was new sale');
    state.sale = true;
});

App.on('newCostumer', (costumer) => {
    console.log('New Costumer is added');
    state.costumers.push(costumer);
});

App.on('newOrder', (order) => {
    console.log('Costumer just ordered something');
    state.orders.push(order);
});

App.emit('newSale');
App.emit('newCostumer', { cid: 0, name: 'Jonas', age: 18 });
App.emit('newCostumer', { cid: 1, name: 'Mike', age: 20 });
App.emit('newOrder', { cid : 0,pid: 100, pname: 'Car', price: 50000 });
App.emit('newOrder', { cid : 1,pid: 101, pname: 'Bike', price: 30000 });

console.log(state);
*/

// NOTE:
/*
const EventEmitter = require('events');
const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
    console.log('Request Received');
    console.log(req.url);
    res.end('Request Received');
});

server.on('request', (req, res) => {
    console.log('Another Request');
});

server.on('close', () => {
    console.log('Server Closed');
});

server.listen(8000, 'localhost', () => {
    console.log('Listening to http://localhost:8000');
});
*/
/*
const EventEmitter = require('events');
class Emitter extends EventEmitter {
    constructor() {
        super();
    }
}
const emitter = new Emitter();
emitter.on('anyevent',()=>{
    console.log('Event Occur');
});
emitter.emit('anyevent');
*/

