import { GameState } from "$lib/types/game";

type StateTransitions = {
  [key in GameState]: GameState[];
}

const stateTransitions: StateTransitions = {
  WAITING_FOR_PLAYERS: [GameState.STARTING],
  STARTING: [GameState.ASK_QUESTION],
  ASK_QUESTION: [GameState.ANSWERING],
  ANSWERING: [GameState.VIEW_RESULTS],
  VIEW_RESULTS: [GameState.COIN_FLIP],
  COIN_FLIP: [GameState.REVEAL, GameState.NO_REVEAL],
  REVEAL: [GameState.ASK_QUESTION, GameState.FINISHED],
  NO_REVEAL: [GameState.ASK_QUESTION, GameState.FINISHED],
  FINISHED: [],
}

/// Checks that a transition is valid.
export function validateTransition(currentState: GameState, nextState: GameState): boolean {
  return stateTransitions[currentState].includes(nextState);
}
