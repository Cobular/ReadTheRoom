<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import { GameState, type Game, type Question, type Round } from '$lib/types/game';
	import RawVoteDisplay from '../rawVoteDisplay.svelte';

	export let gameStore: RealtimeWritable<Game>;
	export let thisUserId: string;

	let selectedUserId: string;

	let hasSubmitted = false;

	async function handleSubmit(e: Event) {
		// Only go to the view results state if this is the last response needed
		const nextState: GameState =
			$gameStore.currentRound.answers?.length === $gameStore.players.length - 1
				? GameState.VIEW_RESULTS
				: GameState.ANSWERING;

		console.log({ nextState });

		const newData: Partial<Game> = {
			currentRound: {
				question: $gameStore.currentRound?.question as unknown as Question,
				answers: [
					...($gameStore.currentRound?.answers ?? []),
					{
						answer: selectedUserId,
						id: thisUserId
					}
				]
			},
			state: nextState
		};

		await gameStore.commit(newData);

		hasSubmitted = true;
	}

	const playersNotSelf = $gameStore.players.filter((player) => player.id !== thisUserId);
</script>

<p>The question was:</p>
<p>{$gameStore.currentRound?.question.question}</p>

{#if hasSubmitted === false}
	<p>Who do you think is the most like this? Choose one person (you can't choose yourself):</p>

	<form on:submit|preventDefault={handleSubmit}>
		<select bind:value={selectedUserId}>
			{#each playersNotSelf as player (player.id)}
				<option value={player.id}>{player.name}</option>
			{/each}
		</select>

		<input type="submit" value="Submit!" />
	</form>
{:else}
	<p>Waiting for other players to submit their answers...</p>

	<RawVoteDisplay {gameStore} />
{/if}
