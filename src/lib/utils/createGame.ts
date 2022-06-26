import gameStoreStore from '$lib/stores/gameStoreStore';
import { RealtimeWritable } from '$lib/stores/realtimeStore';
import { GameState, type Game, type Round } from '$lib/types/game';

export const blankRound: Round = {
	question: {
		question: ''
	},
	answers: []
};

export async function createOrJoinGame(
	roomCode: string,
	playerId: string,
	playerName: string
): Promise<RealtimeWritable<Game> | false> {
	// First, try to join an existing game (check if the document exists)
	try {
		// Check if it exists (if it doesn't, this will throw)
		const gameStore = await RealtimeWritable.newExistingStore<Game>(`games/${roomCode}`);

		// If the game has already started, we can't join it unless we're in the lobby already
		const userInGame = gameStore.value.players.find(player => player.id === playerId) !== undefined ? true : false;
		const gameStarted = gameStore.value.state !== GameState.WAITING_FOR_PLAYERS;

		if (gameStarted && !userInGame) {
			return false
		}

		// Add the player to the game
		await gameStore.commit({
			players: [
				{
					name: playerName,
					id: playerId,
				}
			]
		});

		gameStoreStore.set(gameStore);

		return gameStore;
	} catch (error) {
		// The game doesn't exist, so create it
		const gameStore = await RealtimeWritable.newFromInitial<Game>(`games/${roomCode}`, {
			id: crypto.randomUUID(),
			players: [
				{
					id: playerId,
					name: playerName
				}
			],
			roomCode: roomCode,
			state: GameState.WAITING_FOR_PLAYERS,
			roundNum: 0,
			owner: playerId,
			currentRound: blankRound
		});

		gameStoreStore.set(gameStore);

		return gameStore;
	}
}
