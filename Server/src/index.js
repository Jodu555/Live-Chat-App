const http = require('http');
const express = require('express');
const { Server } = require("socket.io");
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

let server;
if (process.env.https) {
    const sslProperties = {
        key: fs.readFileSync(process.env.KEY_FILE),
        cert: fs.readFileSync(process.env.CERT_FILE),
    };
    server = https.createServer(sslProperties, app)
} else {
    server = http.createServer(app);
}

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    console.log('Connection');
    socket.on('newMessage', async (obj) => {
        console.log('New Message', obj);
        try {
            const validate = database.getSchema('message').validate(obj, true);
            const message = validate.object;
            await database.get('messages').create(message);
            io.emit('newMessage', message);
        } catch (error) {
            console.log('Error: ', error);
        }
    })
});


app.get('/', (req, res) => {
    res.json({ message: 'Working API' })
});

app.get('/messages', async (req, res, next) => {
    try {
        const response = await database.get('messages').get();
        res.json(response);
    } catch (error) {
        next(error)
    }
});

app.post('/messages', async (req, res, next) => {
    try {
        const validate = database.getSchema('message').validate(req.body, true);
        const message = validate.object;
        const response = await database.get('messages').create(message);
        res.json(response);
    } catch (error) {
        console.log('Error: ', error);
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
server.listen(PORT, () => {
    console.log(`Express App Listening ${process.env.https ? 'with SSL ' : ''}on ${PORT}`);
});