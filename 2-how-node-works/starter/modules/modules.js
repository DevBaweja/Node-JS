/*
Each js file is treated as module

// Server Side
CommonJS Module system
require()
exports
module.exports

// Client Side
ES module system
import
export

There have been attempts to bring ES modules to node.js (.mjs)
*/

/*
require() - Behind the scenes

1. Resolving and Loading
    Core modules
    require('http');

    Developer modules
    require('./lib/controller');

    3-rd party modules(npm)
    require('express')

Path Resolving 
Start with node core modules
If begins with './' or '../' try to load developer modules
If no file found try to find folder with index.js in it
Else go to node_modules/ and try to find modules there


2. Wrapping 
NOTE:
Module's code is wrapped into special function
(function(exports,require,module,__filename,__dirname){
    // Module code lives here
})
IIFE but not immediately involked
To attain data encapsulation and abstraction
require - function to require modules
module - reference to current module
exports - a reference to module.exports, used to export object from a module
__filename - absolute path of current module's file
__dirname - directory name of current module

3. Execution

4. Returing Exports
require function return exports of required module
module.exports is returned object
NOTE:
ES Modules - Client Side
CommmonJS Modules - Server Side

CommonJS Modules
Use module.exports to export single class or function
ClassName may or may not be needed
module.exports = class {
  constructor(){

    }
};
const ClassName = require('core');
new ClassName();

ES Modules
export default class {
    constructor(){

    }
};
import ClassName from './models'
new ClassName();


CommonJs Modules
Use exports to export multiple named variables
exports.functionName = () => {

};
const {functionName} = require('core');
functionName();
const core = require('core');
core.functionName();

ES Modules
export const functionName = () => {

};
import {functionName} from './views'
functionName()
import * as objView from './views'
objView.functionName()

5. Caching
Once module is imported then subsequent calls result is simply retrieved from cache
*/


// argument is variable given to every function to get it arguments
// NOTE:
/*
console.log(arguments);
console.log('----------------------');
console.log(require('module').wrapper);
*/

// module.exports
/*
const CalClass = require('./module-1');
const cal = new CalClass();
console.log(cal.add(1,1));
*/

// exports
/*
const CalObj = require('./module-2');
console.log(CalObj.add(1,1));

const {add : adding} = require('./module-2')
console.log(adding(1,1));
*/

// caching
require('./module-3')();
require('./module-3')();
