<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import type { Game } from '$lib/types/game';
	import { getPlayer } from '$lib/utils/users';

	export let gameStore: RealtimeWritable<Game>;

	const currentRound = $gameStore.currentRound || { answers: [] };

	let voteList: [string, string][] = currentRound.answers.map((answer) => [
		getPlayer($gameStore, answer.id)?.name as unknown as string,
		getPlayer($gameStore, answer.answer)?.name as unknown as string
	]);
</script>

<ul>
  {#each voteList as [voter, votedFor]}
    <li>{voter} voted for {votedFor}</li>
  {/each}
</ul>
