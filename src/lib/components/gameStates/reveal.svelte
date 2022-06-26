<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import type { Game, Player } from '$lib/types/game';
	import { nextRound } from '$lib/utils/nextRound';
	import { isPlayerAsker } from '$lib/utils/users';

	export let gameStore: RealtimeWritable<Game>;
	export let thisUserId: string;

	const thisUsersVoteId: string | undefined = $gameStore.currentRound.answers?.find(
		(answer) => answer.id === thisUserId
	)?.answer;

	const thisUsersVote: Player | undefined = $gameStore.players.find(
		(player) => player.id === thisUsersVoteId
	);
</script>

<p>The coin landed heads!</p>

<p>Go around, tell who you voted for and why!</p>

<p> As a reminder, you voted for {thisUsersVote?.name} </p>

{#if isPlayerAsker($gameStore, thisUserId)}
	<button on:click={() => nextRound(gameStore)}>Next Round!</button>
{:else}
  <p>Waiting for the question askwer to go to the next round</p>
{/if}
