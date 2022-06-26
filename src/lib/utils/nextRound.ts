import type { RealtimeWritable } from "$lib/stores/realtimeStore";
import { GameState, type Game } from "$lib/types/game";
import { blankRound } from "./createGame";

// To go to a new round, we need to:
//   1. Clear out a bunch of the old data
//      - The current round votes
//   2. Update the roundNum
export function nextRound(gameStore: RealtimeWritable<Game>): void {
  const game = gameStore.value;

  game.currentRound = blankRound;
  game.roundNum++;
  game.state = GameState.ASK_QUESTION;
  gameStore.hard_set(game);
}