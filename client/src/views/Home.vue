<template>
	<div>
		<input v-model="name" type="text" placeholder="Your Name" />
		<div v-if="name">
			<div class="chat">
				<div class="chat__wrapper">
					<div class="chat__message">
						<div class="date"></div>
						<div>Message #1</div>
					</div>
					<div class="chat__message chat__message-own">
						<div class="date"></div>
						<div>Message #2</div>
					</div>
				</div>
			</div>
			<div class="chat__form">
				<form id="chat__form">
					<input id="text-message" type="text" placeholder="Type your message here ..." />
					<button type="submit">Send</button>
				</form>
			</div>
			<div id="result"></div>
			<br />
			<small>{{ actionbar }}</small>
			<br />
			<form @submit.prevent="sendMessage">
				<div class="row" style="width: 100%">
					<div class="col-9">
						<input
							v-model="message"
							@input="typing"
							style="width: 100%"
							type="text"
							placeholder="Your Message"
						/>
					</div>
					<div class="col-3">
						<button class="btn btn-outline-primary" style="width: 100%">Send</button>
					</div>
				</div>
			</form>
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
				return this.$store.state.name;
			},
			set(value) {
				this.$store.commit('setName', value);
			},
		},
	},
};
</script>

<style scoped lang="scss">
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
	height: calc(100vh - 50px);
	min-height: 100%;
	padding: 15px 30px;
	margin: 0 auto;
	overflow-y: scroll;
	background-color: #fff;
	transform: rotate(180deg);
	direction: rtl;
	&__wrapper {
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
	&__message {
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
		&:after {
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
		&-own {
			color: #fff;
			margin-left: auto;
			background-color: #00a9de;
			&:after {
				width: 19px;
				height: 13px;
				left: inherit;
				right: -5px;
				background-image: url('https://stageviewcincyshakes.firebaseapp.com/icon-blue-message.2be55af0d98ee2864e29.png');
			}
		}
	}
}

.chat__form {
	background-color: #e0e0e0;
	form {
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
	input {
		height: 40px;
		font-size: 16px;
		min-width: 90%;
		padding-left: 15px;
		background-color: #fff;
		border-radius: 15px;
		border: none;
	}
	button {
		width: 10%;
		height: 100%;
		font-size: 16px;
		background-color: transparent;
		border: none;
		text-align: center;
		text-transform: uppercase;
		cursor: pointer;
		&:hover {
			font-weight: bold;
		}
	}
}
</style>
