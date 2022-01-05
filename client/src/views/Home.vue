<template>
	<div>
		<input v-model="name" type="text" placeholder="Your Name" />
		<div v-if="name">
			<h1>Hello World</h1>
		</div>
	</div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
	name: 'Home',
	created() {},
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
