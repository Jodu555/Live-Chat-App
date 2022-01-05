const express = require('express');
const https = require('https');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv').config();

const { Database } = require('@jodu555/mysqlapi');

const database = Database.createDatabase('localhost', 'root', '', 'rt-chat');
database.connect();

database.createTable('messages', {
    options: {
        //Enables softdelete
        softdelete: true,
        //Enable all available timestamps
        timestamps: true,
        K: ['name']
    },
    'name': {
        type: 'varchar(64)',
        null: false,
    },
    'name': {
        type: 'Text',
        null: false,
    },
});

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Working API' })
});

app.get('/messages', async (req, res) => {

});

app.post('/messages', (req, res) => {

});

app.use((err, req, res, next) => {
    res.json(error);
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