export interface Player {
  id: string
  name: string,
  score?: number
}

export enum GameState {
  WAITING_FOR_PLAYERS = "WAITING_FOR_PLAYERS",
  STARTING = "STARTING",
  ASK_QUESTION = "ASK_QUESTION",
  ANSWERING = "ANSWERING",
  VIEW_RESULTS = "VIEW_RESULTS",
  COIN_FLIP = "COIN_FLIP",
  REVEAL = "REVEAL",
  NO_REVEAL = "NO_REVEAL",
  FINISHED = "FINISHED",
}

export interface Question {
  question: string
}

export interface Answer {
  answer: string
  id: string
}

export interface Round {
  question: Question
  answers: Answer[]
}

/// The interface for a single game object.
export interface Game {
  /// The ID of the game
  id: string;
  /// The room code associated to the game
  roomCode: string;
  /// The list of players in the game
  players: Player[];
  /// The current state of the game
  state: GameState;
  /// The current round index. The current player who chooses a question is found by modulus this with the number of players.
  roundNum: number;
  /// The current round
  currentRound?: Round;
  /// The ID of the player who first started the game
  owner: string;
}