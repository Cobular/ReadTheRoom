<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import { GameState, type Game } from '$lib/types/game';
	import { getAsker, isPlayerAsker } from '$lib/utils/users';
	import AggregatedVoteDisplay from '../aggregatedVoteDisplay.svelte';
	import RawVoteDisplay from '../rawVoteDisplay.svelte';

	export let gameStore: RealtimeWritable<Game>;
	export let thisUserId: string;

	let timer = 5;

	function countdown() {
		if (timer > 0) {
			timer--;
			setTimeout(countdown, 1000);
		} else {
			if (isPlayerAsker($gameStore, thisUserId)) {
				gameStore.commit({
					state: GameState.COIN_FLIP
				});
			}
		}
	}
</script>

<h1>The votes are in!</h1>

<AggregatedVoteDisplay {gameStore} />

{#if isPlayerAsker($gameStore, thisUserId)}
	<p>Here's the skinny, just for you:</p>

	<RawVoteDisplay {gameStore} />

	<p>Flip the coin when you're ready to see if everyone else gets to know:</p>

	<button
		on:click={() => {
			countdown();
		}}>Flip it!!</button
	>
{:else}
	<p>Ask {getAsker($gameStore).name} to flip the coin!</p>
{/if}
