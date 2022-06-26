<script lang="ts">
	import authStore from '$lib/stores/authStore';

	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import { GameState, type Game, type Player } from '$lib/types/game';
	import { getAsker, isPlayerAsker } from '$lib/utils/users';

	export let gameStore: RealtimeWritable<Game>;
	export let thisUserId: string;

	const asker: Player = getAsker($gameStore);

	function handleSubmit(e: Event) {
		const form = e.target as HTMLFormElement;
		const question = form.question.value as string;

		gameStore.commit({
			currentRound: {
				question: {
					question
				},
				answers: []
			},
      state: GameState.ANSWERING,
		});
	}
</script>

{#if isPlayerAsker($gameStore, thisUserId)}
	<p>You are the asker! Ask a question below</p>

	<form on:submit|preventDefault={handleSubmit}>
		<label for="question">Question</label>
		<input type="text" name="question" placeholder="Question" />
		<input type="submit" value="Ask!" />
	</form>
{:else}
	<p>Wait for {asker.name} to ask a question.</p>
{/if}
