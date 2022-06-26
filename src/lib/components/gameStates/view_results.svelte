<script lang="ts">
	import type { RealtimeWritable } from '$lib/stores/realtimeStore';
	import { GameState, type Game } from '$lib/types/game';
import { getAsker, getPlayer, isPlayerAsker } from '$lib/utils/users';
import { identity } from 'svelte/internal';
import RawVoteDisplay from '../rawVoteDisplay.svelte';

	export let gameStore: RealtimeWritable<Game>;
  export let thisUserId: string;

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
  const aggregatedVoteArray: [string, number][] = Object.keys(aggregatedVotes).map((key) => [key, aggregatedVotes[key]]);

  let timer = 5;

  function countdown() {
    if (timer > 0) {
      timer--;
      setTimeout(countdown, 1000);
    } else {
      if (isPlayerAsker($gameStore, thisUserId)) {
        gameStore.commit({
          state: GameState.COIN_FLIP
        });
      }
    }
  }
</script>

<h1>The votes are in!</h1>

{#each aggregatedVoteArray as voteElement (voteElement[0])}
  <p>{getPlayer($gameStore, voteElement[0])?.name} was voted for {voteElement[1]} times</p>
{/each}

{#if isPlayerAsker($gameStore, thisUserId)}
  <p>Here's the skinny, just for you:</p>
  
  <RawVoteDisplay {gameStore} />

  <p>Flip the coin when you're ready to see if everyone else gets to know:</p>

  <button on:click={() => {
    countdown();
  }}>Flip it!!</button>

{:else}
  <p>Ask {getAsker($gameStore).name} to flip the coin!</p>
{/if}

