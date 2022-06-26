<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import { GameState, type Game } from '$lib/types/game';

	import authStore from '$lib/stores/authStore';

	export let gameStore: RealtimeWritable<Game>;
</script>

<h1>All Players</h1>
{#each $gameStore.players as player, i}
	<p>{player.name}</p>
{/each}
<p>Your displayname: {$authStore.user?.displayName}</p>
{#if $gameStore.owner === $authStore.user?.uid}
	<p>You are the owner! Press the button below to start the game.</p>
  <button on:click={() => gameStore.commit({state: GameState.STARTING})}>Start Game</button>
{/if}
