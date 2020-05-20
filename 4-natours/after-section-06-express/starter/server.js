const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// console.log(app.get('env'));

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening to http://localhost:${port}`);
});
