<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import type { Game } from '$lib/types/game';
	import { getPlayer } from '$lib/utils/users';

	export let gameStore: RealtimeWritable<Game>;

	interface AggregatedVotes {
		[playerId: string]: number;
	}

	function aggregateVotes(game: Game) {
		const votes: AggregatedVotes = {};

		// Initalize votes to zero
		for (const player of game.players) {
			votes[player.id] = 0;
		}

		// Increment the people who were voted for
		if (game.currentRound !== undefined) {
			for (const answer of game.currentRound.answers) {
				votes[answer.answer]++;
			}
		}

		return votes;
	}

	const aggregatedVotes = aggregateVotes($gameStore);
	const aggregatedVoteArray: [string, number][] = Object.keys(aggregatedVotes).map((key) => [
		key,
		aggregatedVotes[key]
	]);
</script>

{#each aggregatedVoteArray as voteElement (voteElement[0])}
	<p>{getPlayer($gameStore, voteElement[0])?.name} was voted for {voteElement[1]} times</p>
{/each}
