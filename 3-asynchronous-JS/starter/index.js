const fs = require('fs');
const superagent = require('superagent');
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

// Promises - Chaining
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
