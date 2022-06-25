<script>
	import authStore from '$lib/stores/authStore';
	
	import { initializeApp } from 'firebase/app';
	import { getAnalytics } from "firebase/analytics";
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		const firebaseConfig = {
			apiKey: 'AIzaSyCxKJD_-ZoDHaloN60WrkSOquhAWFVnDp4',
			authDomain: 'readtheroom-e043a.firebaseapp.com',
			projectId: 'readtheroom-e043a',
			storageBucket: 'readtheroom-e043a.appspot.com',
			messagingSenderId: '137930922577',
			appId: '1:137930922577:web:06dcd8040a41c031e73670',
			measurementId: 'G-CBBM52BCRW'
		};

		const app = initializeApp(firebaseConfig);
		getAnalytics(app)

		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			authStore.set({
				isLoggedIn: user !== null,
				user: user !== null ? user : undefined,
				firebaseControlled: true
			});
		});
	});
</script>

<slot />
