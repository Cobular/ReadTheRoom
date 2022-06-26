<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import { GameState, type Game } from '$lib/types/game';
	import { isPlayerAsker } from '$lib/utils/users';

	export let gameStore: RealtimeWritable<Game>;
	export let thisUserId: string;

	function setNextState() {
		if (isPlayerAsker($gameStore, thisUserId)) {
			const coin = Math.random() < 0.5;

			gameStore.commit({
				state: coin ? GameState.REVEAL : GameState.NO_REVEAL
			});
		}
	}

	let timer = 3;

	function countdown() {
		if (timer > 1) {
			timer--;
			setTimeout(countdown, 1000);
		} else {
			setNextState();
		}
	}

  countdown()
</script>

<p>Woooooo coin flipping............</p>

<p>{timer}</p>
