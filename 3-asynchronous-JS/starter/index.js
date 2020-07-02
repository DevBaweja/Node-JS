const fs = require('fs');
const superagent = require('superagent');
// NOTE:
// Callback Hell - Nesting
/*
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    if (err) return console.log(err.message);
    console.log(`Breed : ${data}`);

    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, res) => {
        if (err) return console.log(err.message);
        console.log(res.body.message);

        fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, err => {
            if (err) return console.log(err.message);
            console.log('Random Dog image saved to file');
        });
    });
});
*/
// NOTE:
// Consuming Promises - Chaining
/*
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    if (err) return console.log(err.message);
    console.log(`Breed : ${data}`);

    superagent
        .get(`https://dog.ceo/api/breed/${data}/images/random`)
        .then(res => {
            console.log(res.body.message);

            fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, err => {
                if (err) return console.log(err.message);
                console.log('Random Dog image saved to file');
            });
        })
        .catch(err => {
            console.log(err.message);
        });
});
*/
// NOTE:
// Creating Promises
const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};
const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) reject(err);
            resolve();
        });
    });
};
// NOTE:
// Flat Structure of Promises
/*
readFilePro(`${__dirname}/dog.txt`)
.then(data => {
    console.log(`Breed : ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
})
.then( res => {
    console.log(res.body.message);
    return writeFilePro(`${__dirname}/dog-img.txt`,res.body.message)
})
.then( () => {
    console.log('Random Dog image saved to file');

})
.catch(err => {
    console.log(err.message);
});
*/

// NOTE:
// Async / Await
// Syntactic sugar for Promises
/*
const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed : ${data}`);

        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);

        await writeFilePro(`${__dirname}/dog-img.txt`, res.body.message);
        console.log('Random Dog image saved to file');
        
    } catch (err) {
        console.log(err.message);
    }
};
getDogPic();
*/

// Returning Values from Async/Await
//  Async function returns promise automatically
/*
const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed : ${data}`);

        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);

        await writeFilePro(`${__dirname}/dog-img.txt`, res.body.message);
        console.log('Random Dog image saved to file');
    } catch (err) {
        console.log(err.message);
        throw err;
    }
    return '2: Ready';
};
*/
// console.log('1: Will get dog pics!');
/*
getDogPic();
console.log('3: Done getting dog pics!');
*/
/*
const step = getDogPic();
console.log(step);
console.log('3: Done getting dog pics!');
*/
/*
getDogPic()
    .then(step => {
        console.log(step);
        console.log('3: Done getting dog pics!');
    })
    .catch(err => {
        console.log('Error');
    });
*/
// Even though there was error promise will go into then (Resolved,Rejected)
// so to really make it catch we need to throw error
/*
(async () => {
    try {
        console.log('1: Will get dog pics!');
        const step = await getDogPic();
        console.log(step);
        console.log('3: Done getting dog pics!');
    } catch (err) {
        console.log('Error ');
    }
})();
*/

// NOTE:
// Waiting for multiple promises simutaneously

const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed : ${data}`);

        // Saving Promise
        const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        // Creates a Promise that is resolved with an array of results when all of the provided Promises resolve, or rejected when any Promise is rejected.
        const all = await Promise.all([res1Pro, res2Pro, res3Pro]);

        // Creates a Promise that is resolved or rejected when any of the provided Promises are resolved or rejected.
        const one = await Promise.race([res1Pro, res2Pro, res3Pro]);

        const imgs = all.map(cur => cur.body.message);
        console.log(imgs);

        await writeFilePro(`${__dirname}/dog-img.txt`, imgs.join('\n'));
        console.log('Random Dog image saved to file');
    } catch (err) {
        console.log(err.message);
        throw err;
    }
    return '2: Ready';
};

(async () => {
    try {
        console.log('1: Will get dog pics!');
        const step = await getDogPic();
        console.log(step);
        console.log('3: Done getting dog pics!');
    } catch (err) {
        console.log('Error ');
    }
})();
