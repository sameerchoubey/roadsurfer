<template>
	<div>
		<Header />
		<div class="flex justify-between max-w-100 mx-auto" style="max-width: 1280px;">
			<Week/>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		name: 'IndexPage',
		data () {
			return {
				posts: ''
			}
		},
		async mounted(){
			await this.$store.dispatch("api/GET_ACCOUNT_INFO");
		},
		computed: {
			...mapState ({
				apiResponse: state => state.api.apiResponse,
			}),
		}
		// async fetch() {
		// 	this.posts = await fetch('https://605c94c36d85de00170da8b4.mockapi.io/stations')
		// },
	}
</script>
