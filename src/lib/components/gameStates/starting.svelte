<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import { GameState, type Game } from '$lib/types/game';

	export let gameStore: RealtimeWritable<Game>;

  setTimeout(() => {
    gameStore.commit({
      state: GameState.ASK_QUESTION
    });
  }, 5000);
</script>

<p>Game starting up...</p>