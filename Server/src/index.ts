import fs from 'fs';
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import https from 'https';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

import { Database } from '@jodu555/mysqlapi';

const database = Database.createDatabase('localhost', 'root', '', 'rt-chat');
database.connect();
const databaseModule = require('./utils/database');
// import * as databaseModule from './utils/database';
databaseModule();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

let server: http.Server | https.Server;
if (process.env.https) {
	const sslProperties = {
		key: fs.readFileSync(process.env.KEY_FILE as string),
		cert: fs.readFileSync(process.env.CERT_FILE as string),
	};
	server = https.createServer(sslProperties, app);
} else {
	server = http.createServer(app);
}

let actionbar = '';
const typer = {};

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});
io.on('connection', (socket) => {
	console.log('Connection');
	socket.on('newMessage', async (obj) => {
		try {
			const validate = database.getSchema('message').validate(obj, true);
			const message = validate.object;
			await database.get('messages').create(message);
			io.emit('newMessage', message);
		} catch (error) {
			console.log('Error: ', error);
		}
	});
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

function calcAndSendActionbar(): void {
	let actionbar = '';
	if (Object.keys(typer).length == 0) {
		io.emit('actionbar', '');
		return;
	}
	Object.keys(typer).forEach((name) => {
		actionbar += name + ', ';
	});

	actionbar += ' is currently typing';
	io.emit('actionbar', actionbar);
}

app.get('/', (req, res) => {
	res.json({ message: 'Working API' });
});

app.get('/messages', async (req, res, next) => {
	try {
		let response = await database.get('messages').get();
		response = response.sort((a, b) => b.created_at - a.created_at);
		res.json(response);
	} catch (error) {
		next(error);
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

class HttpException extends Error {
	status: number;
	message: string;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.message = message;
	}
}

import { NextFunction, Request, Response } from 'express';

app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
	res.json(err);
});

app.use((req, res) => {
	res.json({ message: 'NotFound' });
});

const PORT = process.env.PORT || 3100;
server.listen(PORT, () => {
	console.log(`Express App Listening ${process.env.https ? 'with SSL ' : ''}on ${PORT}`);
});
