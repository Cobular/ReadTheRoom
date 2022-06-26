<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import { GameState, type Game } from '$lib/types/game';

	import authStore from '$lib/stores/authStore';

	export let gameStore: RealtimeWritable<Game>;
</script>

<div class="flex flex-col gap-2">
	<h1 class="text-4xl m-auto inline-block">Waiting For Players!</h1>
	<div>
		<h3 class="text-lg">Current Players:</h3>
		<ol class="list-greek">
			{#each $gameStore.players as player, i (player.id)}
				<li class="ml-7">{player.name}</li>
			{/each}
		</ol>
	</div>

	<p class="text-lg">
		Your displayname: <span class="font-semibold">{$authStore.user?.displayName}</span>
	</p>
	{#if $gameStore.owner === $authStore.user?.uid}
		<p>You are the owner! Press the button below to start the game.</p>
		<button on:click={() => gameStore.commit({ state: GameState.STARTING })} class="rounded-md bg-light-blue-300 inline-block">Start Game</button>
	{/if}
</div>
