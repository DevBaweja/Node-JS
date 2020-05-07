const fs = require('fs');
const crypto = require('crypto');
const start = Date.now();
// process.env.UV_THREADPOOL_SIZE = 1;
// NOTE:
// process.env variables can be set in npm script

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));
// Order of these have nothing to do with event loop
// These are not in event loop it is top level code
fs.readFile('test-file.txt', () => {
    console.log('IO finished');
    console.log('------------');

    setTimeout(() => console.log('Timer 2 finished'), 0);
    setTimeout(() => console.log('Timer 3 finished'), 3000);
    setImmediate(() => console.log('Immediate 2 finished'));
    // setImmediate() is before setTimout() due to polling of I/O

    process.nextTick(() => console.log('Process.nextTick'));
    //  process.nextTick() is executed first as it is executed after ever phase in this case I/O

    // nextTick() execute immediately
    // setImmediate() executed after next tick

    crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512');
    console.log(Date.now() - start, 'Password Encrpyted');

    crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512');
    console.log(Date.now() - start, 'Password Encrpyted');

    crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512');
    console.log(Date.now() - start, 'Password Encrpyted');
    // If Sync version is used it will not run in event loop and no longer be offloaded to threadpool

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password Encrpyted');
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password Encrpyted');
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password Encrpyted');
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password Encrpyted');
    });
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password Encrpyted');
    });
});
console.log('Hello from top level code');
