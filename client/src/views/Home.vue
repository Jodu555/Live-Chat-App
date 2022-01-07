<template>
	<div>
		<input v-model="name" type="text" placeholder="Your Name" />
		<div v-if="name">
			<div class="chat">
				<div class="chat__wrapper">
					<div
						v-for="message in messages"
						:key="message.name"
						:class="{ chat__message: true, 'chat__message-own': message.name == name }"
					>
						<div class="date">
							{{ message.name }} - {{ new Date(Number(message.created_at)).toLocaleTimeString() }}
						</div>
						<div>{{ message.message }}</div>
					</div>
				</div>
			</div>
			<small>{{ actionbar }}</small>
			<div class="chat__form">
				<form @submit.prevent="sendMessage">
					<input
						v-model="message"
						@input="typing"
						type="text"
						placeholder="Type your message here ..."
					/>
					<button type="submit">Send</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
const { io } = require('socket.io-client');

export default {
	name: 'Home',
	data() {
		return {
			socket: null,
			message: '',
			actionbar: '',
			isTyping: false,
			lastTyping: null,
		};
	},
	created() {
		this.socket = io('http://localhost:3100');
		this.socket.on('newMessage', (message) => {
			this.appendMessage(message);
		});
		this.socket.on('actionbar', (text) => {
			this.actionbar = text;
		});
		this.loadMessages();
	},
	unmounted() {
		this.socket.disconnect();
	},
	methods: {
		...mapActions(['loadMessages']),
		...mapMutations(['appendMessage']),
		sendMessage() {
			this.socket.emit('newMessage', { name: this.$store.state.name, message: this.message });
			this.message = '';
		},
		typing() {
			if (!this.isTyping) {
				const time = Date.now();
				this.lastTyping = time;
				this.isTyping = true;
				this.socket.emit('action', { type: 'typing', info: 'started', name: this.name });
				setTimeout(() => {
					if (this.lastTyping == time) {
						this.isTyping = false;
						this.lastTyping = null;
						this.socket.emit('action', { type: 'typing', info: 'stopped', name: this.name });
					}
				}, 2000);
			}
		},
	},
	computed: {
		...mapState(['messages']),
		name: {
			get() {
				console.log(123);
				return this.$store.state.name;
			},
			set(value) {
				this.$store.commit('setName', value);
			},
		},
	},
};
</script>

<style scoped>
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

*:hover,
*:focus {
	outline: none;
}

.chat {
	width: 100%;
	max-width: 800px;
	height: calc(100vh - 130px);
	min-height: 100%;
	padding: 15px 30px;
	margin: 0 auto;
	overflow-y: scroll;
	background-color: #fff;
	transform: rotate(180deg);
	direction: rtl;
}
.chat__wrapper {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-orient: vertical;
	-webkit-box-direction: normal;
	-ms-flex-direction: column-reverse;
	flex-direction: column-reverse;
	-webkit-box-pack: end;
	-ms-flex-pack: end;
	justify-content: flex-end;
}
.chat__message {
	font-size: 18px;
	padding: 10px 20px;
	border-radius: 25px;
	color: #000;
	background-color: #e6e7ec;
	max-width: 600px;
	width: -webkit-fit-content;
	width: -moz-fit-content;
	width: fit-content;
	position: relative;
	margin: 15px 0;
	word-break: break-all;
	transform: rotate(180deg);
	direction: ltr;
}
.chat__message:after {
	content: '';
	width: 20px;
	height: 12px;
	display: block;
	background-image: url('https://stageviewcincyshakes.firebaseapp.com/icon-gray-message.e6296433d6a72d473ed4.png');
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	position: absolute;
	bottom: -2px;
	left: -5px;
}
.chat__message-own {
	color: #fff;
	margin-left: auto;
	background-color: #00a9de;
}
.chat__message-own:after {
	width: 19px;
	height: 13px;
	left: inherit;
	right: -5px;
	background-image: url('https://stageviewcincyshakes.firebaseapp.com/icon-blue-message.2be55af0d98ee2864e29.png');
}

.chat__form {
	background-color: #e0e0e0;
}
.chat__form form {
	max-width: 800px;
	margin: 0 auto;
	height: 50px;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
}
.chat__form input {
	height: 40px;
	font-size: 16px;
	min-width: 90%;
	padding-left: 15px;
	background-color: #fff;
	border-radius: 15px;
	border: none;
}
.chat__form button {
	width: 10%;
	height: 100%;
	font-size: 16px;
	background-color: transparent;
	border: none;
	text-align: center;
	text-transform: uppercase;
	cursor: pointer;
}
.chat__form button:hover {
	font-weight: bold;
}
</style>
