<template>
	<div>
		<input v-model="name" type="text" placeholder="Your Name" />
		<div v-if="name">
			<div class="chatbox">
				<p v-for="message in messages" :key="message.name">
					{{ message.name }}: {{ message.message }}
				</p>
			</div>
			<br />
			<div class="row" style="width: 100%">
				<div class="col-9">
					<input v-model="message" style="width: 100%" type="text" placeholder="Your Message" />
				</div>
				<div class="col-3">
					<button @click="sendMessage()" class="btn btn-outline-primary" style="width: 100%">
						Send
					</button>
				</div>
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
		return { socket: null, message: '' };
	},
	created() {
		this.socket = io('http://localhost:3100');
		this.socket.on('newMessage', (message) => {
			this.appendMessage(message);
		});
		this.loadMessages();
	},
	methods: {
		...mapActions(['loadMessages']),
		...mapMutations(['appendMessage']),
		sendMessage() {
			console.log(this.socket);
			this.socket.emit('newMessage', { name: this.$store.state.name, message: this.message });
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

<style scoped>
.chatbox {
	background-color: grey;
	min-height: 75vh;
}
</style>
