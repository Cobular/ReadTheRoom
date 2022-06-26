<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import type { Game } from '$lib/types/game';
	import { nextRound } from '$lib/utils/nextRound';
	import { isPlayerAsker } from '$lib/utils/users';
import RawVoteDisplay from '../rawVoteDisplay.svelte';

	export let gameStore: RealtimeWritable<Game>;
	export let thisUserId: string;
</script>

<p>The coin landed heads!</p>

<RawVoteDisplay {gameStore} />

{#if isPlayerAsker($gameStore, thisUserId)}
	<button on:click={() => nextRound(gameStore)}>Next Round!</button>
{:else}
  <p>Waiting for the question askwer to go to the next round</p>
{/if}
