<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import type { Game } from '$lib/types/game';

	export let gameStore: RealtimeWritable<Game>;
</script>