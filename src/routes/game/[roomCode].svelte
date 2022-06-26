<script lang="ts">
	import { goto } from '$app/navigation';
	import Answering from '$lib/components/gameStates/answering.svelte';
	import AskQuestion from '$lib/components/gameStates/ask_question.svelte';
	import CoinFlip from '$lib/components/gameStates/coin_flip.svelte';
	import Finished from '$lib/components/gameStates/finished.svelte';
	import NoReveal from '$lib/components/gameStates/no_reveal.svelte';
	import Reveal from '$lib/components/gameStates/reveal.svelte';
	import Starting from '$lib/components/gameStates/starting.svelte';
	import ViewResults from '$lib/components/gameStates/view_results.svelte';
	import WaitingForPlayers from '$lib/components/gameStates/waiting_for_players.svelte';
	import authStore from '$lib/stores/authStore';
	import gameStoreStore from '$lib/stores/gameStoreStore';
	import { GameState } from '$lib/types/game';
	import { getPlayer } from '$lib/utils/users';

	// If there is no data in the store, go back home
	if ($gameStoreStore === undefined) {
		goto('/');
	}

	const gameStore = $gameStoreStore;

	let thisUserId = $authStore.user !== undefined ? $authStore.user.uid : '';

	if (thisUserId === '') {
		goto('/');
	}
</script>

<div
	class="grid grid-cols-[150px,1fr] grid-rows-[min-content,auto] gap-10 pt-5 <md:grid-cols-1"
>
	<div>
		<p>Game Stats:</p>
		<p>Room Code: {$gameStore.roomCode}</p>
		<p>Your name: {getPlayer($gameStore, thisUserId)?.name}</p>
	</div>

	<div class="row-start-2 col-span-2 100% flex flex-col items-center">
		<div>
			{#if $gameStore.state === GameState.WAITING_FOR_PLAYERS}
				<WaitingForPlayers {gameStore} />
			{:else if $gameStore.state === GameState.STARTING}
				<Starting {gameStore} />
			{:else if $gameStore.state === GameState.ASK_QUESTION}
				<AskQuestion {gameStore} {thisUserId} />
			{:else if $gameStore.state === GameState.ANSWERING}
				<Answering {gameStore} {thisUserId} />
			{:else if $gameStore.state === GameState.VIEW_RESULTS}
				<ViewResults {gameStore} {thisUserId} />
			{:else if $gameStore.state === GameState.COIN_FLIP}
				<CoinFlip {gameStore} {thisUserId} />
			{:else if $gameStore.state === GameState.REVEAL}
				<Reveal {gameStore} {thisUserId} />
			{:else if $gameStore.state === GameState.NO_REVEAL}
				<NoReveal {gameStore} {thisUserId} />
			{:else if $gameStore.state === GameState.FINISHED}
				<Finished {gameStore} />
			{/if}
		</div>
	</div>
</div>
