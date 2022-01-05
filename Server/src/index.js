const express = require('express');
const https = require('https');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv').config();

const { Database } = require('@jodu555/mysqlapi');

const database = Database.createDatabase('localhost', 'root', '', 'rt-chat');
database.connect();
require('./utils/database')();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Working API' })
});

app.get('/messages', async (req, res, next) => {
    try {
        const response = database.get('messages').get();
        res.json(response);
    } catch (error) {
        next(error)
    }
});

app.post('/messages', (req, res, next) => {
    try {
        const validate = database.getSchema('message').validate(req.body, true);
        const message = validate.objects;

        database.get('messages').create(message);
    } catch (error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    res.json(err);
})

app.use((req, res) => {
    res.json({ message: 'NotFound' })
});


const PORT = process.env.PORT || 3100;
if (process.env.https) {
    const sslProperties = {
        key: fs.readFileSync(process.env.KEY_FILE),
        cert: fs.readFileSync(process.env.CERT_FILE),
    };
    https.createServer(sslProperties, app).listen(PORT, () => {
        console.log(`Express App Listening with SSL on ${PORT}`);
    });
} else {
    app.listen(PORT, async () => {
        console.log(`Express App Listening on ${PORT}`);
    });
}