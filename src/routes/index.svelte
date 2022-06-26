<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import JoinGame from '$lib/components/join-game.svelte';
import Rules from '$lib/components/rules.svelte';
</script>

<main class="flex flex-col">
	<header class="flex flex-col items-center pt-20">
		<div>
			<h1 class="text-2xl <md:text-xl">Welcome to ...</h1>
			<h1 class="text-5xl <md:text-4xl pb-5">Read The Room!!</h1>
			<p>Enter a room code and your name to join a game!</p>
		</div>
	</header>

	<JoinGame />

  <Rules />
</main>
