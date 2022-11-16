var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    server = https.createServer(sslProperties, app);
}
else {
    server = http.createServer(app);
}
let actionbar = '';
const typer = {};
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    console.log('Connection');
    socket.on('newMessage', (obj) => __awaiter(this, void 0, void 0, function* () {
        try {
            const validate = database.getSchema('message').validate(obj, true);
            const message = validate.object;
            yield database.get('messages').create(message);
            io.emit('newMessage', message);
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }));
    socket.on('action', (data) => {
        if (data.type == 'typing') {
            if (data.info == 'started') {
                typer[data.name] = true;
                calcAndSendActionbar();
            }
            if (data.info == 'stopped') {
                delete typer[data.name];
                calcAndSendActionbar();
            }
        }
    });
});
function calcAndSendActionbar() {
    let actionbar = '';
    if (Object.keys(typer).length == 0) {
        io.emit('actionbar', '');
        return;
    }
    Object.keys(typer).forEach(name => {
        actionbar += name + ', ';
    });
    actionbar += ' is currently typing';
    io.emit('actionbar', actionbar);
}
app.get('/', (req, res) => {
    res.json({ message: 'Working API' });
});
app.get('/messages', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        let response = yield database.get('messages').get();
        response = response.sort((a, b) => b.created_at - a.created_at);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
}));
app.post('/messages', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const validate = database.getSchema('message').validate(req.body, true);
        const message = validate.object;
        const response = yield database.get('messages').create(message);
        res.json(response);
    }
    catch (error) {
        console.log('Error: ', error);
        next(error);
    }
}));
app.use((err, req, res, next) => {
    res.json(err);
});
app.use((req, res) => {
    res.json({ message: 'NotFound' });
});
const PORT = process.env.PORT || 3100;
server.listen(PORT, () => {
    console.log(`Express App Listening ${process.env.https ? 'with SSL ' : ''}on ${PORT}`);
});
